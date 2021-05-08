const mongoose = require('mongoose')
const Post = require('../../../../models/Post')

function postController() {

    return {
        async index(req, res) {

            if (req.user.roleId.name == "admin") {
                Post
                    .find(null, null, { sort: { 'createdAt': -1 } })
                    // .select('user')
                    .populate('userId', 'email')
                    .exec((err, posts) => {
                        if (req.xhr) {
                            return res.json(posts)
                        } else {
                            res.render('admin/notification/post', {
                                extractScripts: true,
                                extractStyles: true
                            })
                        }
                    })
            }
            else {
                Post
                    .find({ userId: req.user._id }, null, { sort: { 'createdAt': -1 } })
                    // .select('user')
                    .populate('userId', 'email')
                    .exec((err, posts) => {
                        if (req.xhr) {
                            return res.json(posts)
                        } else {
                            res.render('admin/notification/post', {
                                extractScripts: true,
                                extractStyles: true
                            })
                        }
                    })
            }

        }
        ,

        async search(req, res) {

            let { q } = req.query;
            console.log(q, 'q')
            q = '.*' + q.trim() + '.*';

            if (req.user.roleId.name == "admin") {
                Post
                    .find({ title: { $regex: q, $options: 'i' } }, null, { sort: { 'createdAt': -1 } })
                    // .select('user')
                    .populate('userId', 'email')
                    .exec((err, posts) => {
                        return res.json(posts)
                    })

            }
            else {
                Post
                    .find({ userId: req.user._id, title: { $regex: q, $options: 'i' } }, null, { sort: { 'createdAt': -1 } })
                    // .select('user')
                    .populate('userId', 'email')
                    .exec((err, posts) => {
                        return res.json(posts)
                    })
            }
        },

        async create(req, res) {

            const { title, status, categoryId, description, content } = req.body;
            let document;
            try {
                document = await Post.create({
                    title,
                    categoryId,
                    description,
                    content,
                    status,
                    userId: req.user._id
                });

                // send socket

                document.content = null;
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated',{document, author: req.user.fullname})

            } catch (err) {
                console.log(err)
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        },

        async update(req, res) {

            const { id } = req.params;
            const { title, categoryId, status, description, content } = req.body;
            let document;

            try {
                document = await Post.updateOne({ _id: id },
                    {
                        title: title,
                        status: status,
                        categoryId: categoryId,
                        description: description,
                        content: content
                    }
                );

            } catch (err) {
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        },

        async delete(req, res) {
            const { id } = req.params;
            let document;
            try {

                document = await Post.deleteOne({ _id: id });

            } catch (err) {
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        }

    }
}

module.exports = postController