const mongoose = require('mongoose')
const { salt } = require('../config')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    // 用户名
    username: String,
    // 密码
    password: String,
    // 启用状态
    state: {
        type: Boolean,
        default: true
    },
    // 邮箱
    email: String,
    // 电话
    phone: String,
    sex: {
        type: String,
        default: '男'
    },
    // 角色
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles'
    },
    // 创建时间
    create_time: {
        type: String,
        default: Date.now()
    },
    // 上次登入时间
    last_login_time: {
        type: String,
        default: Date.now()
    }
})

// 创建用户与角色的索引
UserSchema.index({ role: 1 })

// 使用bcrypt对密码进行加密
UserSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified('password')) return next()
    user.password = await bcrypt.hash(user.password, await salt)
    next()
})

// 验证密码
UserSchema.methods.isValidPassword = async function(password) {
    const user = this
    return bcrypt.compare(password, user.password)
}

const User = mongoose.model('users', UserSchema)

module.exports = User
