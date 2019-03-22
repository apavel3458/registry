/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const Joi = require('joi')

module.exports = {
    register (req, res, next) {
        const schema = {
            lastName: Joi.string().alphanum().min(1).max(30),
            firstName: Joi.string().alphanum().min(1).max(30),
            email: Joi.string().email(),
            password: Joi.string().regex(
                new RegExp('^.{8,32}$')
            ),
            recaptchaToken: Joi.string().allow('').optional()
        }

        const {error, value} = Joi.validate(req.body, schema)
        console.log("VALIDATION: " + JSON.stringify(req.body))
        if (error) {
            switch(error.details[0].context.key) {
                case 'firstName':
                    res.status(400).send({
                        error: 'You must provide a valid first name'
                    })
                    break
                case 'lastName':
                    res.status(400).send({
                        error: 'You must provide a valid last name'
                    })
                    break
                case 'email':
                    res.status(400).send({
                        error: 'You must provide a valid email address'
                    })
                    break
                case 'password':
                    res.status(400).send({
                        error: `The password provided failed to match the following rules:
                        <br>
                        1. Must contain at least 8 characters
                        `
                    })
                    break
                case 'recaptchaToken':
                    res.status(400).send({
                        error: `Token Fault`
                    })
                    break
                default: 
                    res.status(400).send({
                        error: 'Invalid registration information'
                    })
            }
        } else {
            next()
        }
    }
}