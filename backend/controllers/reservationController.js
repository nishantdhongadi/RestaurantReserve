const Reservation = require('../models/reservation');
const { validationResult } = require('express-validator');

// Create a new reservation
exports.createReservation = async (req, res) => {
    try {
        const { restaurantId, date, time, numberOfGuests, notes } = req.body;
        const userId = req.user ? req.user.userId : null;

        // Log received parameters
        console.log('createReservation - Received parameters:', {
            userId,
            restaurantId,
            date,
            time,
            numberOfGuests,
            notes,
        });

        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        const reservation = await Reservation.createReservation(
            userId,
            restaurantId,
            date,
            time,
            numberOfGuests,
            notes
        );

        console.log('createReservation - Created reservation:', reservation);
        res.status(201).json(reservation);
    } catch (error) {
        console.error('Error in createReservation:', error);
        res.status(500).json({ message: 'Server error while creating reservation' });
    }
};

// Controller function to get reservations for the logged-in user
exports.getUserReservations = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;

        // Log received parameters
        console.log('getUserReservations - Received userId:', userId);

        const reservations = await Reservation.getReservationsByUser(userId);
        console.log('getUserReservations - Retrieved reservations:', reservations);

        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ message: 'No reservations found for this user' });
        }

        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error in getUserReservations:', error);
        res.status(500).json({ message: 'Server error while fetching reservations' });
    }
};

// Fetch reservations for a specific restaurant
exports.getRestaurantReservations = async (req, res) => {
    const { restaurantId } = req.params;

    // Log received parameters
    console.log('getRestaurantReservations - Received restaurantId:', restaurantId);

    try {
        const reservations = await Reservation.getReservationsByRestaurant(restaurantId);
        console.log('getRestaurantReservations - Retrieved reservations:', reservations);
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error in getRestaurantReservations:', error);
        res.status(500).json({ message: 'Server error while fetching restaurant reservations' });
    }
};

// Update reservation status
exports.updateReservationStatus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { reservationId } = req.params;
        const { status } = req.body;

        // Log received parameters
        console.log('updateReservationStatus - Received parameters:', {
            reservationId,
            status,
        });

        const updatedReservation = await Reservation.updateReservationStatus(reservationId, status);
        console.log('updateReservationStatus - Updated reservation:', updatedReservation);

        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(updatedReservation);
    } catch (error) {
        console.error('Error in updateReservationStatus:', error);
        res.status(500).json({ message: 'Server error while updating reservation status' });
    }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;

        // Log received parameters
        console.log('deleteReservation - Received reservationId:', reservationId);

        const deletedReservation = await Reservation.deleteReservation(reservationId);
        console.log('deleteReservation - Deleted reservation:', deletedReservation);

        if (!deletedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation successfully deleted', reservation: deletedReservation });
    } catch (error) {
        console.error('Error in deleteReservation:', error);
        res.status(500).json({ message: 'Server error while deleting reservation' });
    }
};