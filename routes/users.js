const router = require('koa-router')()
router.prefix('/users')
const { createUser, UserLogin, test, getUserList, deleteUser, updateUserState, updateUserInfo, updateUserRole } = require('../controller/userController')
const { auth } = require('../middleware/auth')

router.post('/add', auth, createUser)

// 登入
router.post('/login', UserLogin)

// 测试使用
router.get('/test', test)

// 用户列表
router.get('/list', auth, getUserList)

// 根据id删除用户
router.delete('/delete/:id', auth, deleteUser)

// 修改用户的状态
router.put('/:id/state/:state', auth, updateUserState)

// 更新用户信息
router.put('/:id', auth, updateUserInfo)

router.put('/:id/role/:role', auth, updateUserRole)

module.exports = router
