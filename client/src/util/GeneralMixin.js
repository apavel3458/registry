import { mapMutations } from 'vuex'

var generalMixin = {
  created: function () {},
  methods: {
    ...mapMutations({
      showErrorVuex: 'messaging/showError',
      showSuccessVuex: 'messaging/showSuccess',
    }),
    getErrorMessage: function (err) {
      // eslint-disable-next-line no-console
      //console.log(JSON.stringify(err))
      if (!err) {
        return 'An unknown error has occured'
      }
      if (err.data) {
        err = err.data
      }
      if (err.error) {
        return err.error
      } else if (err && err.response && err.response.status == 400) {
        return err.response.data.error
      } else if (err && err.response && err.response.status == 500) {
        return 'Server Error: ' + err.response.data.error
      } else {
        return 'Unknown Error: ' + err
      }
    },
    showError: function (err) {
      this.showErrorVuex(this.getErrorMessage(err))
    },
    showErrorMessage: function (errMsg) {
      this.showErrorVuex(errMsg)
    },
    showSuccess: function (msg) {
      this.showSuccessVuex(msg)
    },
  },
}

export default generalMixin
