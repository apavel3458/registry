const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const ReferralsController = require('./controllers/ReferralsController')
const UserController = require('./controllers/UserController')
const {AuthFilter, AuthAdminFilter} = require('./policies/AuthenticationFilter')



module.exports = (app) => {

    app.all("/admin/*", AuthAdminFilter, function(req, res, next) {
        next();
    })

    app.post('/register', 
        AuthenticationControllerPolicy.register,
        AuthenticationController.register)

    app.post('/login', 
        AuthenticationController.login)

    app.get('/referrals/index',
        AuthFilter,
        ReferralsController.index)

    app.post('/referrals/add',
        ReferralsController.add)

    app.post('/referrals/delete',
        AuthFilter,
        ReferralsController.delete)

    app.get('/referrals/:referralId',
        AuthFilter,
        ReferralsController.show)

    app.put('/referrals/:referralId',
        AuthFilter,
        ReferralsController.put)

    app.get('/admin/users',
        AuthFilter,
        UserController.index)

    app.put('/admin/users/:userId',
        AuthFilter,
        UserController.put)

    app.post('/admin/users/:userId/delete',
        AuthFilter,
        UserController.delete)

    app.post('/admin/groups',
        AuthFilter,
        UserController.groups)

    app.put('/user/changepw',
        AuthFilter,
        UserController.changepw)
}
