import Api from '@/services/Api'

export default {
//   async imagingGet(patientId) {
//     return (await Api().get(`registry/patient/${patientId}/imaging`)).data
//   },
//   async imagingPost(imaging) {
//     return (await Api().post(`registry/patient/${imaging.patientId}/imaging`, imaging)).data
//   },
//   async imagingPut(imaging) {
//    return (await Api().put(`registry/patient/${imaging.patientId}/imaging`, imaging)).data
//  },
//   async imagingDelete(patientId, imagingId) {
//     return (await Api().delete(`registry/patient/${patientId}/imaging/${imagingId}`)).data
//   },


  async diagnosisGet(patientId) {
    return (await Api().get(`registry/patient/${patientId}/data/diagnosis`)).data
  },
  async diagnosisPost(diagnosis) {
    return (await Api().post(`registry/patient/${diagnosis.patientId}/data/diagnosis`, diagnosis)).data
  },
  async diagnosisPut(diagnosis) {
   return (await Api().put(`registry/patient/${diagnosis.patientId}/data/diagnosis/${diagnosis.id}`, diagnosis)).data
  },
  async diagnosisDelete(diagnosis) {
    return (await Api().delete(`registry/patient/${diagnosis.patientId}/data/diagnosis/${diagnosis.id}`, diagnosis.id)).data
  },


  async itemGet(patientId, itemType) {
    return (await Api().get(`registry/patient/${patientId}/data/${itemType}`)).data
  },
  async itemPost(item, itemType) {
    return (await Api().post(`registry/patient/${item.patientId}/data/${itemType}`, item)).data
  },
  async itemPut(item, itemType) {
   return (await Api().put(`registry/patient/${item.patientId}/data/${itemType}/${item.id}`, item)).data
  },
  async itemDelete(item, itemType) {
    return (await Api().delete(`registry/patient/${item.patientId}/data/${itemType}/${item.id}`, item.id)).data
  }

  
}

