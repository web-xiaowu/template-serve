const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({
    // 角色名
    name: String,
    // 角色描述
    description: String,
    // 角色权限
    permissions: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'permissions'
    },
    // 创建时间
    create_time: {
        type: String,
        default: Date.now()
    }
})

// 创建角色与权限的索引
RoleSchema.index({ permissions: 1 })

const Role = mongoose.model('roles', RoleSchema)

module.exports = Role
