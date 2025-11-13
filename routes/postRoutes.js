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

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.use(protect);

router.get('/my/posts', getMyPosts);
router.post('/', validatePost, handleValidationErrors, createPost);
router.put('/:id', validatePostUpdate, handleValidationErrors, updatePost);
router.delete('/:id', deletePost);

module.exports = router;
