const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({

    title: {
        type: String,
        required: [true, 'title required !']
    },
    thumbnail: {
        type: String,
        default: "/img/thumbnail.jpg",
    },
    description: {
        type: String
    },
    content: {
        type: String,
        required: [true, 'content required !'],
        max: [1000, 'fullname max < 1000 !'],
    },
    status: {
        type: Boolean,
        default: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }


}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema)