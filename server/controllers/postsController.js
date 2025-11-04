const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// Duplicate of contollers/postsController.js (kept to normalize folder name)
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const category = req.query.category || null;

    const filter = {};
    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    const post = await Post.findOne({ $or: [{ _id: idOrSlug }, { slug: idOrSlug }] });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const postData = req.body;
    if (req.file) postData.featuredImage = req.file.filename;
    // Attach author from authenticated user if present
    if (req.user) postData.author = req.user.id;
    const post = await Post.create(postData);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    // Optional: only author or admin can update (simple check)
    if (req.user && req.user.id && post.author && post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    Object.assign(post, req.body);
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    if (req.user && req.user.id && post.author && post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    await post.remove();
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;
    const userId = req.user ? req.user.id : null;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    await post.addComment(userId, content);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.searchPosts = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const posts = await Post.find({ $text: { $search: q } });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};
