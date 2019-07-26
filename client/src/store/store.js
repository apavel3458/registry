import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import RegistryService from '@/services/RegistryService'
import router from '@/router'


Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: {
    token: null,
    user: null,
    registryList: [], //may not need to store list
    activeRegistryId: null,
    activePatient: null
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUser (state, user) {
      state.user = user
    },
    login (state, payload) {
      state.token = payload.token
      state.user = payload.user
    },
    logout (state) {
      state.user = null
      state.token = null
    },
    SET_REGISTRY_LIST(state, registryList) {
      state.registryList = registryList
    },
    SET_ACTIVE_REGISTRY(state, registry) {
      state.activeRegistry = registry
    },
    SET_ACTIVE_PATIENT(state, patient) {
      state.activePatient = patient
    },
    INCREMENT_REGISTRY(state, {registryId, increment}) {
      let reg = state.registryList.find(r => r.id == registryId)
      reg.registrySize = reg.registrySize+increment
    }
  },
  actions: {  //update state
    setToken ({commit}, token) {
        commit('setToken', token)
    },
    setUser ({commit}, user) {
        commit('setUser', user)
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
  },
  getters: {  //access state
    isAuthenticated: (state) => {
      //alert("checking authentication: " + state.token?true:false)
      return (state.token&&state.user)?true:false
    },
    isAdmin: (state) => {
      //return state.groups.includes('admin')
      if (state.user && state.user.usergroups) {
        //console.log(state.user.usergroups.length)
        return state.user.usergroups.find(group => group.groupName.toLowerCase() === 'admin')?true:false
      } else {
        return false
      }
    },
    getActivePatient: (state) => {
      return state.activePatient
    },
    getActiveRegistry: (state) => {
      return state.activeRegistry
    },
    getRegistryList: (state) => { //does not fetch, just gets data
      return state.registryList
    },
    activeRegistry: (state) => {
      return state.registryList.find(r => r.id == state.activeRegistryId)
    }
  }
})
