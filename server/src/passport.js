/* eslint-disable no-console */
const passport = require('passport')
// eslint-disable-next-line no-unused-vars
const User = require('./models/user')
const config = require('./config/config')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.authentication.jwtSecret
    },
    async function (jwtPayload, done) {
        try {
            /*const user = await User.findOne({
                where: {
                    id: jwtPayload.id
                }
            })*/
            //console.log("USERRRRRRRRR")
            //console.log(jwtPayload)
            const user = jwtPayload
            if (!user) {
                return done(new Error(), false)
            }
            return done(null, user)
        } catch (err) {
            return done(new Error(), false)
        }
    })
)

module.exports = null