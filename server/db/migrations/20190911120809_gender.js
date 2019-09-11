
exports.up = function(knex) {
   return knex.schema.table('patients', t => {
      t.string('gender')
   })
};

exports.down = function(knex) {
   return knex.schema.table('patients', t => {
      t.dropColumn('gender')
   })
};
