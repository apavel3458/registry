/* eslint-disable no-console */
// eslint-disable-next-line no-console
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
//const {sequelize} = require("./models")
const knexConfig = require ('./config/config.db.knex.js')
const config = require('./config/config')

const Knex = require('knex');
//const knexConfig = require('.knexfile');
const knex = Knex(knexConfig.development);
const { Model } = require('objection');
const helmet = require('helmet')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

require('./passport')

require('./routes')(app)

Model.knex(knex)

app.listen(config.port)
console.log(`Server started on port ${config.port}`)
/*
sequelize.sync()
    .then(() => {
        app.listen(config.port)
        console.log(`Server started on port ${config.port}`)
    })*/