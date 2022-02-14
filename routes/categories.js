const express = require('express')
const router = express.Router()
const CatController = require('../controllers/categories')

router.get('/',CatController.getAllCategories)

module.exports = router