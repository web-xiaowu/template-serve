const mongoose = require('mongoose')

const MenuSchema = new mongoose.Schema({
    // 菜单名称
    name: String,
    // 菜单路径
    path: String,
    // 菜单icon
    icon: String,
    // 菜单类型 1: 菜单 2: 按钮
    type: {
        type: Number,
        default: 1
    },
    // 权限标识 （按钮）
    code: String,
    // 菜单状态
    state: {
        type: Boolean,
        default: true
    },
    // 组件
    component: String,
    // 父级菜单id
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    // 创建时间
    create_time: {
        type: String,
        default: Date.now()
    }
})

// 创建权限与菜单的索引
MenuSchema.index({ parentId: 1 })

const Menu = mongoose.model('menus', MenuSchema)

module.exports = Menu
