const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/posts/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// Get public posts (for non-authenticated users)
router.get('/public', async (req, res) => {
  try {
    // Get all posts, sorted by newest first
    const posts = await Post.find({})
      .populate('author', 'name username email')
      .sort({ createdAt: -1 })
      .limit(50);

    // Format posts for frontend
    const formattedPosts = posts.map(post => ({
      id: post._id,
      author: post.author.name,
      username: post.author.username,
      avatar: post.author.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      time: getTimeAgo(post.createdAt),
      content: post.content,
      image: post.image,
      feeling: post.feeling,
      activity: post.activity,
      location: post.location,
      likes: post.likes.length,
      comments: post.comments.length,
      shares: post.shares
    }));

    res.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching public posts:', error);
    res.status(500).json({ message: 'Error fetching public posts' });
  }
});

// Get user's feed (posts from followed users and own posts)
router.get('/feed', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Get user's followed users
    const user = await User.findById(userId).select('following');
    const followedUsers = user.following || [];

    // Get posts from followed users and own posts
    const posts = await Post.find({
      $or: [
        { author: { $in: followedUsers } },
        { author: userId }
      ]
    })
      .populate('author', 'name username email')
      .sort({ createdAt: -1 })
      .limit(50);

    // Format posts for frontend
    const formattedPosts = posts.map(post => ({
      id: post._id,
      author: post.author.name,
      username: post.author.username,
      avatar: post.author.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      time: getTimeAgo(post.createdAt),
      content: post.content,
      image: post.image,
      likes: post.likes.length,
      comments: post.comments.length,
      shares: post.shares,
      liked: post.likes.includes(userId)
    }));

    res.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ message: 'Error fetching feed' });
  }
});

// Create a new post (with optional image upload)
router.post('/create', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { content, feeling, activity, locationName } = req.body;
    const userId = req.session.userId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const postData = {
      author: userId,
      content: content.trim()
    };

    // Add image path if uploaded
    if (req.file) {
      postData.image = `/uploads/posts/${req.file.filename}`;
    }

    // Add feeling if provided
    if (feeling) {
      postData.feeling = feeling;
    }

    // Add activity if provided
    if (activity) {
      postData.activity = activity;
    }

    // Add location if provided
    if (locationName) {
      postData.location = {
        name: locationName
      };
    }

    const newPost = new Post(postData);
    await newPost.save();

    // Update user's post count
    await User.findByIdAndUpdate(userId, {
      $inc: { postsCount: 1 }
    });

    // Populate author information
    await newPost.populate('author', 'name username email');

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: newPost._id,
        author: newPost.author.name,
        username: newPost.author.username,
        content: newPost.content,
        image: newPost.image,
        feeling: newPost.feeling,
        activity: newPost.activity,
        location: newPost.location,
        createdAt: newPost.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Like/Unlike a post
router.post('/:postId/like', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likes: post.likes.length,
      liked: likeIndex === -1
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Error processing like' });
  }
});

// Add comment to a post
router.post('/:postId/comment', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.session.userId;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: userId,
      text: text.trim()
    });

    await post.save();

    res.json({
      message: 'Comment added successfully',
      comments: post.comments.length
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Delete a post
router.delete('/:postId', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await Post.findByIdAndDelete(postId);

    // Update user's post count
    await User.findByIdAndUpdate(userId, {
      $inc: { postsCount: -1 }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// Helper function to get time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + 'y ago';

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + 'mo ago';

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + 'd ago';

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + 'h ago';

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + 'm ago';

  return 'Just now';
}

module.exports = router;
