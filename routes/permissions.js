const router = require('koa-router')()
router.prefix('/permissions')
const { createPermission, deletePermission,  updatePermissionInfo, getPermissionList } = require('../controller/permissionController')
const {auth} = require("../middleware/auth");

router.post('/add', auth, createPermission)

router.delete('/delete/:id', auth, deletePermission)

router.put('/:id', auth, updatePermissionInfo)

router.get('/list', auth, getPermissionList)

module.exports = router
