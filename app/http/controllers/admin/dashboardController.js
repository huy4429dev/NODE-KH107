const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = require('../../../models/Role')
const Post = require('../../../models/Post')
const Comment = require('../../../models/Comment')
const bcrypt = require('bcrypt')
const moment = require('moment')

function dashboardController() {
    return {
        async index(req, res) {

            const startOfMonth = moment().clone().startOf('month').toISOString();

            const countPost = await Post.find().count();
            const countComment = await Comment.find().count();
            const countUser = await User.find().count();
            const countNewUser = await User.find({
                createdAt: {
                    $gte: startOfMonth
                }
            }
            ).count();
            
            const newPost = await Post.find(null,null, {sort: {'createdAt': -1}}).limit(5).populate('userId');
            const topPost = await Post.find(null,null, {sort: {'createdAt': -1}}).limit(5).populate('comments');
            

            console.log(topPost);
            // const topPost = await Post.find().select("comments").populate('comments');
            // console.log(topPost);

 
            res.render('admin/dashboard', {
                extractScripts: true,
                extractStyles: true,
                countPost: countPost,
                countComment: countComment,
                countUser: countUser,
                countNewUser: countNewUser,
                newPost: newPost,
                topPost: topPost,
                moment: moment
            })
        }
    }
}

module.exports = dashboardController