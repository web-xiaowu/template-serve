const Permission = require('../models/permissions')
const { success, fail, pageQuery, error, treeList } = require('../utils')
const { debug, info } = require('../utils/log4js')
const { generateToken, verifyToken } = require('../utils/jwt')
const Menu = require("../models/menus")

class PermissionController{
    // 添加权限
    static async createPermission (ctx) {
        const params = ctx.request.body
        await Permission.findOne({ name: params.name }).then(async result => {
            if (result) return ctx.body = fail('权限已存在！')
            await Permission.create(params).then(result => {
                if (!result) return ctx.body = fail('添加权限失败！')
                ctx.body = success('添加权限成功！')
            }).catch(err => console.log(err))
        })
    }

    // 删除权限
    static async deletePermission (ctx) {
        const { id } = ctx.params
        await Permission.findByIdAndDelete({ _id: id }).then(async result => {
            if (!result) return ctx.body = fail('删除权限失败！')
            debug('删除权限' + result)
            await Permission.findOneAndDelete({ parentId: result._id }).then(async result => {
                if (result) await Permission.findByIdAndDelete({ parentId: result._id })
            })
            ctx.body = success('删除权限成功！')
        })
    }


    // 更新权限信息
    static async updatePermissionInfo (ctx) {
        const { id } = ctx.params
        const { name, description, menu, api, parentId } = ctx.request.body
        await Permission.updateOne({ _id: id }, { name, description, menu, api, parentId }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新权限信息失败！')
            ctx.body = success('更新权限信息成功！')
        }).catch(err => {
            console.log(err)
        })
    }

    // 获取权限数据列表
    static async getPermissionList (ctx) {
        await Permission.find().populate('menu').populate('api').then(async result => {
            const permissionList = await treeList(result, null, [])
            ctx.body = success('获取权限列表成功！', permissionList)
        })
    }
}

module.exports = PermissionController
