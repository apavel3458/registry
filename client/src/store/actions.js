import RegistryService from '@/services/RegistryService'
import router from '@/router'

export default {
   setToken ({commit}, token) {
      commit('setToken', token)
  },
  setUser ({commit}, user) {
      commit('setUser', user)
  },
  async init({dispatch}) {
    await dispatch('fetchRegistryList')
  },

  setActivePatient ({commit}, patient) {
      commit('SET_ACTIVE_PATIENT', patient)
  },
  setActiveRegistry (context, registry) {
      context.commit('SET_ACTIVE_REGISTRY', registry)
  },

  async fetchRegistryList ({commit}) {
      let registryList = await RegistryService.registryList()
      registryList.map(x => x.registryName==='Medical Oncology'?x.disabled=true:x)
      registryList.map(x => x.registryName==='Heart Failure'?x.disabled=true:x)
      commit('SET_REGISTRY_LIST', registryList)  //may not need to store list
      commit('SET_ACTIVE_REGISTRY', registryList[0])
      return registryList
  },
  async loadRegistry({commit}, registry) {
      if (registry && registry != '') {
        commit('SET_ACTIVE_REGISTRY', registry)
      }
  },
  async loadPatient(context, id) {
      if (id && id != '')
        router.push({name:'patient', params:{id: id}}) //if id is set, then go to ID
      else {
        id = router.currentRoute.params.id  //if id is not set then extract ID from URL
      }
      
      if (id && id != '') {
        let activePatient = await RegistryService.patient(id)
        context.commit('SET_ACTIVE_PATIENT', activePatient)
      } else {
        context.commit('SET_ACTIVE_PATIENT', null) //if no ID found anywhere, then set it to null and take to nome page. 
      }
      return context.activePatient
  },


  registryCount({commit}, payload) {
      commit('INCREMENT_REGISTRY', payload)
  }
}