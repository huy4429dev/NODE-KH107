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
            let { pageComment, sizeComment } = req.query;
            pageComment = parseInt(pageComment) ?? 1;
            sizeComment = parseInt(sizeComment) ?? 5;

            total = await Comment.find({ postId: postId }).count();

            Comment.find({ postId: postId }, null, { sort: { 'createdAt': -1 } })
                .skip((pageComment - 1) * sizeComment)
                .limit(sizeComment)
                // .select('user')
                .populate('userId')
                .exec((err, comments) => {
                    if (req.xhr) {
                        return res.json({
                            total,
                            comments
                        })
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

            res.status(201).json({ ...document._doc, userId: { _id: req.user.id, avatar: req.user.avatar, fullname: req.user.fullname } });
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