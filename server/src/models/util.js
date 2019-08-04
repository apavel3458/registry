
const _ = require('lodash')

module.exports = {
      prepJson: function(json, schemaProperties) {
         //json = JSON.parse(JSON.stringify(json).replace(/null/g, '""')) //remove all nulls
         const props = schemaProperties
         Object.keys(props).filter(p => props[p].type == 'string').forEach(d => {  //replace string nulls  to '' (otherwise database freaks out)
         json[d] = (json[d] == null)?'':json[d]
         })
         Object.keys(props).filter(p => props[p].type == 'number').forEach(d => {  //replace string nulls  to '' (otherwise database freaks out)
         if (json[d] == null) delete json[d]
         })
         Object.keys(props).filter(p => props[p].type == 'date').forEach(d => {  //replace date ''  to null (otherwise database freaks out)
         json[d] = (json[d] == '')?null:json[d]
         })
         return _.pick(json, Object.keys(props));
      }
}