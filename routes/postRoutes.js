const express = require('express');
const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    getMyPosts
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const {
    validatePost,
    validatePostUpdate,
    handleValidationErrors
} = require('../middleware/validation');
const { cache } = require('../middleware/cache');
const { createLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes with caching
router.get('/', cache(300), getPosts);
router.get('/:id', cache(600), getPost);

// Protected routes
router.use(protect);

router.get('/my/posts', getMyPosts);
router.post('/', createLimiter, validatePost, handleValidationErrors, createPost);
router.put('/:id', validatePostUpdate, handleValidationErrors, updatePost);
router.delete('/:id', deletePost);

module.exports = router;
