const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [10, 'Content must be at least 10 characters long']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        trim: true
    },
    views: {
        type: Number,
        default: 0
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for better query performance
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1 });
postSchema.index({ status: 1 });

// Set publishedAt when status changes to published
postSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);
