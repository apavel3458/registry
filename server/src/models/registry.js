'use strict';

const { Model } = require('objection');

class Registry extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'registries';
  }
/*
  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    return _.pick(json, Object.keys(this.constructor.jsonSchema.properties));
  }
  */
//  +--------------+------------------+------+-----+---------+----------------+
//  | Field        | Type             | Null | Key | Default | Extra          |
//  +--------------+------------------+------+-----+---------+----------------+
//  | id           | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
//  | registryName | varchar(255)     | YES  | UNI | NULL    |                |
//  | prefix       | varchar(255)     | YES  |     | NULL    |                |
//  | shortName    | varchar(255)     | YES  |     | NULL    |                |
//  | color        | varchar(255)     | YES  |     | NULL    |                |
//  | imageURI     | varchar(255)     | YES  |     | NULL    |                |
//  | active       | tinyint(1)       | YES  |     | 1       |                |
//  | details      | json             | YES  |     | NULL    |                |
//  +--------------+------------------+------+-----+---------+----------------+
//  8 rows in set (0.00 sec)
 


  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        registryName: { type: 'string', minLength: 1, maxLength: 255 },
        shortName: { type: 'string', minLength: 1, maxLength: 255 },
        color: { type: 'string', minLength: 1, maxLength: 255 },
        imageURI: { type: 'string'},
        active: {type: 'boolean'},
        details: {type: 'json'}
      }
    };
  }


  static get relationMappings() {
     return {
         patients: {
            relation: Model.HasManyRelation,
            modelClass: __dirname + '/patient',
            join: {
            from: 'registries.id',
            to: 'patients.registryId'
            }
         }
      }
   }
}


module.exports = Registry;