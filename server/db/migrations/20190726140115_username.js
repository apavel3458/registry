
exports.up = function(knex) {
  return knex.schema.table('users', function(t) {
     t.string('username').unique()
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', function(t) {
     t.dropColumn('username')
  })
};
