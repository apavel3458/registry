import {mapMutations} from 'vuex'

var generalMixin = {
   created: function () {
   },
   methods: {
      ...mapMutations({
         showErrorMsg: 'messaging/showError',
         showSuccessMsg: 'messaging/showSuccess'
     }),
      processError: function (err) {
         // eslint-disable-next-line no-console
         console.log(JSON.stringify(err))
         alert("test")
         if (!err) {
            return "An unknown error has occured"
         } else if (err.error) {
            return err.error
         } else if (err && err.response && err.response.status == 400) {
            return err.response.data.error
         } else {
            return "Server Error: " + err.response.data.error
         }
     },
     showError: function(err) {
        this.showErrorMsg(this.processError(err))
     },
     showErrorMessage: function(errMsg) {
      this.showErrorMsg(errMsg)
     },
     showSuccess: function(msg) {
         this.showSuccessMsg(msg)
      }
   }
 }

 export default generalMixin