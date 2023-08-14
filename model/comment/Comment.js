const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post id is required']
    },

    author: {
        type: Object,
        required: [true, 'Author id is required']
    },
    description: {
        type: String,
        required: [true, 'Comment description is required']
    }
}, { timestamps: true})


const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment;