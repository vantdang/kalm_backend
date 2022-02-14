const express = require('express')
const router = express.Router()

const ArticleController = require('../controllers/articles')

router.get('/', ArticleController.getAllArticles)
router.get('/:id', ArticleController.getSingleArticleById)
router.post('/', ArticleController.createArticle)
router.patch('/:id', ArticleController.updateArticle)
router.delete("/:id", ArticleController.deleteArticle)


module.exports = router