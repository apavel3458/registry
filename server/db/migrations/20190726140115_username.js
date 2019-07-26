
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
     t.string('username').unique()
     t.dropUnique('email')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
     t.dropColumn('username')
  })
};
