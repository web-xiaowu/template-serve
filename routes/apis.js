const router = require('koa-router')()
router.prefix('/apis')
const { createApi, deleteApi, updateApiInfo, getApiList, updateApiState } = require('../controller/apiController')
const {auth} = require("../middleware/auth");

router.post('/add', auth, createApi)

router.delete('/delete/:id', auth, deleteApi)

router.put('/:id/state/:state', auth, updateApiState)

router.put('/:id', auth, updateApiInfo)

router.get('/list', auth, getApiList)

module.exports = router
