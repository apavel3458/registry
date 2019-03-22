/* eslint-disable no-console */
const knexConfig = require ('../../src/config/config.db.knex.js')

const Knex = require('knex');
//const knexConfig = require('.knexfile');
const knex = Knex(knexConfig.development);
const seeder = require('./users')
const UserGroups = require('./usergroups')
const Referrals = require('./referrals')

seeder.seed(knex)
UserGroups.seed(knex)
Referrals.seed(knex)

console.log("finished...")