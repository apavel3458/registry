/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { transaction } = require('objection');
const User = require('../models/user')
const UserGroup = require('../models/usergroup')
const _ = require('lodash')
const knex = require('knex');

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
                console.log(user)
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
        console.log(req.query.eager)
        var userGroups = null
        if (req.query.eager) {
            userGroups = await (UserGroup.query()
                .allowEager('[users]')
                .eager(req.query.eager)
                .modifyEager('users', usersBuilder => usersBuilder.select('users.id', 'users.firstName', 'users.lastName')))
                console.log(JSON.stringify(userGroups))
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

    async changepw(req, res) {
        try {
            
            const input = req.body

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

function createStatusCodeError(statusCode, err) {
    return Object.assign(new Error(), {
      statusCode
    });
  }