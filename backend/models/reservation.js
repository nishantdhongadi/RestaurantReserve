const pool = require('./db');

class Reservation {
    static async getReservationsByRestaurant(restaurantId) {
        try {
            const query = `
                SELECT * FROM Reservations
                WHERE RestaurantID = $1
            `;
            const { rows } = await pool.query(query, [restaurantId]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching reservations for restaurant: ${error.message}`);
        }
    }

    // Add the deleteReservation method
    static async deleteReservation(reservationId) {
        try {
            const query = `
                DELETE FROM Reservations 
                WHERE ReservationID = $1 
                RETURNING *;
            `;
            const { rows } = await pool.query(query, [reservationId]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error deleting reservation: ${error.message}`);
        }
    }

    // Create a new reservation
    static async createReservation(userId, restaurantId, date, time, numberOfGuests, notes) {
        const status = 'pending';
        try {
            // Generate the next reservationId
            const idResult = await pool.query('SELECT COALESCE(MAX(reservationId), 0) + 1 as next_id FROM Reservations');
            const reservationId = idResult.rows[0].next_id;

            const query = `
                INSERT INTO Reservations (ReservationID, UserID, RestaurantID, ReservationDate, ReservationTime, NumberOfGuests, Notes, Status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;
            const values = [reservationId, userId, restaurantId, date, time, numberOfGuests, notes, status];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error creating reservation: ${error.message}`);
        }
    }

    static async getReservationsByUser(userId) {
        try {
            const query = `
                SELECT * FROM Reservations
                WHERE UserID = $1
                ORDER BY ReservationDate, ReservationTime;
            `;
            const { rows } = await pool.query(query, [userId]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching reservations for user: ${error.message}`);
        }
    }

    static async updateReservationStatus(reservationId, status) {
        try {
            const query = `
                UPDATE Reservations
                SET Status = $1
                WHERE ReservationID = $2
                RETURNING *;
            `;
            const values = [status, reservationId];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error updating reservation status: ${error.message}`);
        }
    }
}

module.exports = Reservation;
