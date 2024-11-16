const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

// Register a new user
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

module.exports = {
  register,
  login,
  deleteUser
};
