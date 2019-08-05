<template>
   <div>
   <v-snackbar
        v-model="snackbar"
        :color="type"
        top
        :timeout="timer">
        {{ message }}
        <v-btn dark text
          @click="snackbar = false">
          Close
        </v-btn>
  </v-snackbar>
   </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
   data () {
      return {
         snackbar: false,
         //message: '',
         timer: 4000
      }
   },
   watch: {
      snackbar: function (trigger) {
         if (!trigger) this.$store.commit('messaging/reset')
      }
   },
   computed: {
      ...mapState ({
         message: state => state.messaging.message,
         type: state => state.messaging.type
      })
   },
   methods: {
      setTimer() {
         switch(this.type) {
            case "success":
               this.timer = 2000;
               break;
            case "error":
               this.timer = 4000;
               break;
            case "info":
               this.timer = 3000;
               break;
         }
      },
      showMessage() {
         if (this.message && this.message !== '') {
               this.setTimer()
               this.snackbar = true
         }
      }
   },
   mounted: function () {
      this.$store.watch(state => state.messaging.message, () => {
         this.showMessage()
      })
      
      if (this.message != null) {
         this.showMessage()
      }
   }
}
</script>