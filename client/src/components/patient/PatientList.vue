/* eslint-disable vue/valid-template-root */
<template>
<v-card class="elevation-3 pb-0">

      <v-toolbar dark color="purple lighten-1" dense>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          <v-toolbar-title>Select Patient</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="navigation=null">
                    <v-icon>mdi-format-list-bulleted-square</v-icon>
              </v-btn>
            </template>
            <span>Back to Patient List</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.getters.isAdmin">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="navigation='upload'">
                  <v-icon>mdi-upload</v-icon>
                </v-btn>
              </template>
              <span>Upload Data</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$store.getters.isAdmin">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="navigation='download'">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
              <span>Download Data</span>
          </v-tooltip>
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-if="$store.getters.isAdmin"
                @click="navigation='upload'"
              >
                <v-list-item-title>Upload Data</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
      </v-toolbar>
      
      <v-layout>
      <v-flex xs12 mt-0>
        <template v-if="navigation=='upload'">
          <upload-data></upload-data>
        </template>
        <template v-if="navigation=='download'">
          <download-data></download-data>
        </template>
        <template v-else>
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
                {{item.lastName}}, {{item.firstName}} {{item.middleName}}
              </template>
          </v-data-table>
          <div class="text-center">
            <v-btn dark fab small absolute class="mt-n4" color="green lighten-2" 
                      @click="editPatientDialog=true">
                      <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <patient-bar-edit :editPatientDialogP="editPatientDialog" v-on:reset="editPatientDialog=false"></patient-bar-edit>
        </template>
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
const UploadData = () => import('./import/UploadData')
const DownloadData = () => import('./import/DownloadData')

export default {
   mixins: [PatientMixin],
   components: {PatientBarEdit, UploadData, DownloadData},
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
        navigation: null
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