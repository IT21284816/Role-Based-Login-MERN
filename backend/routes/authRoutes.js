const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { register, login } = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected dashboards
router.get('/user-dashboard', auth, (req, res) => res.send('User dashboard'));
router.get('/admin-dashboard', auth, adminOnly, (req, res) => res.send('Admin dashboard'));

// Admin-only routes

// Get all users
router.get('/all-users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new user
router.post('/add-user', auth, adminOnly, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/delete-user/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
