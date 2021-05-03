const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email required !'],
        unique: [true, 'email unique !'],
    },
    password: {
        type: String,
        required: [true, 'password required !'],
    },
    fullname: {
        type: String,
        min: [2, 'fullname min > 2 !'],
    },
    avatar: {
        type: String,
        required: [true, 'avatar required !'],
        default: "/img/avatar.png",
        max: [500, 'fullname max < 500 !'],
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                var re = /^\d{10}$/;
                return (v == null || v.trim().length < 1) || re.test(v)
            },
            message: 'Provided phone number is invalid.'
        }
    },
    address: {
        type: String,
    },
    gender: {
        type: Number,
        required: [true, 'gender required !'],
        default: 1
    },
    status: {
        type: Number,
        default: 1
    },
    note: {
        type: String
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)