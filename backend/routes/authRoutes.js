const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Correctly import the functions

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

module.exports = router;
