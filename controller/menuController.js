const Menu = require('../models/menus')
const Role = require('../models/roles')
const { success, fail, pageQuery, error, treeList, page} = require('../utils')
const { debug, info } = require('../utils/log4js')
const { generateToken, verifyToken } = require('../utils/jwt')

class MenuController{
    // 添加菜单
    static async createMenu (ctx) {
        const params = ctx.request.body
        await Menu.findOne({ name: params.name }).then(async result => {
            if (result) return ctx.body = fail('菜单已存在！')
            await Menu.create(params).then(result => {
                if (!result) return ctx.body = fail('添加菜单失败！')
                ctx.body = success('添加菜单成功！')
            }).catch(err => {
                console.log(err)
            })
        })
    }

    // 删除菜单
    static async deleteMenu (ctx) {
        const { id } = ctx.params
        await Menu.findByIdAndDelete({ _id: id }).then(async result => {
            if (!result) return ctx.body = fail('删除菜单失败！')
            debug('删除菜单' + result)
            await Menu.findOneAndDelete({ parentId: result._id }).then(async result => {
                if (result) await Menu.findByIdAndDelete({ parentId: result._id })
            })
            ctx.body = success('删除菜单成功！')
        })
    }

    // 更新菜单状态
    static async updateMenuState (ctx) {
        const { id, state } = ctx.params
        await Menu.updateOne({ _id: id }, { state }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新菜单状态失败！')
            ctx.body = success('更新菜单状态成功！')
        })
    }

    // 更新菜单信息
    static async updateMenuInfo (ctx) {
        const { id } = ctx.params
        const { name, icon, path, component, code } = ctx.request.body
        await Menu.updateOne({ _id: id }, { name, icon, path, component, code }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新菜单信息失败！')
            ctx.body = success('更新菜单信息成功！')
        })
    }

    // 获取菜单数据列表 (权限菜单)
    static async getMenuList (ctx) {
        const token = ctx.headers.authorization.split('Bearer ')[1]
        const userInfo = verifyToken(token)
        if (!userInfo.success) {
            ctx.status = 401
            return ctx.body = fail('用户认证失败！', 401)
        }
        await Role.findOne({ _id: userInfo.payload.role }).populate('permissions').then(async result => {
            if (!result) return ctx.body = fail('获取角色信息失败！')
            let menuIdList = result.permissions.map(item => item.menu)
            await Menu.find({ _id: {$in: menuIdList}, state: true }).then(async result => {
                if (!result) return ctx.body = fail('获取菜单数据列表失败！')
                const data = await treeList(result, null, [])
                ctx.body = success('获取菜单数据列表成功！', data)
            })
        })
    }

    // 分页的菜单列表
    static async findMenuList (ctx) {
        await Menu.find().then(async result => {
            if (!result) return ctx.body = fail('获取菜单数据列表失败！')
            const data = await treeList(result, null, [])
            ctx.body = success('获取用户数据列表成功！', data)
        })

    }
}


module.exports = MenuController
