/* eslint-disable vue/valid-template-root */
<template>
<v-card class="elevation-3 pb-0">

      <v-toolbar dark color="purple lighten-1" dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Select Patient</v-toolbar-title>
      <v-spacer></v-spacer>
      </v-toolbar>
      
      <v-layout>
      <v-flex xs12 mt-0>
         <v-data-table 
            :headers="headers"
            :items="patients"
            :options.sync="options"
            :server-items-length="totalpatients"
            :loading="loading"
            must-sort
            no-data-text="No patients in this registry"
            class="dataTable"
            @click:row="open($event)"
         >
            <template v-slot:item.dob="{item, header, value}">
              {{item.dob}} Age: ({{ age(item.dob) }})
            </template>
            <template v-slot:item.lastName="{item, header, value}">
              {{item.lastName}}, {{item.firstName}}
            </template>
         </v-data-table>
        <div class="text-center">
          <v-btn dark fab small absolute class="mt-n4" color="green lighten-2" 
                    @click="editPatientDialog=true">
                    <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <patient-bar-edit :editPatientDialogP="editPatientDialog" v-on:reset="editPatientDialog=false"></patient-bar-edit>

      </v-flex>
      </v-layout>
    <!-- <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div> -->



</v-card>
</template>

<script>
import { mapState } from 'vuex'
import RegistryService from '@/services/RegistryService'
import PatientMixin from '@/util/PatientMixin'
import PatientBarEdit from '@/components/patient/PatientBarEdit'

export default {
   mixins: [PatientMixin],
   components: {PatientBarEdit},
   data () {
      return {
        totalpatients: 0,
        patients: [],
        sortBy: ['createdAt'],
        sortDesc: true,
        loading: true,
        options: {sortBy: ['createdAt'], sortDesc: [true]},
        headers: [
          { text: 'Name', align: 'left', sortable: true, value: 'lastName'},
          { text: 'MRN', align: 'center', value: 'mrn' },
          { text: 'Age', align: 'center', value: 'dob'},
          { text: 'Date Created', align: 'center', value: 'createdAt'},
        ],
        editPatientDialog: false,
        
      }
    },
    watch: {
      options: {
        handler () {
          this.initialize()
        },
        deep: true
      },
      registry: function() {
          this.initialize()
      }
    },
    mounted () {
    },
    computed: {
      ...mapState({
        registry: 'activeRegistry'
      })
    },
    methods: {
      async initialize() {
          this.getDataFromApi()
            .then(data => {
                this.patients = data.items
                this.totalpatients = data.total
              })
      },
      async getDataFromApi () {
        
        this.loading = true
        return new Promise(async (resolve) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options
          let reply = await RegistryService.patientGetPage(this.registry.id, page, itemsPerPage, sortBy[0], sortDesc[0])
          const total = reply.total
          let items = reply.results

            this.loading = false
            resolve({
              items,
              total
            })
        })
      },
      open(item) {
        this.$router.push(
          {
            name:'patient', 
            params:{patientId: item.id}}
          )
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.dataTable {
  ::v-deep tr {
  cursor: pointer;
 }
}
.clearBackground {
  background-color:transparent;
}
</style>