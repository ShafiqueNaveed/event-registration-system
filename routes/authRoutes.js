const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require("../models/event");
const authMiddleware = require("../authMiddleware")

// POST /auth/signup - User register
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error signing up', error: err.message });
  }
});

// POST /auth/login - User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// POST /auth/logout (protected)
router.post('/logout', authMiddleware, (req, res) => {
  // Server side: Nothing to do for JWT. Client side: Delete token
  res.json({ message: 'Logged out successfully. Delete token from client.' });
});

router.post('/logout-all', authMiddleware, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
  res.json({ message: 'Logged out from all devices' });
});

// DELETE /auth/delete - Delete own account (protected)
router.delete('/delete', authMiddleware, async (req, res) => {
  try {
    // Step 1: Find and delete the user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Step 2: Cascade delete - Remove user's events (as organizer) and unregister from joined events
    await Event.deleteMany({ organizer: req.user.id });  // Delete events created by user
    await Event.updateMany(
      { registeredUsers: req.user.id },
      { $pull: { registeredUsers: req.user.id } }
    );  // Remove from all events where joined

    // Step 3: Delete user
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting account', error: err.message });
  }
});


module.exports = router;