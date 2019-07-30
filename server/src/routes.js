const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const UserController = require('./controllers/UserController')
const {AuthFilter, AuthAdminFilter} = require('./policies/AuthenticationFilter')
const RegistryController = require('./controllers/RegistryController')
const RegistryPatientDataController = require('./controllers/RegistryPatientDataController')



module.exports = (app) => {

    app.all("/admin/*", AuthAdminFilter, function(req, res, next) {
        next();
    })

    app.post('/register', 
        AuthenticationControllerPolicy.register,
        AuthenticationController.register)

    app.post('/login', 
        AuthenticationController.login)

    app.post('/registry/patient',
            AuthFilter,
            RegistryController.patientAdd)

    app.get('/registry/patient/search',
            AuthFilter,
            RegistryController.patientSearch)

    app.get('/registry/patient/getpage',
            AuthFilter,
            RegistryController.patientGetPage)

    app.get('/registry/patient/:id',
            AuthFilter,
            RegistryController.patientGet)

    app.get('/registry',
            AuthFilter,
            RegistryController.registryList)

    app.put('/registry/patient/:id/update',
            AuthFilter,
            RegistryController.patientUpdate)

    app.delete('/registry/patient/:id/delete',
            AuthFilter,
            RegistryController.patientDelete)


    // -------------  IMAGING ENDPOINTS ---------------
    // app.get('/registry/patient/:id/imaging',
    //         AuthFilter,
    //         RegistryPatientDataController.imagingGet)

    // app.post('/registry/patient/:id/imaging',
    //         AuthFilter,
    //         RegistryPatientDataController.imagingPost)
    
    // app.put('/registry/patient/:id/imaging',
    //         AuthFilter,
    //         RegistryPatientDataController.imagingPut)

    // app.delete('/registry/patient/:id/imaging/:imagingid',
    //         AuthFilter,
    //         RegistryPatientDataController.imagingDelete)

    //------------  PATIENT DATA ENDPOINTS ---------------
    app.get('/registry/patient/:patientId/data/:component',
        AuthFilter,
        RegistryPatientDataController.itemGet)

    app.post('/registry/patient/:patientId/data/:component',
        AuthFilter,
        RegistryPatientDataController.itemPost)
    
    app.put('/registry/patient/:patientId/data/:component/:itemId',
         AuthFilter,
         RegistryPatientDataController.itemPut)

    app.delete('/registry/patient/:patientId/data/:component/:itemId',
        AuthFilter,
        RegistryPatientDataController.itemDelete)


    app.get('/admin/users',
        AuthFilter,
        UserController.index)

    app.put('/admin/users/:userId',
        AuthFilter,
        UserController.put)

    app.delete('/admin/users/:id/delete',
        AuthFilter,
        UserController.delete)

    app.get('/admin/groups',
        AuthFilter,
        UserController.groups)

    app.post('/admin/groups',
        AuthFilter,
        UserController.addGroup)

    app.delete('/admin/groups/:id',
        AuthFilter,
        UserController.deleteGroup)

    app.put('/admin/groups/:id',
        AuthFilter,
        UserController.updateGroup)

    app.put('/user/changepw',
        AuthFilter,
        UserController.changepw)
}
