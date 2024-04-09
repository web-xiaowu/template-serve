const Category = require('../models/categorys')
const { success, fail, pageQuery, error, treeList, page} = require('../utils')
const { debug, info } = require('../utils/log4js')
const { generateToken, verifyToken } = require('../utils/jwt')

class CategoryController{
    // 添加分类
    static async createCategory (ctx) {
        const params = ctx.request.body
        await Category.findOne({ name: params.name }).then(async result => {
            if (result) return ctx.body = fail('分类已存在！')
            await Category.create(params).then(result => {
                if (!result) return ctx.body = fail('添加分类失败！')
                ctx.body = success('添加分类成功！')
            })
        })
    }

    // 删除分类
    static async deleteCategory (ctx) {
        const { id } = ctx.params
        await Category.findByIdAndDelete({ _id: id }).then(result => {
            if (!result) return ctx.body = fail('删除分类失败！')
            debug('删除分类' + result)
            ctx.body = success('删除分类成功！')
        })
    }

    // 更新分类信息
    static async updateCategoryInfo (ctx) {
        const { id } = ctx.params
        const { name } = ctx.request.body
        if (!name) return ctx.body = fail('参数错误', 400)
        await Category.updateOne({ _id: id }, { name }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新分类信息失败！')
            ctx.body = success('更新分类信息成功！')
        })
    }

    // 更新接口状态
    static async updateCategoryState (ctx) {
        const { id, state } = ctx.params
        await Category.updateOne({ _id: id }, { state }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新分类状态失败！')
            ctx.body = success('更新分类状态成功！')
        })
    }

    // 获取分类数据列表
    static async getCategoryList (ctx) {
        const { query } = ctx.query
        const like = {
            $or: [
                { title: { $regex: new RegExp(query, 'i') } }
            ]
        }
        const result = await pageQuery(ctx, Category, like)
        if (!result) return ctx.body = fail('获取分类数据列表失败！')
        ctx.body = page('获取分类数据列表成功！', result.data, result.total, result.count)
    }
}

module.exports = CategoryController
