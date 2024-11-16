const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService'); // Import email service



// Register a new user
const register = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  // Validate the input fields
  if (!username || !email || !phoneNumber || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('Registration attempt for:', email);

    // Check if the email already exists
    const emailCheck = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Generate the next userId
    const userIdResult = await pool.query(
      'SELECT COALESCE(MAX(userid), 0) + 1 as next_id FROM Users'
    );
    const nextUserId = userIdResult.rows[0].next_id;

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await pool.query(
      `INSERT INTO Users (userid, username, email, phoneNumber, password)
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING userid, username, email, phoneNumber`,
      [nextUserId, username, email, phoneNumber, hashedPassword]
    );

    console.log('Registration successful:', result.rows[0]);
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM Users WHERE Email = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Delete a user account
const deleteUser = async (req, res) => {
  const userId = req.user.userId; // Get userId from the authenticated user

  try {
    const result = await pool.query('DELETE FROM Users WHERE userid = $1 RETURNING *', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User with ID ${userId} deleted`);
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error while deleting user' });
  }
};

// In-memory store for reset tokens
const resetTokens = {};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a token
    const token = crypto.randomBytes(32).toString('hex');
    const expireDate = Date.now() + 3600000; // Token valid for 1 hour

    // Store the token in memory
    resetTokens[email] = { token, expireDate };

    // Send the token to the user's email
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}&email=${email}`;
    const emailText = `You requested a password reset. Click the link to reset your password: ${resetLink}`;

    await sendEmail(email, 'Password Reset Request', emailText);

    console.log(`Password reset token for ${email}: ${token}`);
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    // Check if the token is valid and not expired
    const tokenData = resetTokens[email];
    if (!tokenData || tokenData.token !== token || tokenData.expireDate < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE Users SET password = $1 WHERE email = $2', [hashedPassword, email]);

    // Delete the token from memory after use
    delete resetTokens[email];

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  deleteUser,
  requestPasswordReset,
  resetPassword
};
