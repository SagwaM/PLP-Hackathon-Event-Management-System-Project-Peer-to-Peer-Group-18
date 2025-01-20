const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Define your authentication-related routes here
// POST route for login
router.post('/login', authController.login);

// POST route for registration
router.post('/register', authController.registerUser);

// Add more authentication routes as needed
module.exports = router;
