'use strict';

const { Model } = require('objection');
const _ = require('lodash')

class Event extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'events';
  }

  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    json = JSON.parse(JSON.stringify(json).replace(/null/g, '""')) //remove all nulls
    return _.pick(json, Object.keys(this.constructor.jsonSchema.properties));
  }

  

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        patientId: { type: 'integer', required: true},
        eventName: { type: 'string', minLength: 1, maxLength: 255 },
        eventDate: { type: 'date'},
        visibleDetail: { type: 'string' },
        comments: { type: 'string' },
        details: { type: 'object' },
        patient: { type: 'object'}
      }
    }
  }


  static get relationMappings() {
     return {
         patient: {
            relation: Model.BelongsToOneRelation,
            modelClass: __dirname + '/patient',
            join: {
               from: 'events.patientId',
               to: 'patients.id'
            }
         }
      }
   }
}


module.exports = Event;