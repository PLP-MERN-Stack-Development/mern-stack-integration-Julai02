const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const auth = require('../middleware/auth');
const multer = require('multer');
const { body } = require('express-validator');

const upload = multer({ dest: 'uploads/' });

// GET /api/posts
router.get('/', postsController.getAllPosts);

// GET /api/posts/search
router.get('/search', postsController.searchPosts);

// GET /api/posts/:id
router.get('/:id', postsController.getPost);

// POST /api/posts
router.post(
  '/',
  auth,
  upload.single('featuredImage'),
  [body('title').notEmpty().withMessage('Title is required'), body('content').notEmpty().withMessage('Content is required')],
  postsController.createPost
);

// PUT /api/posts/:id
router.put('/:id', auth, postsController.updatePost);

// DELETE /api/posts/:id
router.delete('/:id', auth, postsController.deletePost);

// POST /api/posts/:postId/comments
router.post('/:postId/comments', auth, [body('content').notEmpty().withMessage('Comment content required')], postsController.addComment);

module.exports = router;
