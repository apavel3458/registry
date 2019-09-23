/* eslint-disable no-console */
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const request = require('request')
const knex = require('knex')
//const _ = require('lodash')



module.exports = {
    async register(req, res) {
        
        try {
            const captchaPassed = await assessCaptcha(req, res)
            if (!captchaPassed) return

            let u = req.body
            u.username = u.username.toLowerCase()
            const validation = await validateUser(u)

            if (validation.error) {
                return res.status(400).send({
                    error: validation.message
                })
            }
            const pwhashed = await User.hashPassword(u.password)
            u.active = config.operations.disableNewUsers?0:1

            console.log(u)
            var user = await User.query().insert(u)
            if (pwhashed) {//manually update password
                await User.knex().from('users')
                    .where({id: user.id})
                    .update({ password: pwhashed })
            }
            user = user.cleanForJWT()
            if (!user.active) {
                return res.send({
                    user: user,
                    successMessage: `Registration for user ${u.username} completed, but the user is disabled.  Contact your administrator to activate.`
                })
            }
            return res.send({
                user: user,
                token: jwtSignUser(user)
            })
        } catch (err) {
            console.log(err)
            return res.status(500).send({
                error: 'Error on server: ' + err
            })
        }
    },

    async login(req, res) {
        try {
            var {username, password} = req.body
            username = username.toLowerCase()
            var user = (await User.query()
                .where('username', username)
                .limit(1)
                .first()
                .eager('[usergroups]'))
            
            if (!user) {
                return res.status(400).send({
                    error: 'The login information is incorrect'
                })
            }

            if (!user.active) {
                return res.status(400).send({
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
                if (user.loginAttempts >=3) {
                    user.active = false
                }
                await User.query().patchAndFetchById(user.id, user)
                return res.status(400).send({
                    error: 'The login information is incorrect'
                })
            }
            
            // USER IS AUTHENTIC------
            user.loginCount = user.loginCount+1
            user.loginAttempts = 0
            user.lastLogin = knex.raw('now()')
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
                error: 'An server error has occured trying to log in, contact administrator.'
            })
        }
    }
}

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
        await res.status(400).send({
            error: 'Please select captcha'
        })
        return false
    }
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${config.authentication.recaptchaSecretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`
    await request(verifyUrl, async (err, response, body) => {
        body = JSON.parse(body)
        if (body.success !== undefined && !body.success) {
            await res.status(400).send({
                error: 'Please select captcha'
            })
            return false
        }
    })
    return true
}
async function validateUser(newUser, currentUserId) {
    try {
        newUser.username = newUser.username.toLowerCase()
        newUser.email = newUser.email.toLowerCase()
        const duplicateUsername = await User.query().skipUndefined()
                                                .select('id')
                                                .where("username", newUser.username).andWhere("id", "<>", currentUserId)
                                                .limit(1)

        if (duplicateUsername.length > 0) {
            return {
                error: true,
                message: 'This username is already in use.'
            }
        }

        const duplicateEmail = await User.query().skipUndefined()
                                                .select('id')
                                                .where("email", newUser.email)
                                                .andWhere("id", "<>", currentUserId).limit(1)
        if (duplicateEmail.length > 0) {
            return {
                error: true,
                message: 'This email is already in use.'
            }
        }
        return {error: false}
    } catch (err) {
        return {
            error: true,
            message: 'Internal server error: Unable to validate, contact administrator.'
        }
    }
}

module.exports.jwtSignUser = jwtSignUser
module.exports.validateUser = validateUser