const Api = require('../models/apis')
const { success, fail, pageQuery, error, treeList } = require('../utils')
const { debug, info } = require('../utils/log4js')

class ApiController{
    // 添加接口
    static async createApi (ctx) {
        const params = ctx.request.body
        await Api.findOne({ name: params.name }).then(async result => {
            if (result) return ctx.body = fail('接口已存在！')
            await Api.create(params).then(result => {
                if (!result) return ctx.body = fail('添加api失败！')
                ctx.body = success('添加api成功！')
            })
        })
    }

    // 删除接口
    static async deleteApi (ctx) {
        const { id } = ctx.params
        await Api.findByIdAndDelete({ _id: id }).then(result => {
            if (!result) return ctx.body = fail('删除api失败！')
            debug('删除api' + result)
            ctx.body = success('删除api成功！')
        })
    }

    // 更新接口信息
    static async updateApiInfo (ctx) {
        const { id } = ctx.params
        const { api, name, description, method } = ctx.request.body
        await Api.updateOne({ _id: id }, { api, name, description, method }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新api信息失败！')
            ctx.body = success('更新api信息成功！')
        })
    }

    // 更新接口状态
    static async updateApiState (ctx) {
        const { id, state } = ctx.params
        await Api.updateOne({ _id: id }, { state }).then(result => {
            if (!result || result.modifiedCount === 0) return ctx.body = fail('更新api状态失败！')
            ctx.body = success('更新api状态成功！')
        })
    }

    // 获取接口数据列表
    static async getApiList (ctx) {
        await Api.find().then(async result => {
            if (!result) return ctx.body = fail('获取接口数据列表失败！')
            ctx.body = success('获取接口数据列表成功！', result)
        })
    }
}

module.exports = ApiController
