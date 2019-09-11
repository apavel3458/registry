'use strict';

const { Model } = require('objection');
const { prepJson } = require('./util')

class Diagnosis extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'diagnoses';
  }

  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);
    return prepJson(json, this.constructor.jsonSchema.properties)
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
        diagnosisName: { type: 'string', minLength: 1, maxLength: 255 },
        dateStart: { type: 'date'},
        dateEnd: { type: 'date' },
        treatingPhysician: { type: ['string', null]},
        biopsyProven: { type: ['boolean', 'integer', null] },
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
               from: 'diagnoses.patientId',
               to: 'patients.id'
            }
         }
      }
   }
}


module.exports = Diagnosis;