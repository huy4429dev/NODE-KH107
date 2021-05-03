function department (req, res, next) {
    if(req.isAuthenticated() && (req.user.roleId.name === 'admin' || req.user.roleId.name === 'department' )) {
        return next()
    }
    return res.redirect('/')
}

module.exports = department