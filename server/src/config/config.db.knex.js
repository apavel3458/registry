const path = require('path')

module.exports = {
    development: {
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: path.resolve(__dirname, '../../db/db.sqlite')
      },
      migrations: {
        directory: path.resolve(__dirname, '../../db/migrations')
      },
      seeds: {
        directory: path.resolve(__dirname, '../../db/seeders')
      },
      pool: {
        afterCreate: (conn, cb) => {
          conn.run('PRAGMA foreign_keys = ON', cb);
        }
      }
    },
  
    production: {
      client: 'postgresql',
      connection: {
        database: 'example'
      },
      pool: {
        min: 2,
        max: 10
      }
    }
  };