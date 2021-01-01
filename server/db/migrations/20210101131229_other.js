
exports.up = function(knex) {
   return knex.schema
   .createTable('other', table => {
      table.increments('id').primary()
      table
      .integer('patientId')
      .unsigned()
      .references('id').inTable('patients')
      .onDelete('CASCADE')
      .index()
      table.string('otherName')
      table.date('otherDate')
      table.string('visibleDetail')
      table.text('comments')
      table.json('details')
      table.string('updatedBy')
      table.timestamp('updatedAt').defaultTo(knex.fn.now())
      table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
   return knex.schema
   .dropTableIfExists('other')
};
