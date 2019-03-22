/* eslint-disable no-console */
const passport = require('passport')

module.exports = {
    AuthFilter: function (req, res, next) {
        passport.authenticate('jwt', function (err, user) {
            if (err || !user) {
                res.status(403).send({
                    error: 'You do not have permissions'
                })
            } else {
                req.user = user
                next()
            }
        })(req, res, next)
    },
    AuthAdminFilter: function(req, res, next) {
        //TODO
        next()
    }
}