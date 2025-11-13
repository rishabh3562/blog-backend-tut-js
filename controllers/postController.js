const Post = require('../models/Post');
const QueryFeatures = require('../utils/queryFeatures');
const { clearCache } = require('../middleware/cache');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
    try {
        // Add user as author
        req.body.author = req.user.id;

        const post = await Post.create(req.body);

        // Clear posts cache after creating new post
        await clearCache('cache:/api/posts*');

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
    try {
        // Apply query features
        const features = new QueryFeatures(
            Post.find({ status: 'published' }).populate('author', 'name email'),
            req.query
        )
            .filter()
            .search()
            .sort()
            .limitFields()
            .paginate();

        // Execute query
        const posts = await features.query;

        // Get pagination info
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const total = await Post.countDocuments({ status: 'published' });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            count: posts.length,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user is post owner or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this post'
            });
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('author', 'name email');

        // Clear posts cache after updating
        await clearCache('cache:/api/posts*');

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user is post owner or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this post'
            });
        }

        await post.deleteOne();

        // Clear posts cache after deleting
        await clearCache('cache:/api/posts*');

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get posts by logged in user
// @route   GET /api/posts/my-posts
// @access  Private
exports.getMyPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ author: req.user.id })
            .populate('author', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        next(error);
    }
};
