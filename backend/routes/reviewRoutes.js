const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

router.post('/', auth, reviewController.createReview);

router.delete('/:reviewId', auth, reviewController.deleteReview);

router.put('/:reviewId', auth, reviewController.editReview);

router.get('/user/:userId', auth, reviewController.getReviewsByUser);

router.get('/restaurant/:restaurantId', auth, reviewController.getReviewsByRestaurant);

router.get('/rating/:ratingValue', auth, reviewController.getReviewsByValue);

module.exports = router;