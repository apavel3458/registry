/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const User = require('../models/user')
const UserGroup = require('../models/usergroup')
const _ = require('lodash')
const knex = require('knex');

module.exports = {
    async index(req, res) {
        try {
            let user = null
            const search = req.query.search
            if (search) {
                user = await User.query().where('firstName', 'like', `%${search}%`)
                                        .orWhere('lastName', 'like', `%${search}%`)
                                        .orWhere('email', 'like', `%${search}%`)
            } else {
                user = await User.query()
            }

            res.send(user)
            
        } catch (err) {
            console.log("Error: ", err)
            res.status(500).send({
                error: 'An error has occured trying to fetch users.'
            })
        }
    },

    async put(req, res) {
        try {
            
            const userIn = req.body
            
            console.log(userIn)
            const pwhashed = await User.hashPassword(userIn.password)
            const user = await User.query().patchAndFetchById(userIn.id, userIn) //password is removed automatically
            if (pwhashed) {//manually update password
                await User.knex().from('users')
                    .where({id: user.id})
                    .update({ password: pwhashed })
            }
            console.log(user)
            res.send(user)
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to fetch user.'
            })
        }
    },

    async delete(req, res) {
        try {
            //const user = await User.findOne(req.params.userId)
            await User.query().deleteById(req.body.id)
            res.send(true)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch referrals.'
            })
        }
    },

    async groups(req, res) {
        try {
            const userGroups = await UserGroup.query()
            res.send(userGroups)
        } catch (err) {
            console.log("Error: ", err)
            res.status(500).send({
                error: 'An error has occured trying to fetch users.'
            })
        }
    },

    async changepw(req, res) {
        try {
            
            const input = req.body
            console.log(input)
            console.log(req.user)
            //first confirm password
            const userPassword = (await User.knex().from('users')
                .select('id', 'password')
                .where('id', req.user.id)
                .first()).password
            const isPasswordValid = await User.comparePassword(input.password, userPassword)
            if (!isPasswordValid) {
                return res.status(401).send({
                    error: "Password change failed: Current password is incorrect"
                })
            }
            
            //USER IS AUTHENTIC------
            const newPasswordHashed = await User.hashPassword(input.newPassword)
            //const user = await User.query().patchAndFetchById(req.user.id, {password: newPasswordHashed})
            if (newPasswordHashed) {//manually update password
                await User.knex().from('users')
                    .where({id: req.user.id})
                    .update({ password: newPasswordHashed })
            }
            //console.log(user)
            res.send({success: true})
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to fetch user.'
            })
        }
    },
    
}
