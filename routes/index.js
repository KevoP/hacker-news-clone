var express = require('express');
var router = express.Router();

// Controllers
const article_controller = require('../controllers/articleController');

// Routes
router.get('/', article_controller.article_list);

module.exports = router;