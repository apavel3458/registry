<template>
   <div>
        <v-card class="">
            <v-toolbar color="blue" dark dense>
                  <v-toolbar-title>Search Patient</v-toolbar-title>
                  <v-btn
                  absolute dark small fab right color="green lighten-1" style="right: -.5em"
                  @click="newPatient()">
                     <v-icon>add</v-icon>
                  </v-btn>
                  
                  <v-spacer></v-spacer>
                  
            </v-toolbar>
            <v-select
               v-model="selectedRegistry" :items="registryList" item-text="registryName"
               return-object label="Registry" prepend-icon="recent_actors"
               class="mr-1 ml-1 mt-3 mb-0 pt-0 pb-0 pl-2 pr-2">
               <template v-slot:item="{ item }">
                     <v-list-tile-content>
                        <v-list-tile-title>{{item.registryName}} ({{item.registrySize}})</v-list-tile-title>
                     </v-list-tile-content>
               </template>
               <template v-slot:selection="{ item }">
                     <v-list-tile-content>
                        <v-list-tile-title>{{item.registryName}} ({{item.registrySize}})</v-list-tile-title>
                     </v-list-tile-content>
               </template>
            </v-select>


            <v-autocomplete
                  v-model="searchSelected"
                  :items="searchResults"
                  :search-input.sync="searchText"
                  :loading="isLoading"
                  prepend-icon="search"
                  label="Search Name or PIN"
                  placeholder="Start typing..."
                  flat clearable
                  item-text="firstName"
                  item-value="id"
                  no-filter
                  class="mx-1 my-0 px-2 py-0">

                  <template v-slot:no-data>
                  <v-list-tile>
                     <v-list-tile-title>
                        No results yet...
                     </v-list-tile-title>
                  </v-list-tile>
                  </template>

                  <template v-slot:item="{ item }">
                     <v-list-tile-content>
                        <v-list-tile-title>{{item.lastName}}, {{item.firstName}}</v-list-tile-title>
                        <v-list-tile-sub-title>DOB: {{item.dob}} (Age {{age(item.dob)}})</v-list-tile-sub-title>
                     </v-list-tile-content>
                  </template>

            </v-autocomplete>



               <patient-bar-edit 
                     :editPatientDialogP="editPatientDialog"
                     v-on:reset="editPatientDialog = false"
                     :patientP="editPatientObj"></patient-bar-edit>
            
       </v-card>

      <v-card class="mt-2" v-if="patient">
         <v-toolbar color="blue" dark dense>
            <v-toolbar-title>Demographics</v-toolbar-title>
            <v-spacer></v-spacer>
         </v-toolbar>
         <patient-bar-info v-if="patient"></patient-bar-info>
         <v-btn absolute dark fab bottom small right 
            color="blue lighten-2" @click="editPatient(patient)">
            <v-icon>edit</v-icon>
         </v-btn>
         <v-btn absolute dark fab bottom small right color="red lighten-2" style="right:5em"
            @click="deletePatient(patient)">
            <v-icon>delete</v-icon>
         </v-btn>
      </v-card>

      <error-handling :error.sync="error" :message.sync="message"></error-handling>


   </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import PatientMixin from '@/util/PatientMixin'
import ErrorHandling from '@/components/globals/ErrorHandling'
import RegistryService from '@/services/RegistryService'


export default {
   components: {
      'PatientBarEdit': () => import('./PatientBarEdit'),
      'PatientBarInfo': () => import('./PatientBarInfo'),
      ErrorHandling
      },
   mixins: [PatientMixin],
   data() {
      return {
         searchText: '',
         searchResults: [],
         searchSelected: null,
         registryList: [{
            registryName: "NOT DEFINED"
         }],
         error: null,
         message: null,
         select: null,
         isLoading: false,
         selectedRegistry: null,
         editPatientDialog: false,
         editPatientObj: null
      }
   },
   watch: {
      searchText(val) {
         if (val && val != '') {
            this.isLoading = true
            this.search(val)
         } else {
            this.isLoading = false
         }
      },
      searchSelected(val) {
         val && val != '' && this.$store.dispatch('loadPatient', val)
         //val && val != '' && this.$store.dispatch('setActivePatient', val) //do this in patient component
      },
      selectedRegistry(val) {
         if (val != this.registry && this.$store.state.activeRegistry != val) {
            this.$store.dispatch('setActiveRegistry', val)
         }
      },
      '$store.state.activeRegistry': {
         handler (newRegistry) {
            if (newRegistry != null) this.selectedRegistry = this.$store.state.activeRegistry
         }
      }

   },
   computed: {
      ...mapState({
         patient: 'activePatient',
         registry: 'activeRegistry'
      })
   },
   methods: {
        search: _.debounce(async function () {
            const reply = await RegistryService.patientSearch(this.registry.id,this.searchText)
            if (Array.isArray(reply)) {
               this.searchResults = reply
            } else {
               this.searchResults = []
            }
            //alert(JSON.stringify(this.searchResults))
            
            this.isLoading = false
         }, 700),

        async deletePatient(p) {
           if(confirm(`Are you sure you want to delete ${p.firstName} ${p.lastName}?`) &&
              confirm(`Warning!  All the data related to this patient will be deleted.  This action cannot be undone.`)) {
               const reply = await RegistryService.deletePatient(p)
               if (reply.error) this.error = reply.error
               else {
                  this.$router.push({name:'home'})
                  this.$store.dispatch('registryCount', {registryId: p.registry.id, increment: -1})
               }
            }
        },
        newPatient() {
           this.editPatientObj = null
           this.editPatientDialog = true
        },
        editPatient(pt) {
           this.editPatientObj = pt
           this.editPatientDialog = true
        }

    },
    async mounted() {
       this.registryList = this.$store.state.registryList
       this.selectedRegistry = this.registry
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style="stylus">
.centered-input input {
  text-align: center
}

</style>
