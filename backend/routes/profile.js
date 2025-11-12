const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profile/:username
// @desc    Get user profile by username
// @access  Public
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile/update
// @desc    Update user profile
// @access  Private
router.put('/update', isAuthenticated, async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;

    // Update avatar if name changed
    if (name) {
      user.avatar = name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    await user.save();

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
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/profile/follow/:userId
// @desc    Follow a user
// @access  Private
router.post('/follow/:userId', isAuthenticated, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.session.userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following and followers
    currentUser.following.push(req.params.userId);
    userToFollow.followers.push(req.session.userId);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/profile/unfollow/:userId
// @desc    Unfollow a user
// @access  Private
router.post('/unfollow/:userId', isAuthenticated, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.session.userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.userId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.session.userId);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profile/:userId/followers
// @desc    Get user's followers
// @access  Public
router.get('/:userId/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'name username avatar bio');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followers = user.followers.map(follower => ({
      id: follower._id,
      name: follower.name,
      username: follower.username,
      avatar: follower.avatar,
      bio: follower.bio,
      isFollowing: req.session.userId ? follower.following.includes(req.session.userId) : false
    }));

    res.json({ followers, count: followers.length });
  } catch (error) {
    console.error('Fetch followers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profile/:userId/following
// @desc    Get users that this user is following
// @access  Public
router.get('/:userId/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'name username avatar bio');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const following = user.following.map(followedUser => ({
      id: followedUser._id,
      name: followedUser.name,
      username: followedUser.username,
      avatar: followedUser.avatar,
      bio: followedUser.bio,
      isFollowing: true
    }));

    res.json({ following, count: following.length });
  } catch (error) {
    console.error('Fetch following error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profile/:userId/stats
// @desc    Get user profile statistics
// @access  Public
router.get('/:userId/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Post = require('../models/Post');

    // Get total likes on user's posts
    const posts = await Post.find({ author: req.params.userId });
    const totalLikes = posts.reduce((sum, post) => sum + post.likesCount, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.commentsCount, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.sharesCount, 0);

    // Get posts with media count
    const mediaPostsCount = await Post.countDocuments({
      author: req.params.userId,
      'images.0': { $exists: true }
    });

    res.json({
      stats: {
        posts: user.postsCount,
        followers: user.followersCount,
        following: user.followingCount,
        totalLikes,
        totalComments,
        totalShares,
        mediaPosts: mediaPostsCount
      }
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== AUTHENTICATION ROUTES ====================

// @route   POST /api/profile/auth/register
// @desc    Register a new user from profile context
// @access  Public
router.post('/auth/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
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

// @route   POST /api/profile/auth/login
// @desc    Login user from profile context
// @access  Public
router.post('/auth/login', async (req, res) => {
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

// @route   POST /api/profile/auth/logout
// @desc    Logout user from profile context
// @access  Private
router.post('/auth/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.json({
      message: 'Logout successful',
      redirectTo: '/login' // Can be used by frontend to redirect
    });
  });
});

// @route   GET /api/profile/auth/session
// @desc    Check current session status
// @access  Public
router.get('/auth/session', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.json({
        authenticated: false,
        user: null
      });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.json({
        authenticated: false,
        user: null
      });
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
    console.error('Session check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
