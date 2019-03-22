/* eslint-disable no-console */
'use strict';

const { Model } = require('objection');
const _ = require('lodash')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'users';
  }

  
  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    delete json.password
    return _.pick(json, Object.keys(this.constructor.jsonSchema.properties));
  }

  $afterGet() {
    delete this.password
  }



  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName','lastName','email'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: {type: 'string', minLength: 1, maxLength: 255 },
        loginAttempts: { type: 'integer' },
        loginCount: { type: 'integer' },
        lastLogin: {type: 'date'},
        active: {type: ['integer','boolean']}
      }
    };
  }

  static get relationMappings() {
    return {
      actors: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one. We use the file path version
        // here to prevent require loops.
        modelClass: __dirname + '/usergroup',
        join: {
          from: 'users.id',
          // ManyToMany relation needs the `through` object to describe the join table.
          through: {
            from: 'usergrouplink.userId',
            to: 'usergrouplink.usergroupId'
          },
          to: 'usergroups.id'
        }
      }
    };
  }
  

}

User.prototype.cleanForJWT = function() {
  const user = _.pick(this, ['id', 'firstName','lastName','email','active','lastLogin'])
  return user
}

User.comparePassword = function (candidatePassword, userPassword) {
  const result = bcrypt.compareSync(candidatePassword, userPassword)
  return result
}

// eslint-disable-next-line no-unused-vars
User.hashPassword = async function (password) {
  const SALT_FACTOR = 8
  if (!password || password == '') {
      return null
  }
  const salt = await bcrypt.genSaltAsync(SALT_FACTOR)
  const hash = await bcrypt.hashAsync(password, salt, null)
  return hash
}

// User.prototype.toJSON =  function () {
//     console.log("REMOVING PASSWORDS")
//     var values = Object.assign({}, this);
//     delete values.password;
//     return values;
//  }

module.exports = User