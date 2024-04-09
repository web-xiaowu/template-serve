const User = require('../models/users')
const Role = require('../models/roles')
const Menu = require('../models/menus')
const { success, fail, pageQuery, error, page} = require('../utils')
const { debug, info } = require('../utils/log4js')
const { generateToken, verifyToken } = require('../utils/jwt')

class UserController{
    // 添加用户
    static async createUser (ctx) {
        const params = ctx.request.body
        await User.findOne({ username: params.username }).then(async result => {
            if (result) return ctx.body = fail('用户已存在！')
            await User.create(params).then(result => {
                if (!result) return ctx.body = fail('添加用户失败！')
                ctx.body = success('添加用户成功！')
            })
        })
    }

    // 删除用户
    static async deleteUser (ctx) {
        const { id } = ctx.params
        await User.findByIdAndDelete({ _id: id }).then(result => {
            if (!result) return ctx.body = fail('删除用户失败！')
            debug('删除用户' + result)
            ctx.body = success('删除用户成功！')
        })
    }

    // 更新用户状态
    static async updateUserState (ctx) {
        const { id, state } = ctx.params
        await User.updateOne({ _id: id }, { state }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新用户状态失败！')
            ctx.body = success('更新用户状态成功！')
        })
    }

    // 更新用户信息
    static async updateUserInfo (ctx) {
        const { id } = ctx.params
        const { email, phone, sex } = ctx.request.body
        await User.updateOne({ _id: id }, { email, phone, sex }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新用户信息失败！')
            ctx.body = success('更新用户信息成功！')
        })
    }

    // 根据id获取用户信息D
    static async getUserById (ctx) {
        const { id } = ctx.params
        await User.findOne({ _id: id }).then(result => {
            if (!result) return ctx.body = fail('获取用户信息失败！')
            ctx.body = success('获取用户信息成功！')
        })
    }

    // 获取用户数据列表
    static async getUserList (ctx) {
        const { query } = ctx.query
        const like = {
            $or: [
                { username: { $regex: new RegExp(query, 'i') } }
            ]
        }
        const result = await pageQuery(ctx, User, like, 'role')
        if (!result) return ctx.body = fail('获取用户数据列表失败！')
        ctx.body = page('获取用户数据列表成功！', result.data, result.total, result.count)
    }

    // 用户登入
    static async UserLogin (ctx) {
        const {username, password} = ctx.request.body
        console.log(username, password)
        if (!username || !password) return ctx.body = fail('参数错误', 400)
        await User.findOne({ username, state: true }).then(async result => {
            if (!result) return ctx.body = fail('该用户已被禁用，请联系管理员！')
            const valid = result.isValidPassword(password)
            if (!valid) return ctx.body = fail('用户名或密码错误！', 402)
            let userInfo = await User.findByIdAndUpdate({ _id: result._id }, { last_login_time: Date.now() })
            userInfo = userInfo._doc
            let data = {
                _id: userInfo._id,
                username: userInfo.username,
                token: 'Bearer ' + generateToken(userInfo)
            }
            ctx.body = success('登入成功！', data)
        })
    }

    // 更新用户角色
    static async updateUserRole(ctx) {
        const { id, role } = ctx.params
        await User.updateOne({ _id: id }, { role }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新用户角色失败！')
            ctx.body = success('更新用户角色成功！')
        })
    }

    static async test(ctx) {
        await User.findOne({ username: 'admin' }).populate('role').then(async result => {
            if (!result) return ctx.body = fail('error')
            const data = result._doc
            const per = await Role.findOne({ _id:  data.role._id}).populate('permissions')
            let menuId = []
            menuId = per.permissions.map(item => item.menu)
            const menuList = await Menu.find({ _id: { $in: menuId } })
            ctx.body = success('ok', menuList)
        })
    }
}


module.exports = UserController
