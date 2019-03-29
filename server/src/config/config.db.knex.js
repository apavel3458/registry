const path = require('path')

module.exports = {
    sqlite: {
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

    development: {
      client: 'mysql2',
      connection: {
        host : '127.0.0.1',
        user : 'root',
        password : 'liyi',
        database : 'registry',
        timezone: 'UTC',
        dateStrings: true
      },
      migrations: {
        directory: path.resolve(__dirname, '../../db/migrations')
      },
      seeds: {
        directory: path.resolve(__dirname, '../../db/seeders')
      },
      
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
  }