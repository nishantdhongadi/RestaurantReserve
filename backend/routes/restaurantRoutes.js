const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const restaurantController = require('../controllers/restaurantController');

router.post('/add', auth, restaurantController.addRestaurant);

router.get('/:restaurantId', auth, restaurantController.getRestaurant);

router.get('/', auth, restaurantController.getAllRestaurants);

router.put('/:restaurantId', auth, restaurantController.updateRestaurant);

router.delete('/:restaurantId', auth, restaurantController.deleteRestaurant);

module.exports = router;