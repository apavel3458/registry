
export default {
  namespaced: true,
  state: {
    message: '',
    type: ''
  },
  mutations: {
    showError (state, message) {
      state.type = 'error'
      state.message = message
    },
    showSuccess (state, message) {
      state.type = 'success'
      state.message = message
    },
    showInfo (state, message) {
      state.type = 'info'
      state.message = message
    },
    reset (state) {
      state.message = ''
    }
  },
  actions: { },
  getters: {  }
}