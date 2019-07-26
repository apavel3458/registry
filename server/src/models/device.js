'use strict';

const { Model } = require('objection');
const _ = require('lodash')

class Event extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'devices';
  }

  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    //json = JSON.parse(JSON.stringify(json).replace(/null/g, '""')) //remove all nulls
    const props = this.constructor.jsonSchema.properties;
    Object.keys(props).filter(p => props[p].type == 'string').forEach(d => {  //replace string nulls  to '' (otherwise database freaks out)
      json[d] = (json[d] == null)?'':json[d]
    })
    Object.keys(props).filter(p => props[p].type == 'date').forEach(d => {  //replace date ''  to null (otherwise database freaks out)
    json[d] = (json[d] == '')?null:json[d]
    })
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
        deviceName: { type: 'string', minLength: 1, maxLength: 255 },
        implantDate: { type: 'date'},
        explantDate: { type: 'date'},
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
               from: 'devices.patientId',
               to: 'patients.id'
            }
         }
      }
   }
}


module.exports = Event;