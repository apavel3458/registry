import RegistryService from '@/services/RegistryService'
import router from '@/router'

export default {
   setToken ({commit}, token) {
      commit('setToken', token)
  },
  setUser ({commit}, user) {
      commit('setUser', user)
  },
  async init({dispatch, commit}) {
    commit('SET_ACTIVE_REGISTRY', null)
    await dispatch('fetchRegistryList')
  },

  setActivePatient ({commit}, patient) {
      commit('SET_ACTIVE_PATIENT', patient)
  },
   //returns true or false depending on if registry is found
   async setActiveRegistryById ({state, dispatch, commit}, registryId) {
         !state.registryList.length && await dispatch('fetchRegistryList') //ensure list is loaded
         if (!state.activeRegistry || state.activeRegistry.id != registryId) {
            const registryFound = state.registryList.find(r => r.id == registryId)
            if (registryFound) {
               commit('SET_ACTIVE_REGISTRY', registryFound)
               commit('SET_ACTIVE_PATIENT', null)
               return true
            } else {
               return false
            }
         }
         return true
   },
   setActiveRegistry({commit}, registry) {
      registry && commit('SET_ACTIVE_REGISTRY', registry) && commit('SET_ACTIVE_PATIENT', null)
   },

  async fetchRegistryList ({commit}) {
      let registryList = await RegistryService.registryList()
      commit('SET_REGISTRY_LIST', registryList)  //may not need to store list
      //commit('SET_ACTIVE_REGISTRY', registryList[0])
      return registryList
  },

  async loadPatient(context, id) {
      if (id && id != '')
        router.push({name:'patient', params:{patientId: id}}) //if id is set, then go to ID
      else {
        id = router.currentRoute.params.patientId  //if id is not set then extract ID from URL
      }
      
      if (id && id != '') {
        let activePatient = await RegistryService.patient(id)
        context.commit('SET_ACTIVE_PATIENT', activePatient)

        //ensure active registry is patient's registry
        if (activePatient.registryId != context.state.activeRegistry.id) context.commit('SET_ACTIVE_REGISTRY', activePatient.registry)
      } else {
        context.commit('SET_ACTIVE_PATIENT', null) //if no ID found anywhere, then set it to null and take to nome page. 
      }
      return context.activePatient
  },


  registryCount({commit}, payload) {
      commit('INCREMENT_REGISTRY', payload)
  }
}