var express = require('express');
var router = express.Router();

// Controllers
const article_controller = require('../controllers/articleController');

// Routes
router.get('/article/:articleId', article_controller.article_detail);

module.exports = router;