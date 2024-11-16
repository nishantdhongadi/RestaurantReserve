const Reservation = require('../models/reservation');
const { validationResult } = require('express-validator');


// Create a new reservation
exports.createReservation = async (req, res) => {
    try {
        const { restaurantId, date, time, numberOfGuests, notes } = req.body;
        const userId = req.user.userId;

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

        res.status(201).json(reservation);
    } catch (error) {
        console.error('Error in createReservation:', error);
        res.status(500).json({ message: 'Server error while creating reservation' });
    }
};



// Controller function to get reservations for the logged-in user
exports.getUserReservations = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract userId from the decoded JWT token

        const reservations = await Reservation.getReservationsByUser(userId);
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

    try {
        const reservations = await Reservation.getReservationsByRestaurant(restaurantId);
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

        const updatedReservation = await Reservation.updateReservationStatus(reservationId, status);
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
        const deletedReservation = await Reservation.deleteReservation(reservationId);
        
        if (!deletedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation successfully deleted', reservation: deletedReservation });
    } catch (error) {
        console.error('Error in deleteReservation:', error);
        res.status(500).json({ message: 'Server error while deleting reservation' });
    }
};

exports.updateReservationStatus = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { status } = req.body;

        // Validate input
        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedReservation = await Reservation.updateReservationStatus(reservationId, status);

        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json({ message: 'Reservation status updated successfully', reservation: updatedReservation });
    } catch (error) {
        console.error('Error in updateReservationStatus:', error);
        res.status(500).json({ message: 'Server error while updating reservation status' });
    }
};
