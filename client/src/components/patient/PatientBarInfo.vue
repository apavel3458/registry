<template>
<div>

   <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{patient.lastName}}, {{patient.firstName}}</v-list-item-title>
              <v-list-item-subtitle>Name</v-list-item-subtitle>
            </v-list-item-content>

            <!-- <v-list-item-action>
              <v-icon>chat</v-icon>
            </v-list-item-action> -->
          </v-list-item>

          <v-list-item>

            <v-list-item-content>
              <v-list-item-title>{{patient.mrn}}</v-list-item-title>
              <v-list-item-subtitle>Medical Record Number</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

         <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{patient.dob}} (Age {{age(patient.dob)}})</v-list-item-title>
              <v-list-item-subtitle>Date of Birth</v-list-item-subtitle>
            </v-list-item-content>
         </v-list-item>

         <v-list-item v-if="patient.causeOfDeath" class="">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold red--text">DECEASED: {{patient.causeOfDeath}} </v-list-item-title>
              <v-list-item-subtitle class="font-weight-bold red--text"> {{patient.deceasedDate}} (Age {{age(patient.dob, patient.deceasedDate)}})</v-list-item-subtitle>
            </v-list-item-content>
         </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item class="grey lighten-3">
            <v-list-item-content>
              <v-list-item-title>{{patient.createdAt}}</v-list-item-title>
              <v-list-item-subtitle>Date Created</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

         <v-list-item  class="grey lighten-3">
            <v-list-item-content>
              <v-list-item-title>{{patient.createdBy}}</v-list-item-title>
              <v-list-item-subtitle>Created By</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>


</div>
</template>

<script>
import PatientMixin from '@/util/PatientMixin'
import { mapState } from 'vuex'

export default {
   data() {
      return {
      }
   },
   mixins: [PatientMixin],
   computed: {
     ...mapState({
         patient: 'activePatient'
      })
   },
   watch: {
   },
   methods: {

    },
    mounted() {
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.deceased {
   color: red;
}
</style>
