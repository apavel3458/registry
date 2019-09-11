/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { transaction } = require('objection');
const User = require('../models/user')
const UserGroup = require('../models/usergroup')
const _ = require('lodash')
const knex = require('knex')
const AuthenticationController = require('./AuthenticationController')

module.exports = {
    async index(req, res) {
        try {
            let user = null
            const search = req.query.search
            /*if (search) {
                user = await User.query().where('firstName', 'like', `%${search}%`)
                                        .orWhere('lastName', 'like', `%${search}%`)
                                        .orWhere('email', 'like', `%${search}%`)
            } else {*/
                user = await User.query()
                    .skipUndefined()
                    .allowEager('[usergroups]')
                    .eager(req.query.eager)
            //}
                //console.log(user)
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
            
            var userIn = req.body
            userIn.id = parseInt(req.body.id, 10)
            
            const pwhashed = await User.hashPassword(userIn.password)

            userIn.usergroups = userIn.usergroups.map(v=>_.pick(v, ['id', 'groupName']))

            
            //check duplicate username
            const duplicateUser = await User.query().where("username", req.body.username).whereNot("id", userIn.id)
            

            if (duplicateUser.length > 0) {
                return res.status(400).send({
                    error: 'This username is already in use.'
                })
            }

            const user = await User.query()
                .allowUpsert('[usergroups]')
                .upsertGraph(userIn, {relate: true, unrelate: true}) //password is removed automatically
                

            if (pwhashed) {//manually update password
                await User.knex().from('users')
                    .where({id: user.id})
                    .update({ password: pwhashed })
            }
            //console.log(user)
            res.send(user)
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'A server error has occured trying to update user.'
            })
        }
    },

    async delete(req, res) {
        try {
            //const user = await User.findOne(req.params.userId)
            await User.query().deleteById(req.params.id)
            res.send(true)
        } catch (err) {
            res.status(500).send({
                error: 'A server error has occured trying to delete user.'
            })
        }
    },

    async groups(req, res) {
        //console.log(req.query.eager)
        var userGroups = null
        if (req.query.eager) {
            userGroups = await (UserGroup.query()
                .allowEager('[users]')
                .eager(req.query.eager)
                .modifyEager('users', usersBuilder => usersBuilder.select('users.id', 'users.firstName', 'users.lastName')))
                //console.log(JSON.stringify(userGroups))
        } else {
            userGroups = await UserGroup.query()
        }
        return res.send(userGroups)
    },

    async addGroup(req, res) {
        try {
            const group = await UserGroup.query().insert(req.body)
            return res.send(group)
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured while trying to add group.'
            })
        }
    },
    async deleteGroup(req, res) {
        
        try {
            await UserGroup.query().deleteById(req.params.id)
            return res.send(true)
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured while trying to delete group.'
            })
        }
    },

    async updateGroup(req, res) {
        try {
            const group = await UserGroup.query()
            .allowUpsert('[users]')
            .upsertGraph(req.body, {relate: true, unrelate: true}) //password is removed automatically
            return res.send(true)
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured while trying to update group.'
            })
        }
    },

    async getGroupUsers(req, res) {
        const user = await User.query().findById(req.params.id);
        if (!user) {
            throw createStatusCodeError(404)
        }
        const groups = await user.$relatedQuery('usergroups');
        res.send(groups)
    },

    // async addGroupToUser(req, res) {
    //     const user = await User.query().findById(req.params.id);
    //     if (!user) {
    //         throw createStatusCodeError(404)
    //     }
    //     const group = await user.$relatedQuery('usergroups').insert(req.body)
    //     res.send(group)
    // },

    async updateUserOptions(req, res) {
        try {
            
            const input = req.body

            //first confirm password
            const userPassword = (await User.knex().from('users')
                .select('id', 'password')
                .where('id', req.user.id)
                .first()).password

            const isPasswordValid = await User.comparePassword(input.password, userPassword)
            if (!isPasswordValid) {
                console.log("Not authenticated to edit user settings")
                return res.status(401).send({
                    error: "Password change failed: Current password is incorrect"
                })
            }
            
            //-------------   USER IS AUTHENTIC   ------


            let passwordHashedToStore = userPassword
            if (input.newPassword && input.newPassword.length > 0) { //if provided new password
                passwordHashedToStore = await User.hashPassword(input.newPassword)
            }
            
            const validation = await AuthenticationController.validateUser(input, req.user.id)

            if (validation.error) {
                return res.status(400).send({
                    error: validation.message
                })
            }

            const result = await User.knex().from('users')
                    .where({id: req.user.id})
                    .update({ password: passwordHashedToStore , username: input.username, email: input.email, lastName: input.lastName, firstName: input.firstName})
            
            const user = await User.query().findById(req.user.id).eager('[usergroups]')

            const userClean = user.cleanForJWT()
            console.log(AuthenticationController.jwtSignUser)
            return res.send({
                        user: user,
                        token: AuthenticationController.jwtSignUser(userClean)
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to update user options.'
            })
        }
    },
    
}

function createStatusCodeError(statusCode, err) {
    return Object.assign(new Error(), {
      statusCode
    });
  }