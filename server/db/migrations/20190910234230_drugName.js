
exports.up = function(knex) {
   return knex.schema.table('medications', t => {
      t.string('drugName')
      t.renameColumn('class', 'drugClass')
   })
};

exports.down = function(knex) {
   return knex.schema.table('medications', t=> {
      t.dropColumn('drugName')
      t.renameColumn('drugClass', 'class')
   })
};
