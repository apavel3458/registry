/* eslint-disable no-console */
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const request = require('request')
//const _ = require('lodash')

function jwtSignUser(user) {
    // eslint-disable-next-line no-unused-vars
    const ONE_WEEK = 60*60*24*7
    const ONE_HOUR = 60*60
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_HOUR
    })
}

async function assessCaptcha(req, res) {
    const token = req.body.recaptchaToken
    if (token === undefined || token === '' || token === null) {
        await res.status(401).send({
            error: 'Please select captcha'
        })
        return false
    }
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${config.authentication.captchaSecretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`
    await request(verifyUrl, async (err, response, body) => {
        body = JSON.parse(body)
        if (body.success !== undefined && !body.success) {
            await res.status(412).send({
                error: 'Please select captcha'
            })
            return false
        }
    })
    return true
}

module.exports = {
    async register(req, res) {
        try {
            const captchaPassed = await assessCaptcha(req, res)
            //console.log('CAPATCH APASSED: ' + captchaPassed)
            if (!captchaPassed) return

            req.body.email = req.body.email.toLowerCase()
            const duplicateEmail = await User.query().where("email", req.body.email)
            console.log("test email")
            if (duplicateEmail.length > 0) {
                console.log("test email positive")
                res.status(200).send({
                    error: 'This email account is already in use.'
                })
                return
            }
            const pwhashed = await User.hashPassword(req.body.password)
            if (config.operations.disableNewUsers) {
                req.body.active = 0
            }
            var user = await User.query().insert(req.body)
            if (pwhashed) {//manually update password
                await User.knex().from('users')
                    .where({id: user.id})
                    .update({ password: pwhashed })
            }
            user = user.cleanForJWT()
            console.log(user)
            if (!user.active) {
                return res.send({
                    user: user,
                    successMessage: `Registration for user ${req.body.email} completed, but the user is disabled.  Contact your administrator to activate.`
                })
            }
            return res.send({
                user: user,
                token: jwtSignUser(user)
            })
        } catch (err) {
            console.log(err)
            res.status(412).send({
                error: 'Error on server: ' + err
            })
        }
    },

    async login(req, res) {
        try {
            var {email, password} = req.body
            email = email.toLowerCase()
            var user = (await User.query().where('email', email).limit(1).first())
            
            if (!user) {
                return res.status(401).send({
                    error: 'The login information is incorrect'
                })
            }

            if (!user.active) {
                return res.status(401).send({
                    error: 'User disabled, please contact your administrator'
                })
            }
            //user password excluded from user.js model, must fetch it separately
            const userPassword = (await User.knex().from('users')
                .select('id', 'password')
                .where('id', user.id)
                .first()).password
            const isPasswordValid = await User.comparePassword(password, userPassword)
            
            if (!isPasswordValid) {
                user.loginAttempts = user.loginAttempts+1
                if (user.loginAttempts >=2) {
                    user.active = false
                }
                await User.query().patchAndFetchById(user.id, user)
                return res.status(401).send({
                    error: 'The login information is incorrect'
                })
            }
            
            // USER IS AUTHENTIC------
            user.loginCount = user.loginCount+1
            user.loginAttempts = 0
            user.lastLogin = new Date().toLocaleString()
            user = await User.query().patchAndFetchById(user.id, user);

            //shorten the JWT payload to essentials
            user = user.cleanForJWT()
            //user = _.pick(user, ['id', 'firstName','lastName','email','active','lastLogin'])
            return res.send({
                user: user,
                token: jwtSignUser(user)
            })
        } catch (err) {
            console.log(err)
            return res.status(500).send({
                error: 'An error has occured trying to log in.'
            })
        }
    }
}
