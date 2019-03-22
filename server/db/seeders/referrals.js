const users = require('../seed/referrals.json')

// eslint-disable-next-line no-unused-vars
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('referrals').del()
    .then(function () {
      // Inserts seed entries
      return knex('referrals').insert(users);
    });
};