const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = require('../../models/Role')
const Post = require('../../models/Post')
const bcrypt = require('bcrypt')

function homeController() {


    return {

        async index(req, res) {
            let { page, size } = req.query;
            page = parseInt(page) ?? 1;
            size = parseInt(size) ?? 2;
            
            totalPost = await Post.find({status: true}).count();
            Post.find({status: true}, null, { sort: { 'createdAt': -1 } })
                .skip((page - 1) * size).limit(size)
                .exec((err, posts) => {
                    if (req.xhr) {
                        return res.json({posts: posts ?? [],total:totalPost})
                    } else {
                        res.render('home', {
                            layout: 'layouts/layoutPage',
                            extractScripts: true,
                            extractStyles: true
                        })
                    }
                })
        }
        
    }
}

module.exports = homeController