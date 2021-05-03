const mongoose = require('mongoose')
const User = mongoose.model('User')


function profileController() {
    return {
        async profile(req, res) {
            const user = await User.find({ _id: req.user._id }, null, { sort: { 'createdAt': -1 } })
                .populate('roleId');

            console.log(user, 'user profile');
            if (req.xhr) {
                return res.json(user)
            } else {
                res.render('admin/profile', {
                    extractScripts: true,
                    extractStyles: true
                })
            }
        },

        async update(req, res) {

            const { fullname, email, newPassword, status, roleId } = req.body;
            let document;

            try {
                document = await Category.updateOne({ _id: req.user._id }, {
                    fullname: fullname,
                    email: email,
                    password: await bcrypt.hash(newPassword, 10),
                    status: status,
                    roleId: roleId
                });

            } catch (err) {
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        },

    }
}
module.exports = profileController