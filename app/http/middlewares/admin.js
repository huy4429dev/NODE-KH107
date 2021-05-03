function admin (req, res, next) {
    if(req.isAuthenticated() && req.user.roleId.name === 'admin') {
        return next()
    }
    return res.redirect('/')
}

module.exports = admin