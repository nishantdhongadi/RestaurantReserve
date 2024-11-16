const express = require('express');
const router = express.Router();
const { register, login, deleteUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Delete user route (protected)
router.delete('/delete', auth, deleteUser);

module.exports = router;
