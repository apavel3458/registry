/* eslint-disable no-console */
const passport = require('passport')

module.exports = {
    AuthFilter: function (req, res, next) {
        passport.authenticate('jwt', function (err, user) {
            if (err || !user) {
                res.status(401).send({
                    error: 'Please log in to access this page'
                })
            } else {
                req.user = user
                next()
            }
        })(req, res, next)
    },
    AuthAdminFilter: function(req, res, next) {
        passport.authenticate('jwt', function (err, user) {
            //console.log(user.usergroups.filter(group => group.groupName.toLowerCase() === 'admin'))
            if (err || 
                    !user || 
                    !user.usergroups || 
                    !(user.usergroups.filter(group => group.groupName.toLowerCase() === 'admin').length>0)
                ) {
                return res.status(403).send({
                    error: 'You do not have permissions'
                })
            } else {
                req.user = user
                next()
            }
        })(req, res, next)
    }
}