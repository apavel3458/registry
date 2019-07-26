/* eslint-disable no-console */
const Patient = require('../models/patient')
const Registry = require('../models/registry')
const {transaction} = require('objection')

module.exports = {
   async patientGet(req, res) {
      try {
         const id = req.params.id

         const patient = await Patient.query().findById(id)
            .eager('[registry]').first()
         return res.send(patient)
      } catch (err) {
         console.log(err)
         res.status(500).send({
            error: 'An error occured while retrieving the patient'
         })
      }
   },
   async patientGetPage(req, res) {
      try {
         console.log(req.query)
         const page = parseInt(req.query.page)-1
         const pageSize = (req.query.size > 0)?req.query.size:100
         const registryId = req.query.registryId
         const sortBy = req.query.sortBy
         const descending = (req.query.descending=='true')?'desc':'asc'
         console.log("descending: " + descending)
         const result = await Patient
            .query()
            //.skipUndefined()
            .select('id', 'firstName', 'lastName', 'mrn', 'dob', 'createdAt')
            .where('registryId', registryId)
            .orderBy(sortBy, descending)
            .page(page, pageSize);
         console.log(result)
         return res.send(result)
      } catch (err) {
         console.log(err)
         res.status(500).send({
            error: 'Cannot get patient list (page)'
         })
      }
   },
   async patientSearch(req, res) {
      try {
         console.log(req.query)
         const search = req.query.searchText
         let max = (req.query.max)?req.query.max:10
         //if (max == -1) max = 500
         let registryId = parseInt(req.query.registryId)
         
         if (search) {
               const patients = await Patient.query()
               .eager('registry')
               .where('registryId', registryId)
               .andWhere(function() {
                  this.where('firstName', 'like', `%${search}%`)
                  .orWhere('lastName', 'like', `%${search}%`)
                  .orWhere('mrn', 'like', `%${search}%`)
               })
                  .orderBy('lastName', 'DESC')
                  .limit(max)
               //console.log(patients)
               return res.send(patients)
         } else {
            return res.send(null)
         }
      } catch (err) {
         console.log(err)
         res.status(500).send({
            error: 'An error occured while retrieving the patient'
         })
      }
   },
   async patientAdd(req, res) {
      try {
         let graph = req.body
         graph.createdBy = graph.user.lastName + ", " + graph.user.firstName
         graph.registry = {
            id: req.body.registry.id
         }
         console.log(graph)
         const patient = await transaction(Patient.knex(), async trx => {

         const duplicate = await Patient.query(trx)
                  .where('firstName', graph.firstName)
                  .andWhere('lastName', graph.lastName)
                  .andWhere('dob', graph.dob)
               if (duplicate.length != 0) {
                  console.log("Duplicate Detected")
                  return {
                     message: "Patient already exists",
                     patient: duplicate
                  }
               }
               const options = {
                  relate: ['registry']
               }
               return (
                  await Patient.query(trx)
                     .allowUpsert('[registry]')
                     .upsertGraph(graph, options)
               )

          })
          console.log(patient)
          return res.send(patient)
      } catch (err) {
          console.log(err)
          res.status(500).send({
              error: 'An error has occured while trying to add patient.'
          })
      }
  },
  
  async patientUpdate(req, res) {
   try {
      let graph = req.body
      const id = req.params.id
      graph.updatedBy = graph.user.lastName + ", " + graph.user.firstName
      graph.id = parseInt(id)
      console.log(graph)
       const patient = await transaction(Patient.knex(), async trx => {
            return (
               await Patient.query(trx)
                  .allowUpsert('[registry]')
                  .upsertGraph(graph, {relate: true})
            )
       })
       return res.send(patient)
   } catch (err) {
       console.log(err)
       res.status(500).send({
           error: 'An error has occured while trying to update patient.'
       })
   }
},
async patientDelete(req, res) {
   try {
      const id = req.params.id
       await Patient.query().deleteById(id)
       return res.send({
          success: true
       })
   } catch (err) {
       console.log(err)
       res.status(500).send({
           error: 'An error has occured while trying to delete patient.'
       })
   }
},
  async registryList(req, res) {
     try {
        const registryList = await Registry.query()
            .select('registries.*', Registry.relatedQuery('patients').count().as('registrySize'))
           
        return res.send(registryList)
     } catch (err) {
         console.log(err)
         res.status(500).send({
            error: 'An error has occured while trying to fetch the registry list.'
         })
     }
  }
}