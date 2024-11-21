const pool = require('./db');

class Restaurant {
    static async addRestaurant(name, address, phone, email, cuisine, hours, rating, tableNumber) {
        try {
            const idResult = await pool.query('SELECT COALESCE(MAX(restaurantId), 0) + 1 as next_id FROM Restaurants')
            const restaurantId = idResult.rows[0].next_id;

            const query = `INSERT INTO Restaurants (RestaurantID, Name, Address, PhoneNumber, Email, Cuisine, OperatingHours, AverageRating, TableNumber)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                Returning *;`;
            const {rows} = await pool.query(query, [
                restaurantId,
                name,
                address,
                phone,
                email,
                cuisine,
                hours,
                rating,
                tableNumber
            ]);

            return rows[0];
        } catch (error) {
            console.error('Error in adding Restaurant:', error);
            throw error;
        }
    }

    static async getAllRestaurants() {
        try {
            const query = `SELECT * FROM Restaurants`;
            const {rows} = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error in getAllRestaurants:', error);
            throw error;
        }
    }

    static async getRestaurant(restaurantId){
        try {
            const query = `SELECT * 
                        FROM Restaurants    
                        WHERE RestaurantID = $1`;
            const {rows} = await pool.query(query, [restaurantId]);

            return rows[0];
        } catch (error) {
            console.error('Error in getRestaurant:', error);
            throw error;
        }
    }

    static async updateRestaurant(restaurantId, name, address, phone, email, cuisine, hours, rating, tableNumber) {
        try {
            const query = `
                UPDATE Restaurants
                SET Name = $1, Address = $2, PhoneNumber = $3, Email = $4, Cuisine = $5, OperatingHours = $6, AverageRating = $7, TableNumber = $8
                WHERE RestaurantID = $9
                RETURNING *;
            `;
            const {rows} = await pool.query(query, [
                name,
                address,
                phone,
                email,
                cuisine,
                hours,
                rating,
                tableNumber,
                restaurantId
            ]);

            return rows[0]; 
        } catch (error) {
            console.error('Error in updateRestaurant:', error);
            throw error;
        }
    }

    static async deleteRestaurant(restaurantId) {
        try {
            const query = `DELETE FROM Restaurants 
                        WHERE RestaurantID = $1
                        Returning *;`;
            const {rows} = await pool.query(query, [restaurantId]);

            return rows[0]; 
        } catch (error) {
            console.error('Error in deleteRestaurant:', error);
            throw error;
        }
    }
};

module.exports = Restaurant;