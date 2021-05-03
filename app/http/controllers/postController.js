const mongoose = require('mongoose')
const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const moment = require('moment');

function postController() {

    return {

        async deletail(req, res) {

            const { id } = req.params;
            Post.find({ _id: id }, null, { sort: { 'createdAt': -1 } })
                // .select('user')
                .populate('userId')
                .limit(1)
                .exec((err, post) => {
                    res.render('postDetail', {
                        layout: 'layouts/layoutPage',
                        extractScripts: true,
                        extractStyles: true,
                        post: post[0],
                        moment: moment
                    })
                })
        },

        async comment(req, res) {
            const { postId } = req.params;
            Comment.find({ postId: postId }, null, { sort: { 'createdAt': -1 } })
                // .select('user')
                .populate('userId')
                .exec((err, comments) => {
                    if (req.xhr) {
                        return res.json(comments)
                    } else {
                        res.render('admin/notification/post', {
                            extractScripts: true,
                            extractStyles: true
                        })
                    }
                })
        },

        async postComment(req, res) {
            
            const { postId } = req.params;
            const { content } = req.body;

            console.log({
                postId,
                content
            });
            let document;
            try {
                document = await Comment.create({
                    content,
                    postId,
                    userId: req.user.id
                });
            } catch (err) {
                console.log(err);
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        },
        async updateComment(req, res) {

            const { id } = req.params;
            const { content } = req.body;
            let document;

            try {

                document = await Comment.updateOne({ _id: id }, { content: content, updatedAt: moment().toISOString() });

            } catch (err) {
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        },

        async deleteComment(req, res) {

            const { id } = req.params;
            let document;

            try {

                document = await Comment.deleteOne({ _id: id });

            } catch (err) {
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        }

    }
}

module.exports = postController