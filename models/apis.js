const mongoose = require('mongoose')

const ApiSchema = new mongoose.Schema({
    // 接口名称
    name: String,
    // 接口
    api: String,
    // 接口类型
    method: String,
    // 接口描述
    description: String,
    // 创建时间
    state: {
        type: Boolean,
        default: true
    },
    create_time: {
        type: String,
        default: Date.now()
    }
})

// 创建权限与菜单的索引
ApiSchema.index({ api: 1 })

const Api = mongoose.model('apis', ApiSchema)

module.exports = Api
