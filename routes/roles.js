const router = require('koa-router')()
router.prefix('/roles')
const { createRole, deleteRole, updateRoleInfo, updatePermissionInfo, getRoleList } = require('../controller/roleController')
const {auth} = require("../middleware/auth");

router.post('/add', auth, createRole)

router.delete('/delete/:id', auth, deleteRole)

router.get('/list', auth, getRoleList)

router.put('/:id/rights', auth, updatePermissionInfo)

router.put('/:id', auth, updateRoleInfo)

module.exports = router
