const router = require('koa-router')()
router.prefix('/categorys')
const { createCategory, deleteCategory, updateCategoryInfo, updateCategoryState, getCategoryList } = require('../controller/categoryController')
const {auth} = require('../middleware/auth')

// 添加分类
router.post('/add', auth, createCategory)

router.delete('/delete/:id', auth, deleteCategory)

router.put('/:id/state/:state', auth, updateCategoryState)

router.put('/:id', auth, updateCategoryInfo)

router.get('/list', getCategoryList)

module.exports = router
