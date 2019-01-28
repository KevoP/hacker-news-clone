var express = require('express');
var router = express.Router();

// Controllers
const story_controller = require('../controllers/storyController');

// Routes
router.get('/newest', story_controller.new_story_list);
module.exports = router;