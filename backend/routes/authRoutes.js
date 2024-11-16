const express = require('express');
const router = express.Router();
const {
  register,
  login,
  deleteUser,
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Delete user route (protected)
router.delete('/delete', auth, deleteUser);

// Password reset routes
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
