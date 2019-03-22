exports.up = knex => {
    return knex.schema
      .createTable('users', table => {
        table.increments('id').primary();
        table.string('firstName');
        table.string('lastName');
        table.string('email');
        table.string('password');
        table.integer('loginCount').defaultTo(0)
        table.integer('loginAttempts').defaultTo(0)
        table.timestamp('lastLogin')
        table.boolean('active').defaultTo(true)
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.unique('email')
      })
      .createTable('usergroups', table => {
        table.increments('id').primary()
        table.string('groupName')
        table.unique('groupName')
      })
      .createTable('usergrouplink', table => {
        table.increments('id').primary();
        table
          .integer('userId')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        table
          .integer('usergroupId')
          .unsigned()
          .references('id')
          .inTable('usergroups')
          .onDelete('CASCADE');
      })
      .createTable('referrals', table => {
        table.increments('id').primary()
        table.string('lastName')
        table.string('firstName')
        table.string('pin')
        table.date('dob')
        table.string('referringName')
        table.string('referringEmail')
        table.string('referringAttending')
        table.date('dateSeenInER')
        table.text('comments')
        table.string('testSelected')
        table.date('clinicDate')
        table.string('clinicTime')
        table.date('testDate')
        table.string('testTime')
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
        table.timestamp('createdAt').defaultTo(knex.fn.now())
      })
  };

  
  exports.down = knex => {
    return knex.schema
      .dropTableIfExists('users')
      .dropTableIfExists('usergroups')
      .dropTableIfExists('usergrouplink')
      .dropTableIfExists('referrals')
  };