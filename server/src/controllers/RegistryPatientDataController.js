/* eslint-disable no-console */
//const Components = ['../models/diagnosis.js', '../models/imaging.js'].map(require)

const Patient = require('../models/patient')

const components = ['diagnosis', 'imaging', 'event', 'medication', 'device', 'other']

function findComponent(query) {
   const componentFind = components.filter(x => x.toUpperCase() === query.toUpperCase()) //security
   if (componentFind.length > 0) {
      const component = require('../models/' + componentFind[0])
      if (component) return component
   } 
   else return null
}

function getSignature(user) {
   return  `${user.lastName}, ${user.firstName}`
}

module.exports = {

   async patientGetAll(req, res) {
      try {
         const id = req.params.id
         const patient = await Patient.query().findById(id)
            .eager('[registry, diagnosis, imaging, event, medication, device, other]').first()
         return res.send(patient)
      } catch (err) {
         console.log(err)
         res.status(500).send({
            error: 'An error occured while retrieving the patient'
         })
      }
   },

   async patientUpdateAll(req, res) {
      try {
         //const registryId = req.params.registryId
         let pt = req.body
         pt.registry && delete pt.registry
         pt.id = parseInt(req.params.id)
         pt.updatedBy = `${req.user.lastName}, ${req.user.firstName}`
         pt.updatedAt = new Date()
         //console.log(pt)

         const patient = await Patient.query()
            .allowUpsert('[diagnosis, imaging, event, medication, device, other]')
            .upsertGraph(pt)
         return res.send(patient)
      } catch (err) {
         console.log(err)
         res.status(500).send({
            error: 'An error occured while upserting patient data'
         })
      }
   },
   
   //------------ DIAGNOSIS METHODS-----------------
   async itemPost(req, res) {
      try {
         let item = req.body
         item.patientId = parseInt(req.params.patientId)
         item.updatedBy = getSignature(req.user)
         console.log(item)
         const component = findComponent(req.params.component)

         if (!component) {
            return res.status(400).send({
               error: 'Error: Wrong component'
            })
         }
         const result = await component.query().insert(item)
         console.log(result)
         return res.send(result)
      } catch (err) {
         console.log(err)
         return res.status(500).send({
            error: `An error has occured while trying to add ${req.params.component} item ${req.params.id}.`
        })
      }
   },

   async itemGet(req, res) {
      try {
         const patientId = parseInt(req.params.patientId)
         const Component = findComponent(req.params.component)
         if (Component) {
            const result = await Component.query()
                           .where('patientId', patientId)
            return res.send(result)
         } else {
            return res.status(400).send({
               error: 'Error: wrong component'
            })
         }

      } catch (err) {
         console.log(err)
         return res.status(500).send({
            error: `An error has occured while trying to get list of ${req.params.component} for patient ${req.params.patientId}.`
        })
      }
   },

   async itemPut(req, res) {
      try {
         const itemId = parseInt(req.params.itemId)
         const Component = findComponent(req.params.component)
         let item = req.body
         item.updatedBy = getSignature(req.user)
         console.log(item)
         item.patientId = parseInt(req.params.patientId)

         //console.log(item)
         if (!Component) return res.status(400).send({
            error: 'Error: wrong component'
         })
         const result = await Component.query()
                  .patchAndFetchById(itemId, item)
         //console.log(item)
         return res.send(result)
      } catch (err) {
         console.log(err)
         return res.status(500).send({
            error: `An error has occured while trying to add ${req.params.component} item ${req.params.id}.`
        })
      }
   },

   async itemDelete(req, res) {
      try {
         //const patientId = parseInt(req.params.patientId)
         const itemId = parseInt(req.params.itemId)
         const Component = findComponent(req.params.component)
         if (Component) {
            const result = await Component.query()
               .deleteById(itemId)
            return res.send({
               deleted: result
            })
         } else return res.status(400).send({error: "Cannot find component"})
      } catch (err) {
         console.log(err)
         return res.status(500).send({
            error: `An error has occured while trying to delete ${req.params.component} study ${req.params.itemId}.`
        })
      }
   },

}