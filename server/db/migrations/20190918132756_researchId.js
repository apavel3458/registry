
exports.up = function(knex) {
   return knex.schema.table('patients', t => {
      t.string('studyId')
      t.string('middleName')
   })
};

exports.down = function(knex) {
   return knex.schema.table('patients', t => {
      t.dropColumn('studyId')
      t.dropColumn('middleName')
   })
};
