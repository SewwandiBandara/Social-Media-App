const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ visibility: 'public' })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ visibility: 'public' });

    const postsResponse = posts.map(post => ({
      id: post._id,
      author: {
        id: post.author._id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar
      },
      content: post.content,
      images: post.images,
      likes: post.likesCount,
      comments: post.commentsCount,
      shares: post.sharesCount,
      liked: req.session.userId ? post.isLikedBy(req.session.userId) : false,
      timestamp: post.getTimeAgo(),
      createdAt: post.createdAt
    }));

    res.json({
      posts: postsResponse,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get posts by user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      author: req.params.userId,
      visibility: 'public'
    })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      author: req.params.userId,
      visibility: 'public'
    });

    const postsResponse = posts.map(post => ({
      id: post._id,
      author: {
        id: post.author._id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar
      },
      content: post.content,
      images: post.images,
      likes: post.likesCount,
      comments: post.commentsCount,
      shares: post.sharesCount,
      liked: req.session.userId ? post.isLikedBy(req.session.userId) : false,
      timestamp: post.getTimeAgo(),
      createdAt: post.createdAt
    }));

    res.json({
      posts: postsResponse,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/user/:userId/media
// @desc    Get posts with media by user
// @access  Public
router.get('/user/:userId/media', async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.params.userId,
      visibility: 'public',
      'images.0': { $exists: true }
    })
      .select('images createdAt')
      .sort({ createdAt: -1 });

    const media = posts.flatMap(post =>
      post.images.map(image => ({
        id: post._id,
        url: image.url,
        alt: image.alt,
        createdAt: post.createdAt
      }))
    );

    res.json({ media });
  } catch (error) {
    console.error('Fetch user media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/user/:userId/likes
// @desc    Get posts liked by user
// @access  Public
router.get('/user/:userId/likes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      likes: req.params.userId,
      visibility: 'public'
    })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      likes: req.params.userId,
      visibility: 'public'
    });

    const postsResponse = posts.map(post => ({
      id: post._id,
      author: {
        id: post.author._id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar
      },
      content: post.content,
      images: post.images,
      likes: post.likesCount,
      comments: post.commentsCount,
      shares: post.sharesCount,
      liked: true,
      timestamp: post.getTimeAgo(),
      createdAt: post.createdAt
    }));

    res.json({
      posts: postsResponse,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch liked posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { content, images, visibility } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = new Post({
      author: req.session.userId,
      content,
      images: images || [],
      visibility: visibility || 'public'
    });

    await post.save();

    // Add post to user's posts array
    await User.findByIdAndUpdate(req.session.userId, {
      $push: { posts: post._id }
    });

    await post.populate('author', 'name username avatar');

    const postResponse = {
      id: post._id,
      author: {
        id: post.author._id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar
      },
      content: post.content,
      images: post.images,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      timestamp: post.getTimeAgo(),
      createdAt: post.createdAt
    };

    res.status(201).json({
      message: 'Post created successfully',
      post: postResponse
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/:postId
// @desc    Update a post
// @access  Private
router.put('/:postId', isAuthenticated, async (req, res) => {
  try {
    const { content, images, visibility } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    if (content) post.content = content;
    if (images !== undefined) post.images = images;
    if (visibility) post.visibility = visibility;

    await post.save();
    await post.populate('author', 'name username avatar');

    const postResponse = {
      id: post._id,
      author: {
        id: post.author._id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar
      },
      content: post.content,
      images: post.images,
      likes: post.likesCount,
      comments: post.commentsCount,
      shares: post.sharesCount,
      liked: post.isLikedBy(req.session.userId),
      timestamp: post.getTimeAgo(),
      createdAt: post.createdAt
    };

    res.json({
      message: 'Post updated successfully',
      post: postResponse
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:postId
// @desc    Delete a post
// @access  Private
router.delete('/:postId', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.postId);

    // Remove post from user's posts array
    await User.findByIdAndUpdate(req.session.userId, {
      $pull: { posts: req.params.postId }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:postId/like
// @desc    Like a post
// @access  Private
router.post('/:postId/like', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already liked
    if (post.isLikedBy(req.session.userId)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.session.userId);
    await post.save();

    res.json({
      message: 'Post liked successfully',
      likesCount: post.likesCount
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:postId/like
// @desc    Unlike a post
// @access  Private
router.delete('/:postId/like', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if not liked
    if (!post.isLikedBy(req.session.userId)) {
      return res.status(400).json({ message: 'Post not liked yet' });
    }

    post.likes = post.likes.filter(like => like.toString() !== req.session.userId);
    await post.save();

    res.json({
      message: 'Post unliked successfully',
      likesCount: post.likesCount
    });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:postId/comment
// @desc    Add comment to post
// @access  Private
router.post('/:postId/comment', isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      author: req.session.userId,
      content
    });

    await post.save();
    await post.populate('comments.author', 'name username avatar');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: post.comments[post.comments.length - 1],
      commentsCount: post.commentsCount
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:postId/share
// @desc    Share a post
// @access  Private
router.post('/:postId/share', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already shared
    const alreadyShared = post.shares.some(share => share.user.toString() === req.session.userId);

    if (alreadyShared) {
      return res.status(400).json({ message: 'Post already shared' });
    }

    post.shares.push({
      user: req.session.userId,
      sharedAt: new Date()
    });

    await post.save();

    res.status(201).json({
      message: 'Post shared successfully',
      sharesCount: post.sharesCount
    });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:postId/share
// @desc    Unshare a post
// @access  Private
router.delete('/:postId/share', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.shares = post.shares.filter(share => share.user.toString() !== req.session.userId);
    await post.save();

    res.json({
      message: 'Post unshared successfully',
      sharesCount: post.sharesCount
    });
  } catch (error) {
    console.error('Unshare post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
