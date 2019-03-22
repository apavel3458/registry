/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const Referral = require('../models/referral')

module.exports = {
    async index(req, res) {
        try {
            let referral = null
            const search = req.query.search
            if (search) {
                referral = await Referral.query()
                .where('firstName', 'like', `%${search}%`)
                .orWhere('lastName', 'like', `%${search}%`)
                .orWhere('referringEmail', 'like', `%${search}%`)
                .orWhere('referringName', 'like', `%${search}%`)
                .orWhere('referringAttending', 'like', `%${search}%`)
                .orWhere('pin', 'like', `%${search}%`)
                .orderBy('createdAt', 'DESC')
                .limit(req.query.max)
            } else {
                // if (req.query.max) {
                //     referral = await Referral.query().orderBy('createdAt', 'DESC').limit(req.query.max)
                // } else {
                    referral = await Referral.query().orderBy('createdAt', 'DESC').limit(req.query.max || 10000000)
                // }
            }
            res.send(referral)
            
        } catch (err) {
            console.log("Error: ", err)
            res.status(500).send({
                error: 'An error has occured trying to fetch referrals.'
            })
        }
    },

    async show(req, res) {
        try {
            const referral = await Referral.query().findById(req.params.referralId)
            res.send(referral)
        } catch (err) {
            console.log("Error: ", err)
            res.status(500).send({
                error: 'An error has occured trying to fetch referrals.'
            })
        }
    },

    async put(req, res) {
        try {
            const referral = await Referral.query().patchAndFetchById(req.params.referralId, req.body)
            res.send(referral)
        } catch (err) {
            console.log("Error: ", err)
            res.status(500).send({
                error: 'An error has occured trying to fetch referrals.'
            })
        }
    },

    async add(req, res) {
        try {
            const referral = await Referral.query().insert(req.body)
            res.send(referral)
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'An error has occured trying to create a referral.'
            })
        }
    },

    async delete(req, res) {
        try {
            //const referral = await Referral.findById(req.params.referralId)
            await Referral.query().deleteById(req.body.id)
            res.send(true)
        } catch (err) {
            console.log("Error: ", err)
            res.status(500).send({
                error: 'An error has occured trying to fetch referrals.'
            })
        }
    },

    
}
