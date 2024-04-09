const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('@koa/cors')
const jwt = require('koa-jwt')
const router = require('koa-router')()
const db = require('./db')
const { info, error } = require('./utils/log4js')
const {secretKey} = require('./config')

// 连接数据库
db()

const users = require('./routes/users')
const menus = require('./routes/menus')
const roles = require('./routes/roles')
const permissions = require('./routes/permissions')
const apis = require('./routes/apis')
const categorys = require('./routes/categorys')
const {fail} = require("./utils");

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(cors())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        status: 401,
        msg: '用户认证失败！'
      }
    }
  }
})

app.use(jwt({
  secret: secretKey
}).unless({
  path: [/^\/api\/users\/login/]
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
router.prefix('/api')
router.use(users.routes(), users.allowedMethods())
router.use(menus.routes(), menus.allowedMethods())
router.use(roles.routes(), roles.allowedMethods())
router.use(permissions.routes(), permissions.allowedMethods())
router.use(apis.routes(), apis.allowedMethods())
router.use(categorys.routes(), categorys.allowedMethods())

app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
  ctx.throw(500, fail('服务端发生异常！', 500))
  error(err)
});

module.exports = app
