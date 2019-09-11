module.exports = {
    port: process.env.PORT || 8081,
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret',
        recaptchaSecretKey: '6LdqdLQUAAAAAF4yrYTj26GfIo_fLbAalaXCYiMC'
    },
    operations: {
        disableNewUsers: true
    }
}