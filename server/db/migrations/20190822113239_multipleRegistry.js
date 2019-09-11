
exports.up = function(knex) {
   return knex.schema.table('users', function(t) {
      t.unique('email')
   })
   .table('registries', t => {
      t.string('imageURI')
      t.boolean('active').defaultTo(true)
      t.json('details')
   })
};

exports.down = function(knex) {
   return knex.schema.table('users', function(t) {
      t.dropUnique('email')
   })
   .table('registries', t=> {
      t.dropColumn('imageURI')
      t.dropColumn('active')
      t.dropColumn('details')
   })
};
