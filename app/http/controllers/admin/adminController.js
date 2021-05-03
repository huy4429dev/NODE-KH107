const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = require('../../../models/Role')
const bcrypt = require('bcrypt')

function adminController() {
    return {
        async init(req, res) {

            // init role 
            const roles = [
                { name: "admin" },
                { name: "department" },
                { name: "student" }
            ];

            await Role.collection.insertMany(roles);

            const admin = {
                email: "admin@gmail.com",
                password: await bcrypt.hash("123456", 10),
                fullname: "admin",
                phone: "0987654321",
                address: "Hanoi - Viet Nam",
                gender: 1,
                status: 1,
                note: "note admin",
                roleId: await Role.findOne({ name: 'admin' }).select("_id")
            };

            const department = {
                email: "department@gmail.com",
                password: await bcrypt.hash("123456", 10),
                fullname: "department",
                phone: "0987654321",
                address: "Hanoi - Viet Nam",
                gender: 1,
                status: 1,
                note: "note department",
                roleId: await Role.findOne({ name: 'department' }).select("_id")
            };

            const student = {
                email: "student@gmail.com",
                password: await bcrypt.hash("123456", 10),
                fullname: "student",
                phone: "0987654321",
                address: "Hanoi - Viet Nam",
                gender: 1,
                status: 1,
                note: "note student",
                roleId: await Role.findOne({ name: 'student' }).select("_id")
            };

            await User.create(admin)
                .catch(err => {
                    console.log(err);
                });


            await User.create(department)
                .catch(err => {
                    console.log(err);
                });

            await User.create(student)
                .catch(err => {
                    console.log(err);
                });
            // init account

            res.json("ADMIN INIT SUCCESS");
        },
        async getAccount(req, res) {
            const users = await User.find();
            console.log(users);
            res.json("ok")
        }
    }

}

module.exports = adminController