const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// GET /api/categories
router.get('/', categoriesController.getAllCategories);

// POST /api/categories
router.post('/', auth, [body('name').notEmpty().withMessage('Name is required')], categoriesController.createCategory);

module.exports = router;
