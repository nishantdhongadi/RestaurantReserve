const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const restaurantController = require('../controllers/restaurantController');

router.post('/', auth, reviewController.createReview);

router.delete('/reviews/:reviewId', auth, reviewController.deleteReview);

router.put('/reviews/:reviewId', auth, reviewController.editReview);

router.get('/reviews/user/:userId', auth, reviewController.getReviewsByUser);

router.get('/reviews/restaurant/:restaurantId', auth, reviewController.getReviewsByRestaurant);

router.get('/reviews/rating/:ratingValue', auth, reviewController.getReviewsByValue);

module.exports = router;