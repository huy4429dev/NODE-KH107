const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = require('../../models/Role')
const Post = require('../../models/Post')
const bcrypt = require('bcrypt')

function homeController() {


    return {

        async index(req, res) {
            let { page, size } = req.query;
            page = page ?? 1;
            size = size ?? 2;
            Post.find({status: true}, null, { sort: { 'createdAt': -1 } })
                .skip((page - 1) * page).limit(size)
                .exec((err, posts) => {
                    if (req.xhr) {
                        return res.json(posts)
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