const Role = require('../models/roles')
const { success, fail, pageQuery, error } = require('../utils')
const { debug, info } = require('../utils/log4js')
const { generateToken, verifyToken } = require('../utils/jwt')

class RoleController{
    // 添加角色
    static async createRole (ctx) {
        const params = ctx.request.body
        await Role.findOne({ name: params.name }).then(async result => {
            if (result) return ctx.body = fail('角色已存在！')
            await Role.create(params).then(result => {
                if (!result) return ctx.body = fail('添加角色失败！')
                ctx.body = success('添加角色成功！')
            })
        })
    }

    // 删除菜单
    static async deleteRole (ctx) {
        const { id } = ctx.params
        await Role.findByIdAndDelete({ _id: id }).then(result => {
            if (!result) return ctx.body = fail('删除角色失败！')
            debug('删除角色' + result)
            ctx.body = success('删除角色成功！')
        })
    }

    // 更新菜单信息
    static async updateRoleInfo (ctx) {
        const { id } = ctx.params
        const { name, description } = ctx.request.body
        await Role.updateOne({ _id: id }, { name, description }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新角色信息失败！')
            ctx.body = success('更新角色信息成功！')
        })
    }

    // 更新角色授权
    static async updatePermissionInfo (ctx) {
        const { id } = ctx.params
        const { permissionList } = ctx.request.body
        await Role.updateOne({ _id: id }, { permissions: permissionList }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新角色权限失败！')
            ctx.body = success('更新角色权限成功！')
        })
    }

    // 获取角色数据列表
    static async getRoleList (ctx) {
        await Role.find().then(result => {
            if (!result) return ctx.body = fail('获取角色列表失败！')
            ctx.body = success('获取角色列表成功！', result)
        })
    }
}


module.exports = RoleController
