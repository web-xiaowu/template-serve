const mongoose = require('mongoose')

// 分类的模型
const CategorySchema = new mongoose.Schema({
    // 分类名称
    name: String,
    // 分类状态
    state: {
        type: Boolean,
        default: true
    },
    // 创建时间
    create_time: {
        type: String,
        default: Date.now()
    }
})
CategorySchema.index({ name: 1 })

const Category = mongoose.model('categorys', CategorySchema)

module.exports = Category
