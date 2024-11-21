const Review = require('../models/review');

exports.createReview = async (req, res) => {
    try {
        const { userId, restaurantId, rating, comment, date } = req.body;

        if (!userId || !restaurantId || !rating || !comment || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }

       const newReview = await Review.createReview(userId, restaurantId, rating, comment, date);

       return res.status(201).json(newReview);
    } catch (error) {
        console.error('Error in creating review:', error);
        return res.status(500).json({ message: "An error occurred while creating the review." });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const {reviewId} = req.params;

        if (!reviewId) {
            return res.status(400).json({ message: "Review ID is required." });
        }

        const deletedReview = await Review.deleteReview(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found." });
        }

        return res.status(200).json({ message: "Review deleted successfully.", review: deletedReview });
    } catch (error) {
        console.error('Error in deleting review:', error);
        return res.status(500).json({ message: "An error occurred while deleting the review." });
    }
};

exports.editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment, rating } = req.body;

        if (!reviewId || !comment || !rating) {
            return res.status(400).json({ message: "Review ID, comment, and rating are required." });
        }
        const updatedReview = await Review.editReview(reviewId, comment, rating);

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found." });
        }

        return res.status(200).json({ message: "Review updated successfully.", review: updatedReview });
    } catch (error) {
        console.error('Error in updating review:', error);
        return res.status(500).json({ message: "An error occurred while updating the review." });
    }
};

exports.getReviewsByUser = async (req, res) => {
    try {
        const {userId} = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const reviews = await Review.getReviewsByUser(userId);

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this user." });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error in getting reviews by user:', error);
        return res.status(500).json({ message: "An error occurred while retrieving reviews." });
    }
};

exports.getReviewsByRestaurant = async (req, res) => {
    try {
        const {restaurantId} = req.params;

        if (!restaurantId) {
            return res.status(400).json({ message: "Restaurant ID is required." });
        }
        const reviews = await Review.getReviewsByRestaurant(restaurantId);

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this restaurant." });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error in getting reviews by restaurant:', error);
        return res.status(500).json({ message: "An error occurred while retrieving reviews." });
    }
};

exports.getReviewsByValue = async (req, res) => {
    try {
        const {ratingValue} = req.params;

        if (!ratingValue) {
            return res.status(400).json({ message: "Rating value is required." });
        }
        const reviews = await Review.getReviewsByValue(ratingValue);

        if (!reviews.length) {
            return res.status(404).json({ message: `No reviews found with rating ${ratingValue}.` });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error in getting reviews by value:', error);
        return res.status(500).json({ message: "An error occurred while retrieving reviews." });
    }
};