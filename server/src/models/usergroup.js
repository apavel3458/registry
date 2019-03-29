'use strict';

const { Model } = require('objection');
const _ = require('lodash')

class Usergroup extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'usergroups';
  }

  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    return _.pick(json, Object.keys(this.constructor.jsonSchema.properties));
  }



  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['groupName'],
      properties: {
        id: { type: 'integer' },
        groupName: { type: 'string', minLength: 1, maxLength: 255 },
        users: { type: 'array'}
      }
    };
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one. We use the file path version
        // here to prevent require loops.
        modelClass: __dirname + '/user',
        //filter: query => query.select('users.id', 'users.firstName', 'users.lastName'),
        join: {
          from: 'usergroups.id',
          // ManyToMany relation needs the `through` object to describe the join table.
          through: {
            from: 'usergrouplink.usergroupId',
            to: 'usergrouplink.userId'
          },
          to: 'users.id'
        }
      }
    };
  }
  

}


module.exports = Usergroup;