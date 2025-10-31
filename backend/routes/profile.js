const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
};

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

module.exports = router;
