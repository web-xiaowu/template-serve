const Menu = require('../models/menus')
const Role = require('../models/roles')
const Api = require('../models/apis')
const { success, fail, pageQuery, error, treeList } = require('../utils')
const { debug, info } = require('../utils/log4js')
const { generateToken, verifyToken } = require('../utils/jwt')

// const API_PATH_REGEX = /^\/api\/menus\/([a-zA-Z0-9]+)\/state\/(true|false)$/

/***
 * 验证用户权限
 * @param ctx
 * @param next
 * @returns {Promise<{msg: string, status: number}>}
 */
const auth = async (ctx, next) => {
    const path = ctx.path
    const method = ctx.method
    const authorHeader = ctx.headers.authorization
    // 验证是否存在token
    if (!authorHeader) {
        ctx.status = 401
        return ctx.body = fail('用户认证失败！', 401)
    }

    const token = authorHeader.split('Bearer ')[1]
    const userInfo = verifyToken(token)
    if (!userInfo.success) {
        ctx.status = 401
        return ctx.body = fail('用户认证失败！', 401)
    }
    // 根据用户的角色获取对应的权限
    const permissions = await Role.findOne({ _id: userInfo.payload.role }).populate('permissions')
    // 拥有权限的路由
    const api = permissions.permissions.map(item => item.api).filter(item => item !== null)
    const pathList = await Api.find({ _id: { $in: api } })
    let apiList = pathList.map(item => { return {api: item.api, method: item.method} })
    apiList = apiList.filter(item => item.method === method)

    const regexPermissions = apiList.map(p => new RegExp('^' + p.api.replace(/\*/g, '[a-zA-Z0-9]+').replace(/\//g, '\\/') + '$'));
    // 是否拥有改权限
    let isPermission = regexPermissions.some(item => item.test(path))

    // // 验证修改
    if (!isPermission) return ctx.body = fail('抱歉您无此权限！')

    await next()
}


module.exports = {
    auth
}
