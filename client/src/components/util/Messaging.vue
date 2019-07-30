<template>
   <div>
   <v-snackbar
        v-model="snackbar"
        :color="type"
        top
        :timeout="timer">
        {{ message }}
        <v-btn dark flat
          @click="snackbar = false">
          Close
        </v-btn>
  </v-snackbar>
   </div>
</template>

<script>
export default {
   data () {
      return {
         snackbar: false,
         type: '',
         message: '',
         timer: 4000
      }
   },
   watch: {
      snackbar: function (trigger) {
         if (!trigger) this.$store.commit('messaging/reset')
      }
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
      }
   },
   created: function () {
      this.$store.watch(state => state.messaging.message, (message) => {
         if (message && message !== '') {
               this.message = message
               this.type = this.$store.state.messaging.type
               this.setTimer()
               this.snackbar = true
         }
         
      })
   }
}
</script>