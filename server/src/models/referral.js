'use strict';

const { Model } = require('objection');

class Usergroup extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'referrals';
  }
/*
  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    return _.pick(json, Object.keys(this.constructor.jsonSchema.properties));
  }
  */



  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        pin: { type: 'string', minLength: 1, maxLength: 255 },
        dob: { type: 'date' },
        referringName: { type: 'string', minLength: 1, maxLength: 255 },
        referringEmail: { type: 'string', minLength: 1, maxLength: 255 },
        referringAttending: { type: 'string', minLength: 1, maxLength: 255 },
        dateSeenInER: { type: 'date', minLength: 1, maxLength: 255 },
        comments: { type: 'string', minLength: 1, maxLength: 255 }
      }
    };
  }
/*
  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one. We use the file path version
        // here to prevent require loops.
        modelClass: __dirname + '/user',
        join: {
          from: 'usergroup.id',
          // ManyToMany relation needs the `through` object to describe the join table.
          through: {
            from: 'usergrouplink.usergroupId',
            to: 'usergrouplink.userId'
          },
          to: 'user.id'
        }
      }
    };
  }*/
  

}


module.exports = Usergroup;