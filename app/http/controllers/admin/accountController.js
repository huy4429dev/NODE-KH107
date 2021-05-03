const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = require('../../../models/Role')
const bcrypt = require('bcrypt')

function accountController() {

    return {
        async index(req, res) {
            const users = await User.find(null, null, { sort: { 'createdAt': -1 } })
                .populate('roleId');
            if (req.xhr) {
                return res.json(users)
            } else {
                res.render('admin/account', {
                    extractScripts: true,
                    extractStyles: true
                })
            }
        },
        async create(req, res) {
            const { fullname, email, password, status, roleId } = req.body;
            let document;
            try {
                document = await User.create({
                    fullname,
                    email,
                    password: await bcrypt.hash(newPassword, 10),
                    status,
                    roleId
                });
            } catch (err) {
                console.log(err);
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        },

        async update(req, res) {

            const { id } = req.params;
            const { fullname, email, password, status, roleId } = req.body;
            let document;

            try {
                document = await User.updateOne({ _id: id },
                    {
                        fullname: fullname,
                        email: email,
                        password: await bcrypt.hash(password, 10),
                        status: status,
                        roleId: roleId
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

                document = await User.deleteOne({ _id: id });

            } catch (err) {
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        }
        ,
        async getRoles(req, res) {
            const roles = await Role.find(null, null, { sort: { 'createdAt': -1 } });
            res.status(201).json(roles);
        }

    }
}

module.exports = accountController