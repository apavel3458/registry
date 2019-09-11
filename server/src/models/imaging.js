'use strict';

const { Model } = require('objection');
const _ = require('lodash')

class Imaging extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'imaging';
  }

  $parseJson(json, opt) {
      const props = this.constructor.jsonSchema.properties
      json = super.$parseJson(json, opt);
      this.constructor.jsonSchema.readOnlyProps.forEach(x => { //implements read-only props (not sure if we need this since removing user relation)
         if (json[x]) {
            json[x] = 
               _.pick(json[x], Object.keys(props[x].properties || {id:''}))
         }
      })
      
      json = _.pick(json, Object.keys(props));

      Object.keys(props).filter(p => props[p].type == 'string').forEach(d => {  //replace string nulls  to '' (otherwise database freaks out)
      json[d] = (json[d] == null)?'':json[d]
      })
      Object.keys(props).filter(p => props[p].type == 'date').forEach(d => {  //replace date ''  to null (otherwise database freaks out)
      json[d] = (json[d] == '')?null:json[d]
      })
   return json
  }

  

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        imagingName: { type: 'string', minLength: 1, maxLength: 255 },
        studyDate: { type: 'date'},
        EF: { type: 'float' },
        EFtext: { type: ['string', 'number'], minLength: 1, maxLength: 255 },
        comments: { type: 'string' },
        visibleDetail: { type: ['string','number',null] },
        details: { type: 'object' },
        patient: { type: 'object' },
        patientId: { type: 'integer', required: true}
      },
      readOnlyProps: ['patient']
    }
  }


  static get relationMappings() {
     return {
         patient: {
            relation: Model.BelongsToOneRelation,
            modelClass: __dirname + '/patient',
            join: {
               from: 'imaging.patientId',
               to: 'patients.id'
            }
         }
      }
   }
}


module.exports = Imaging;