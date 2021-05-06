const mongoose = require('mongoose')
const Comment = require('../../../models/Comment')
const Post = require('../../../models/Post')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')

function profileController() {
    return {

        async profile(req, res) {
            const user = await User.findOne({ _id: req.user._id });
            const comments = await Comment.find({ userId: req.user._id }, null, { sort: { 'createdAt': -1 } }).populate('postId', 'title');
            const postCount = await Post.find({ userId: req.user._id }).count();

            if (req.xhr) {
                return res.json({
                    user: user,
                    comments: comments,
                    postCount: postCount
                })
            } else {
                res.render('admin/profile', {
                    extractScripts: true,
                    extractStyles: true
                })
            }
        },

        async update(req, res) {

            const { fullname, email, newPassword, oldPassword, gender, address, phone, note } = req.body;

            if (oldPassword != '' && newPassword != '') {
                bcrypt.compare(oldPassword, req.user.password).then(async match => {
                    if (match) {
                        try {
                            document = await User.updateOne({ _id: req.user._id }, {
                                fullname: fullname,
                                email: email,
                                password: await bcrypt.hash(newPassword, 10),
                                gender: gender,
                                address: address,
                                phone: phone,
                                note: note
                            });

                            req.user.password = await bcrypt.hash(newPassword, 10);
                            console.log(req.user.password, 'req.user')
                            res.status(201).json(document);
                        }
                        catch (err) {
                            res.status(400).json(err);;
                        }
                    }
                    else {
                        res.status(400).json({ err: "Mật khâu cũ không khớp" });
                        return;
                    }

                }).catch(err => {
                    res.status(400).json(err);;
                })



            } else {
                try {
                    document = await User.updateOne({ _id: req.user._id }, {
                        fullname: fullname,
                        email: email,
                        gender: gender,
                        address: address,
                        phone: phone,
                        note: note
                    });

                } catch (err) {
                    res.status(400).json(err);;
                }
                res.status(201).json(document);
            }

        },

    }
}
module.exports = profileController