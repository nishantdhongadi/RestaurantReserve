const Restaurant = require('../models/restaurant');

exports.addRestaurant = async (req, res) => {
    try{
        const {name, address, phone, email, cuisine, hours, rating, tableNumber} = req.body;
        const restaurant = await Restaurant.addRestaurant(name, address, phone, email, cuisine, hours, rating, tableNumber);
        res.status(201).json(restaurant);
    }
    catch(error){
        console.error('Error adding new Restaurant', error);
        res.status(500).json({message: 'Server error while adding restaurant'});
    }    
    
}

exports.getAllRestaurants = async (req, res) => {
    try{
        const restaurants = await Restaurant.getAllRestaurants();
        res.status(200).json(restaurants);
    } 
    catch(error){
        console.error('Error in getting restaurant', error);
        res.status(500).json({message: 'Server error while fetching restaurant'});
    }
}

exports.getRestaurant = async (req, res) => {
    try{
        const {restaurantId} = req.params;
        const restaurant = await Restaurant.getRestaurant(restaurantId);
        if (!restaurant){
            return res.status(404).json({message: 'Restaurant not found'});
        }
        res.status(200).json(restaurant);
    } 
    catch(error){
        console.error('Error in getting restaurant', error);
        res.status(500).json({message: 'Server error while fetching restaurant'});
    }
}

exports.updateRestaurant = async (req, res) => {
    try{
        const {restaurantId} = req.params;
        const {name, address, phone, email, cuisine, hours, rating, tableNumber} = req.body;
        const updateRestaurant = await Restaurant.updateRestaurant(restaurantId, name, address, phone, email, cuisine, hours, rating, tableNumber);

        if (!updateRestaurant){
            return res.status(404).json({message: 'Restaurant not found'});
        }
        
        res.status(200).json({message: 'Restaurant updated', restaurant: updateRestaurant});
    }catch(error){
        console.error('Error in updating restaurant:', error);
        res.status(500).json({message: 'Server error while updating restaurant'});
    }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
    try{
        const {restaurantId} = req.params;
        const deletedRestaurant = await Restaurant.deleteRestaurant(restaurantId);
        if (!deletedRestaurant){
            return res.status(404).json({message: 'Restaurant not found'});
        }
        res.status(200).json({message: 'Restaurant deleted successfully'});
    }catch(error){
        console.error('Error in deleting restaurant:', error);
        res.status(500).json({message: 'Server error while deleting restaurant'});
    }
};