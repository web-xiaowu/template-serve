const mongoose = require('mongoose')

const PermissionSchema = new mongoose.Schema({
    // 权限名称
    name: String,
    // 权限描述
    description: String,
    // 菜单id
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menus'
    },
    // 父级权限id
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    // 接口
    api: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'apis',
        default: null
    },
    // 创建时间
    create_time: {
        type: String,
        default: Date.now()
    }
})

// 创建权限与菜单的索引
PermissionSchema.index({ menu: 1 })

const Permission = mongoose.model('permissions', PermissionSchema)

module.exports = Permission
