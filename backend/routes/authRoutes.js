const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Add console.log to verify the imported functions
console.log('Auth controller functions:', authController);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
