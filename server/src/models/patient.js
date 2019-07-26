'use strict';

const { Model } = require('objection');
const _ = require('lodash')

class Patient extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'patients';
  }

  $parseJson(json, opt) {
      json = super.$parseJson(json, opt);
      this.constructor.jsonSchema.readOnlyProps.forEach(x => {
         if (json[x]) {
            json[x] = 
               _.pick(json[x], Object.keys(this.constructor.jsonSchema.properties[x].properties || {id:''}))
         }
      })
      json = _.pick(json, Object.keys(this.constructor.jsonSchema.properties));
      //console.log(json)
      json = _.pickBy(json, _.identity);
      //console.log(json)
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
        
        registry: { type: 'Object',
         properties: {
            id: { type: 'integer'}
         }},
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        mrn: { type: 'string', minLength: 1, maxLength: 255 },
        dob: { type: 'date' },
        deceasedDate: { type: ['date'], minLength: 1, maxLength: 255 },
        causeOfDeath: { type: ['string'], minLength: 1, maxLength: 255 },
        createdBy: { type: 'string' },
        updatedBy: { type: 'string' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      },
      readOnlyProps: ['registry']
    };
  }


  static get relationMappings() {
     return {
         registry: {
            relation: Model.BelongsToOneRelation,
            modelClass: __dirname + '/registry',
            join: {
            from: 'patients.registryId',
            to: 'registries.id'
            }
         },
         imaging: {
            relation: Model.HasManyRelation,
            modelClass: __dirname + '/imaging',
            join: {
               from: 'patients.id',
               to: 'imaging.patientId'
            }
         }
      }
   }
}


module.exports = Patient;


   //  const output = _.pick(json, 
   //       [
   //          ...Object.keys(this.constructor.jsonSchema.properties).map(k => {
   //             return (k=='user'|| k=='group')?k+'.id':k //only get ID of nested properties to avoid updating users and groups 
   //          })
             
   //       ])