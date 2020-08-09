const feedController = require('../controllers/feedController');
const authController = require('../controllers/authController');
const express = require('express');

const router = express.Router();
  
router.route('/').get(authController.protect, feedController.showFollowingFeed);

router
  .route('/showfeed')
  .get(authController.protect, feedController.showFullFeed);


module.exports = router;
