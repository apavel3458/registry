module.exports = {
    port: process.env.PORT || 8081,
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret',
        captchaSecretKey: '6LejLpgUAAAAAMKdz2-HNRQZJWhtSpDPWV4s0TXK'
    },
    operations: {
        disableNewUsers: true
    }
}