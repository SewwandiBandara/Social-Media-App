const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

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
    const formattedPosts = posts.map(post => {
      // Calculate reaction counts by type
      const reactionCounts = post.reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      }, {});

      return {
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
        reactions: reactionCounts,
        totalReactions: post.reactions.length,
        comments: post.commentsCount || 0,
        shares: post.shares
      };
    });

    res.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching public posts:', error);
    res.status(500).json({ message: 'Error fetching public posts' });
  }
});

// Get user's feed (all posts from all users)
router.get('/feed', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Get all posts from all users
    const posts = await Post.find({})
      .populate('author', 'name username email')
      .sort({ createdAt: -1 })
      .limit(50);

    // Format posts for frontend
    const formattedPosts = posts.map(post => {
      // Calculate reaction counts by type
      const reactionCounts = post.reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      }, {});

      // Find user's reaction
      const userReaction = post.reactions.find(r => r.user.toString() === userId);

      return {
        id: post._id,
        author: post.author.name,
        username: post.author.username,
        avatar: post.author.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        time: getTimeAgo(post.createdAt),
        content: post.content,
        image: post.image,
        likes: post.likes.length,
        reactions: reactionCounts,
        totalReactions: post.reactions.length,
        userReaction: userReaction ? userReaction.type : null,
        comments: post.commentsCount || 0,
        shares: post.shares,
        liked: post.likes.includes(userId)
      };
    });

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

// Add or update reaction to a post
router.post('/:postId/react', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { reactionType } = req.body;
    const userId = req.session.userId;

    // Validate reaction type
    const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
    if (!reactionType || !validReactions.includes(reactionType)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find if user already reacted
    const existingReactionIndex = post.reactions.findIndex(
      r => r.user.toString() === userId
    );

    if (existingReactionIndex > -1) {
      // If same reaction, remove it (toggle off)
      if (post.reactions[existingReactionIndex].type === reactionType) {
        post.reactions.splice(existingReactionIndex, 1);
      } else {
        // Update to new reaction type
        post.reactions[existingReactionIndex].type = reactionType;
        post.reactions[existingReactionIndex].createdAt = new Date();
      }
    } else {
      // Add new reaction
      post.reactions.push({
        user: userId,
        type: reactionType
      });
    }

    await post.save();

    // Calculate reaction counts by type
    const reactionCounts = post.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    // Find user's current reaction
    const userReaction = post.reactions.find(r => r.user.toString() === userId);

    res.json({
      message: 'Reaction updated successfully',
      reactions: reactionCounts,
      userReaction: userReaction ? userReaction.type : null,
      totalReactions: post.reactions.length
    });
  } catch (error) {
    console.error('Error reacting to post:', error);
    res.status(500).json({ message: 'Error processing reaction' });
  }
});

// Remove reaction from a post
router.delete('/:postId/react', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find and remove user's reaction
    const reactionIndex = post.reactions.findIndex(
      r => r.user.toString() === userId
    );

    if (reactionIndex > -1) {
      post.reactions.splice(reactionIndex, 1);
      await post.save();
    }

    // Calculate reaction counts by type
    const reactionCounts = post.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      message: 'Reaction removed successfully',
      reactions: reactionCounts,
      totalReactions: post.reactions.length
    });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ message: 'Error removing reaction' });
  }
});

// Like/Unlike a post (kept for backward compatibility)
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

    // Create new comment in Comment collection
    const newComment = new Comment({
      post: postId,
      user: userId,
      text: text.trim(),
      reactions: []
    });

    await newComment.save();

    // Increment commentsCount on the post
    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    // Populate user info
    await newComment.populate('user', 'name username');

    res.json({
      message: 'Comment added successfully',
      comments: post.commentsCount,
      comment: {
        id: newComment._id,
        text: newComment.text,
        user: {
          id: newComment.user._id,
          name: newComment.user.name,
          username: newComment.user.username,
          avatar: newComment.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        },
        createdAt: newComment.createdAt,
        reactions: []
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Add or update reaction to a comment
router.post('/:postId/comment/:commentId/react', requireAuth, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { reactionType } = req.body;
    const userId = req.session.userId;

    // Validate reaction type
    const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
    if (!reactionType || !validReactions.includes(reactionType)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    // Find the comment in Comment collection
    const comment = await Comment.findOne({ _id: commentId, post: postId });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Find if user already reacted to this comment
    const existingReactionIndex = comment.reactions.findIndex(
      r => r.user.toString() === userId
    );

    if (existingReactionIndex > -1) {
      // If same reaction, remove it (toggle off)
      if (comment.reactions[existingReactionIndex].type === reactionType) {
        comment.reactions.splice(existingReactionIndex, 1);
      } else {
        // Update to new reaction type
        comment.reactions[existingReactionIndex].type = reactionType;
        comment.reactions[existingReactionIndex].createdAt = new Date();
      }
    } else {
      // Add new reaction
      comment.reactions.push({
        user: userId,
        type: reactionType
      });
    }

    await comment.save();

    // Calculate reaction counts by type
    const reactionCounts = comment.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    // Find user's current reaction
    const userReaction = comment.reactions.find(r => r.user.toString() === userId);

    res.json({
      message: 'Reaction updated successfully',
      reactions: reactionCounts,
      userReaction: userReaction ? userReaction.type : null,
      totalReactions: comment.reactions.length
    });
  } catch (error) {
    console.error('Error reacting to comment:', error);
    res.status(500).json({ message: 'Error processing reaction' });
  }
});

// Remove reaction from a comment
router.delete('/:postId/comment/:commentId/react', requireAuth, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.session.userId;

    // Find the comment in Comment collection
    const comment = await Comment.findOne({ _id: commentId, post: postId });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Find and remove user's reaction
    const reactionIndex = comment.reactions.findIndex(
      r => r.user.toString() === userId
    );

    if (reactionIndex > -1) {
      comment.reactions.splice(reactionIndex, 1);
      await comment.save();
    }

    // Calculate reaction counts by type
    const reactionCounts = comment.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      message: 'Reaction removed successfully',
      reactions: reactionCounts,
      totalReactions: comment.reactions.length
    });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ message: 'Error removing reaction' });
  }
});

// Get comments for a specific post
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Query Comment collection for comments on this post
    const comments = await Comment.find({ post: postId })
      .populate('user', 'name username')
      .sort({ createdAt: -1 });

    // Format comments with reaction data
    const formattedComments = comments.map(comment => {
      const reactionCounts = comment.reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      }, {});

      return {
        id: comment._id,
        text: comment.text,
        user: {
          id: comment.user._id,
          name: comment.user.name,
          username: comment.user.username,
          avatar: comment.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        },
        createdAt: comment.createdAt,
        reactions: reactionCounts,
        totalReactions: comment.reactions.length
      };
    });

    res.json({
      comments: formattedComments,
      total: formattedComments.length
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Share a post
router.post('/:postId/share', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment share count
    post.shares = (post.shares || 0) + 1;
    await post.save();

    res.json({
      message: 'Post shared successfully',
      shares: post.shares
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ message: 'Error sharing post' });
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
