/* eslint-disable no-console */
const knexConfig = require ('../../src/config/config.db.knex.js')

const Knex = require('knex')
const fs = require('fs')
const path = require('path')
const process = require('process')
const seedersDirectory = knexConfig.development.seeds.directory
const seedList = [
    'users', 'usergroups', 'diseases', 'registries', 'patients'
]

async function writeAdminGroup(knex) {
    const groupid = await knex.select('id as usergroupid')
            .from('usergroups')
            .where('groupName', 'Admin').first();
    console.log(groupid)
    const userid = await knex.select('id as userid')
            .from('users')
            .where('email', 'apavel@gmail.com').first();
    console.log(userid)
    await knex('usergrouplink').insert({...groupid, ...userid})
}

exports.seed = async function(knex, Promise) {
    
    // fs.readdir(seedersDirectory, async (err, files) => {
    //     if (err) {
    //         console.error("could not use directory.", err)
    //         process.exit(1)
    //     }
    //     await seedList.forEach(async seedFile => {
    //         //const file = path.parse(fileE)
    //         await console.log("Clearing: " + seedFile)
    //         await console.log("done: " + seedFile)
    //         await knex(seedFile).del()
    //         await console.log("Inserting: " + seedFile)
    //         await knex(seedFile).insert(require(`${seedersDirectory}/${seedFile}.json`))
    //     })
    //     await writeAdminGroup(knex)
    // })
    await knex('users').del()
    await knex('usergroups').del()
    await knex('diseases').del()
    await knex('registries').del()
    await knex('patients').del()


    await knex('users').insert(require('./users.json'))
    await knex('usergroups').insert(require('./usergroups.json'))
    await knex('diseases').insert(require('./diseases.json'))
    await knex('registries').insert(require('./registries.json'))
    await knex('patients').insert(require('./patients.json'))

    //make admin association
    await writeAdminGroup(knex)
  }
