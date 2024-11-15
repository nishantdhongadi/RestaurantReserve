const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add some logging
console.log('Available routes:', authRoutes.stack);

// Use the router with a prefix
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
