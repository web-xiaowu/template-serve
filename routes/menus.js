const router = require('koa-router')()
router.prefix('/menus')
const { createMenu, deleteMenu, updateMenuState, updateMenuInfo, getMenuList, findMenuList } = require('../controller/menuController')
const {auth} = require("../middleware/auth")

router.post('/add', auth, createMenu)

router.delete('/delete/:id', auth, deleteMenu)

router.put('/:id/state/:state', auth, updateMenuState)

router.put('/:id', auth, updateMenuInfo)

// 获取动态路由菜单
router.get('/list', getMenuList)

// 菜单列表
router.get('/find', auth, findMenuList)

module.exports = router
