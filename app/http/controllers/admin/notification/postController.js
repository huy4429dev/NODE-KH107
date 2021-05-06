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
                    .find({userId: req.user._id }, null, { sort: { 'createdAt': -1 } })
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
            } catch (err) {
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