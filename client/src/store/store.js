import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'
import actions from './actions'
import messaging from "./messaging"


Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  //plugins: [createPersistedState()],
  modules: {
    messaging
  },
  state: {
    token: null,
    user: null,
    registryList: [], //may not need to store list
    activeRegistry: null,
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
  actions,
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
    getRegistryList: (state) => { //does not fetch, just gets data
      return state.registryList
    }
  }
})
