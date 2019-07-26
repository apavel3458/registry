<template>
   <div>
      <v-bottom-sheet inset v-model="openError">
         <v-card>
            <v-card-title primary-title>
               <div>
                  <h3 class="headline mb-0 red--text">{{error}}</h3>
                  <div> {{ details }} </div>
               </div>
            </v-card-title>
         </v-card>
      </v-bottom-sheet>
      <v-bottom-sheet inset v-model="openMessage">
         <v-card>
            <v-card-title primary-title>
               <div>
                  <h3 class="headline mb-0">{{error}}</h3>
                  <div> {{ details }} </div>
               </div>
            </v-card-title>
         </v-card>
      </v-bottom-sheet>

      <v-snackbar
         v-model="openSnackbar"
         bottom
         :timeout="6000"
      >
         {{ snack }}
         <v-btn
         color="pink"
         flat
         @click="openSnackbar = false"
         >
         Close
         </v-btn>
    </v-snackbar>
   </div>
</template>

<script>
export default {
    data() {
        return {
           openError: false,
           openMessage: false,
           openSnackbar: false
        }
    },
    props: {
       error: {
          type: String
       },
       message: {
          type: String
       },
       details: {
          type: String,
          default: ''
       },
       snack: {
          type: String
       }
    },
    watch: {
       error(val) {
          if (val && val != '') {
             this.openError = true
          }
       },
       message(val) {
          if (val && val != '') {
             this.openMessage = true
          }
       },
       snack(val) {
          if (val && val != '') {
             this.openSnackbar = true
          }
       },
       openError(val) {
          if (val == false) { //closing
            this.$emit('update:error', null)
          }
       },
       openMessage(val) {
          if (val == false) { //closing
            this.$emit('update:message', null)
          }
       },
       openSnackbar(val) {
          if (val == false) {
             this.$emit('update:snack', null)
          }
       }
    },
    methods: {
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
