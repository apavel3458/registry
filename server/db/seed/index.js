const {
    sequelize,
    Referral,
    User,
    UserGroup
} = require ('../../src/models')

const Promise = require('bluebird')
const users = require('./users.json')
const referrals = require('./referrals.json')
const usergroups = require('./usergroups.json')

sequelize.sync({force: true})
    .then(async function () {
        await Promise.all(
            users.map(user => {
                User.create(user)
            })
        )

        await Promise.all(
            referrals.map(referral => {
                Referral.create(referral)
            })
        )
        await Promise.all(
            usergroups.map(usergroup => {
                UserGroup.create(usergroup)
            })
        )
    })