const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
    // 文章标题
    title: String,
    // 文章简介
    brief: String,
    // 文章作者
    author: mongoose.Schema.Types.ObjectId,
    // 文章内容
    content: String,
    // 文章的分类 (可能有多个分类)
    category: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'categorys'
    },
    // 阅读数
    readNum: {
        type: Number,
        default: 0
    },
    // 评论数
    comment: {
        type: Number,
        default: 0
    },
    // 点赞数量
    like: {
        type: Number,
        default: 0
    },
    // 创建时间
    create_time: {
        type: String,
        default: Date.now()
    }
})

const Article = mongoose.model('articles', ArticleSchema)

module.exports = Article
