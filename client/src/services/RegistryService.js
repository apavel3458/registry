import Api from '@/services/Api'

export default {
  async addPatient(p) {
    return (await Api().post(`registry/patient`, p)).data
  },
  async updatePatient(p) {
    return (await Api().put(`registry/patient/${p.id}/update`, p)).data
  },
  async deletePatient(p) {
    return (await Api().delete(`registry/patient/${p.id}/delete`)).data
  },
  async registryList() {
    return (await Api().get(`registry`)).data
  },
  async patient(id) { //for selecting patients with patientId
    return (await Api().get(`registry/patient/${id}`)).data
  },
  async patientSelect(registryId, params) { //for selecting the patient by non-id
    return (await Api().get(`/registry/${registryId}/patient`, {
      params: params
    })).data
  },
  async patientAllData(id) {
    return (await Api().get(`registry/patient/${id}/all`)).data
  },
  async updatePatientAllData(patient) {
    return (await Api().patch(`registry/patient/${patient.id}/all`, patient)).data
  },
  async patientSearch(registryId, txt) { //for searching by keyword
    return (await Api().get(`registry/patient/search`, {
      params: {
        registryId: registryId,
        searchText: txt,
        max: 10
      }
    })).data
  },
  async patientGetPage(registryId, page, pageSize, sortBy, descending) {
    return (await Api().get(`registry/patient/getpage`, {
      params: {
        registryId: registryId,
        page: page,
        size: pageSize,
        sortBy: sortBy,
        descending: descending
      }
    })).data
  },
  async downloadAllData (registryId) {
    return (await Api().get(`/registry/${registryId}/download/all`)).data
  }
}

