var express = require('express');
var router = express.Router();

// Controllers
const story_controller = require('../controllers/storyController');

// Routes
router.get('/story/:storyId', story_controller.story_detail);

module.exports = router;   