// ADMIN CONTROLLER

const adminController = require('../app/http/controllers/admin/adminController')
const authController = require('../app/http/controllers/auth/authController')
const dashboardController = require('../app/http/controllers/admin/dashboardController')
const accountController = require('../app/http/controllers/admin/accountController')
const profileController = require('../app/http/controllers/admin/profileController')

const categoryController = require('../app/http/controllers/admin/notification/categoryController')
const postController = require('../app/http/controllers/admin/notification/postController')


// PAGE MEMBER CONTROLLER
const homeController = require('../app/http/controllers/homeController')
const pagePostController = require('../app/http/controllers/postController')


// Middlewares 
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
const department = require('../app/http/middlewares/department')

function initRoutes(app ,passport) {

    //INIT ACCOUNT
    app.get('/admin/init', adminController().init)
    app.get('/admin/init/account', adminController().getAccount)


    //AUTHENTICATE 
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.get('/logout', authController().logout)


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    
    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/admin/dashboard',
            failureRedirect: '/'
        }));
        

    // ADMIN PANNEL
    app.get('/admin/dashboard', auth, dashboardController().index)

    // ADMIN MANAGE ACCOUNT
    app.get('/admin/account/roles', auth, accountController().getRoles)

    app.get('/admin/account', admin, accountController().index)
    app.post('/admin/account', admin, accountController().create)
    app.put('/admin/account/:id', admin, accountController().update)
    app.delete('/admin/account/:id', admin, accountController().delete)

    // ADMIN MANAGE PROFILE
    app.get('/admin/profile', auth, profileController().profile)
    app.put('/admin/profile', auth, profileController().update)

    // ADMIN MANAGE NOTIFICATION
    app.get('/admin/notification/category', auth, categoryController().index)
    app.post('/admin/notification/category', department, categoryController().create)
    app.put('/admin/notification/category/:id', department, categoryController().update)
    app.delete('/admin/notification/category/:id', department, categoryController().delete)


    app.get('/admin/notification/post', auth, postController().index)
    app.get('/admin/notification/post/search', auth, postController().search)
    app.post('/admin/notification/post', auth, postController().create)
    app.put('/admin/notification/post/:id', auth, postController().update)
    app.delete('/admin/notification/post/:id', auth, postController().delete)


    // PAGE MEMBER 

    app.get('/', homeController().index)
    app.get('/tim-kiem', homeController().search)
    app.get('/chi-tiet/:id', pagePostController().deletail)
    app.get('/comment/:postId', pagePostController().comment)
    app.post('/comment/:postId', pagePostController().postComment)
    app.put('/comment/:postId', pagePostController().updateComment)
    app.delete('/comment/:id', pagePostController().deleteComment)



}

module.exports = initRoutes