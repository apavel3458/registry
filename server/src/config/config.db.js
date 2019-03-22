const path = require('path')

module.exports = {
    database: process.env.DB_NAME || 'referrals',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'yili',
    dialect: process.env.DIALECT || 'sqlite',
    host: process.env.HOST || 'localhost',
    storage: path.resolve(__dirname, '../../db/db.sqlite'),
    //operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
        }
}