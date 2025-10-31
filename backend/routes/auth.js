<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();

    // Create session
    req.session.userId = user._id;

    // Return user data (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      followers: user.followersCount,
      following: user.followingCount,
      posts: user.postsCount,
      joined: user.getJoinedDate()
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user._id;

    // Return user data (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      followers: user.followersCount,
      following: user.followingCount,
      posts: user.postsCount,
      joined: user.getJoinedDate()
    };

    res.json({
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// @route   GET /api/auth/check
// @desc    Check if user is authenticated
// @access  Private
router.get('/check', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ authenticated: false });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(401).json({ authenticated: false });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      followers: user.followersCount,
      following: user.followingCount,
      posts: user.postsCount,
      joined: user.getJoinedDate()
    };

    res.json({
      authenticated: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();

    // Create session
    req.session.userId = user._id;

    // Return user data (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      followers: user.followersCount,
      following: user.followingCount,
      posts: user.postsCount,
      joined: user.getJoinedDate()
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user._id;

    // Return user data (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      followers: user.followersCount,
      following: user.followingCount,
      posts: user.postsCount,
      joined: user.getJoinedDate()
    };

    res.json({
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// @route   GET /api/auth/check
// @desc    Check if user is authenticated
// @access  Private
router.get('/check', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ authenticated: false });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(401).json({ authenticated: false });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      followers: user.followersCount,
      following: user.followingCount,
      posts: user.postsCount,
      joined: user.getJoinedDate()
    };

    res.json({
      authenticated: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
>>>>>>> origin/main
