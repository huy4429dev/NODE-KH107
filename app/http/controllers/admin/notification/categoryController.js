const mongoose = require('mongoose')
const Category = require('../../../../models/Category')

function categoryController() {

    return {

        async index(req, res) {
            Category.find(null, null, { sort: { 'createdAt': -1 } }).exec((err, categories) => {
                if (req.xhr) {
                    return res.json(categories)
                } else {
                    res.render('admin/notification/category', {
                        extractScripts: true,
                        extractStyles: true
                    })
                }
            })
        }
        ,

        async create(req, res) {
            const { name, status } = req.body;
            let document;
            try {
                document = await Category.create({
                    name,
                    status
                });
            } catch (err) {
                console.log(err);
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        },

        async update(req, res) {

            const { id } = req.params;
            const { name, status } = req.body;
            let document;

            try {

                document = await Category.updateOne({ _id: id }, { name: name, status: status });

            } catch (err) {
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        },

        async delete(req, res) {

            const { id } = req.params;
            let document;

            try {

                document = await Category.deleteOne({ _id: id });

            } catch (err) {
                res.status(400).json(err);;
            }
            res.status(201).json(document);
        }

    }
}

module.exports = categoryController