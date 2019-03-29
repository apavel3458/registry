/* eslint-disable no-console */
const knexConfig = require ('../../src/config/config.db.knex.js')

const Knex = require('knex');

exports.seed = async function(knex, Promise) {
    await knex('users').del()
    await knex('users').insert(require('./users.json'))
    await knex('usergroups').del()
    await knex('usergroups').insert(require('./usergroups.json'))

    //make admin association
    const groupid = await knex.select('id as usergroupid')
        .from('usergroups')
        .where('groupName', 'Admin').first();
    const userid = await knex.select('id as userid')
        .from('users')
        .where('email', 'apavel@gmail.com').first();
    await knex('usergrouplink').insert({...groupid, ...userid})
  }
