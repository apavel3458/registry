<template>
<div>

   <v-list two-line>
          <v-list-tile>

            <v-list-tile-content>
              <v-list-tile-title>{{patient.lastName}}, {{patient.firstName}}</v-list-tile-title>
              <v-list-tile-sub-title>Name</v-list-tile-sub-title>
            </v-list-tile-content>

            <!-- <v-list-tile-action>
              <v-icon>chat</v-icon>
            </v-list-tile-action> -->
          </v-list-tile>

          <v-list-tile>

            <v-list-tile-content>
              <v-list-tile-title>{{patient.mrn}}</v-list-tile-title>
              <v-list-tile-sub-title>Medical Record Number</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

         <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{patient.dob}} (Age {{age(patient.dob)}})</v-list-tile-title>
              <v-list-tile-sub-title>Date of Birth</v-list-tile-sub-title>
            </v-list-tile-content>
         </v-list-tile>

         <v-list-tile v-if="patient.causeOfDeath" class="">
            <v-list-tile-content>
              <v-list-tile-title class="font-weight-bold red--text">DECEASED: {{patient.causeOfDeath}} </v-list-tile-title>
              <v-list-tile-sub-title class="font-weight-bold red--text"> {{patient.deceasedDate}} (Age {{age(patient.dob, patient.deceasedDate)}})</v-list-tile-sub-title>
            </v-list-tile-content>
         </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile class="grey lighten-3">
            <v-list-tile-content>
              <v-list-tile-title>{{patient.createdAt}}</v-list-tile-title>
              <v-list-tile-sub-title>Date Created</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

         <v-list-tile  class="grey lighten-3">
            <v-list-tile-content>
              <v-list-tile-title>{{patient.createdBy}}</v-list-tile-title>
              <v-list-tile-sub-title>Created By</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
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
