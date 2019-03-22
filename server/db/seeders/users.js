
const users = require('../seed/users.json')

// eslint-disable-next-line no-unused-vars
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert(users);
    });
};