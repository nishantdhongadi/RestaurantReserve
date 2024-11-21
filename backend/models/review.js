const pool = require('./db');

class Review{
    static async createReview(userId, restaurantId, rating, comment, date){
        try{

            const idResult = await pool.query('SELECT COALESCE(MAX(reviewId), 0) + 1 as next_id FROM Reviews');
            const reviewId = idResult.rows[0].next_id;

            const query = `INSERT INTO Reviews (ReviewID, UserID, RestaurantID, RatingValue, Comment, DatePosted)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    Returning *;`;
            const {rows} = await pool.query(query, [
                reviewId,
                userId,
                restaurantId,
                rating,
                comment,
                date
            ]);

            return rows[0];
        }
        catch(error){
            console.error('Error in adding Review:', error);
            throw error;
        }
    }
    

    static async deleteReview(reviewId){
        try{
            const query = `DELETE FROM Reviews
                        WHERE ReviewID = $1
                        Returning *;`;

            const {rows} = await pool.query(query, [reviewId]);
            return rows[0];
        } catch (error) {
            console.error('Error in deleting reviewt:', error);
            throw error;
        }
    }

    static async editReview(reviewId, comment, rating){
        try {
            
            const query = `
                UPDATE Reviews
                SET Comment = $1, RatingValue = $2
                WHERE ReviewId = $3
            `;

            const {rows} = await pool.query(query, [
                reviewId,
                comment,
                rating
            ])

            return rows[0];

        } catch (error) {
            console.error('Error in uppdating review:', error);
            throw error;
        }
    }

    static async getReviewsByUser(userId){
        try {
            const query = `SELECT * 
                        FROM Reviews  
                        WHERE UserID = $1`;
            const {rows} = await pool.query(query, [userId]);

            return rows;
        } catch (error) {
            console.error('Error in get reviews by user:', error);
            throw error;
        }
    }

    static async getReviewsByRestaurant(restaurantId){
        try {
            const query = `SELECT * 
                        FROM Reviews  
                        WHERE RestaurantID = $1`;
            const {rows} = await pool.query(query, [restaurantId]);

            return rows;
        } catch (error) {
            console.error('Error in get reviews by restaurant:', error);
            throw error;
        }
    }

    static async getReviewsByValue(value){
        try {
            const query = `SELECT * 
                        FROM Reviews  
                        WHERE RatingValue = $1`;
            const {rows} = await pool.query(query, [value]);

            return rows;
        } catch (error) {
            console.error('Error in get reviews by restaurant:', error);
            throw error;
        }
    }
}

module.exports = Review;