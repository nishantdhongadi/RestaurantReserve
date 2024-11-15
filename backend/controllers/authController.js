const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

// Add console.log to verify exports
const register = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;
  try {
    console.log('Registration attempt for:', email);
    const userIdResult = await pool.query(
      'SELECT COALESCE(MAX(userid), 0) + 1 as next_id FROM Users'
    );
    const nextUserId = userIdResult.rows[0].next_id;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO Users (userid, Username, Email, PhoneNumber, Password)
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING userid, Username, Email, PhoneNumber`,
      [nextUserId, username, email, phoneNumber, hashedPassword]
    );
    
    console.log('Registration successful:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM Users WHERE Email = $1`, [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export both functions
module.exports = {
  register,
  login
};
