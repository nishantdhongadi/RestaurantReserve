const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');

// Create a new reservation
router.post('/', auth, reservationController.createReservation);

// Route to get all reservations for the logged-in user
router.get('/my-reservations', auth, reservationController.getUserReservations);


// Get all reservations for a specific restaurant
router.get('/restaurant/:restaurantId', auth, reservationController.getRestaurantReservations);


// Route to update reservation status
router.patch('/:reservationId/status', auth, reservationController.updateReservationStatus);

// Delete a reservation
router.delete('/:reservationId', auth, reservationController.deleteReservation);

module.exports = router;