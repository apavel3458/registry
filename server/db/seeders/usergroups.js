
const users = require('../seed/usergroups.json')

// eslint-disable-next-line no-unused-vars
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('usergroups').del()
    .then(function () {
      // Inserts seed entries
      return knex('usergroups').insert(users);
    });
};