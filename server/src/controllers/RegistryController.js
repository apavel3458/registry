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
   async patientGetSearch(req, res) {
      try {
         const registryId = req.params.registryId
         if (!registryId) return res.status(400).send({error: 'Need registryId'})
         console.log("Study Id: " + req.query.studyId)
         const patient = await Patient.query().where('studyId', req.query.studyId).andWhere('registryId', registryId)
            .eager('[registry, diagnosis, imaging, event, device, medication, other]').first()
         console.log(patient)
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
         //console.log(req.query)
         const page = parseInt(req.query.page)-1
         const pageSize = (req.query.size > 0)?req.query.size:100
         const registryId = req.query.registryId
         const sortBy = req.query.sortBy
         const descending = (req.query.descending=='true')?'desc':'asc'
         const result = await Patient
            .query()
            .skipUndefined()
            .select('id', 'firstName', 'middleName', 'lastName', 'mrn', 'dob', 'createdAt')
            .where('registryId', registryId)
            .orderBy(sortBy, descending)
            .page(page, pageSize)
         //console.log(result)
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
         //console.log(req.query)
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
                  .orWhere('studyId', 'like', `%${search}%`)
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
         graph.createdBy = req.user.lastName + ", " + req.user.firstName
         console.log(req.body)
         if (!req.body.registry || !req.body.registry.id) return res.status(400).send({error: 'Must have registry'})
         graph.registry = {
            id: req.body.registry.id
         }
         
         //console.log(graph)
         const patient = await transaction(Patient.knex(), async trx => {

            const duplicate = await Patient.query(trx).skipUndefined()
                     .where(function() {
                        this.where(function() {
                           this.skipUndefined().where('firstName', graph.firstName).andWhere('lastName', graph.lastName).andWhere('dob', graph.dob)
                        })
                        .orWhere('mrn', graph.mrn)
                     }).andWhere('registryId', graph.registry.id)
                     .first()
            if (duplicate && duplicate.length != 0) {
               console.log("Duplicate Detected")
               return {
                  error: `Patient already exists: ${duplicate.lastName}, ${duplicate.firstName}, ${duplicate.middleName} (${duplicate.mrn})`,
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
          if (patient.error) {
             return res.status(400).send(patient)
          } else {
            return res.send(patient)
          }
      } catch (err) {
          console.log(err)
          res.status(500).send({
              error: 'An error has occured while trying to add patient.'
          })
      }
  },
  
  async patientUpdate(req, res) {
   try {
      let pt = req.body
      const id = req.params.id
      pt.updatedBy = req.user.lastName + ", " + req.user.firstName
      pt.id = parseInt(id)
      console.log(pt)
       const patient = await transaction(Patient.knex(), async trx => {
            return (
               await Patient.query(trx)
                  .patchAndFetchById(pt.id, pt)
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
  async registryListAll(req, res) {
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
  },
  async registryListUser(req, res) {
      try {
         const groupMemberships = req.user.usergroups.map(x=>x.groupName)
         const registryList = await Registry.query()
            .select('registries.*', Registry.relatedQuery('patients').count().as('registrySize'))
               .whereIn('registries.registryName', groupMemberships)
               .andWhere('active', true)
               
         return res.send(registryList)
      } catch (err) {
         console.log(err)
         res.status(500).send({
            error: 'An error has occured while trying to fetch the registry list.'
         })
      }
   },

   async registryDownloadAll(req, res) {
      try {
         const registryId = parseInt(req.params.registryId)
         console.log("getting registry", registryId)
         if (isNaN(registryId)) {
            return res.status(400).send({error: 'registryId is not valid'})
         }
         console.log("getting all data")
         const patients = await Patient.query().where('registryId', registryId)
            .eager('[diagnosis, imaging, event, medication, device, other]')
         
         return res.send(patients)
      } catch (err) {
         console.log(err)
         res.status(500).send({
            error: 'An error occured while retrieving the patient'
         })
      }
   },
   
}