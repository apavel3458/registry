/* eslint-disable vue/valid-template-root */
<template>
<div>

      <v-toolbar dark color="purple lighten-1" dense>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Select Patient</v-toolbar-title>
      <v-spacer></v-spacer>
      </v-toolbar>
      
      <v-layout>
      <v-flex xs12 mt-0>
         <v-data-table
            :headers="headers"
            :items="patients"
            :pagination.sync="pagination"
            :total-items="totalpatients"
            :loading="loading"
            no-data-text="No patients in this registry"
            class="dataTable elevation-3"
         >
            <template v-slot:items="props">
               <tr @click="$router.push({name:'patient', params:{registryId: $store.state.activeRegistry.id, patientId: props.item.id}})" class="row" :key="props.index">
               <td class="text-xs-left">{{ props.item.lastName }}, {{ props.item.firstName }}</td>
               <td class="text-xs-center">{{ props.item.mrn }}</td>
               <td class="text-xs-center">{{props.item.dob}} Age: ({{ age(props.item.dob) }})</td>
               <td class="text-xs-center">{{ formatDate(props.item.createdAt) }}</td>
               </tr>
            </template>
         </v-data-table>
        <v-btn dark fab small bottom right color="green lighten-2" 
                  @click="editPatientDialog=true">
                  <v-icon>add</v-icon>
        </v-btn>
        <patient-bar-edit :editPatientDialogP="editPatientDialog" v-on:reset="editPatientDialog=false"></patient-bar-edit>

      </v-flex>
      </v-layout>
    <!-- <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div> -->



</div>
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
        loading: true,
        pagination: {sortBy: 'createdAt', descending: true},
        headers: [
          { text: 'Name', align: 'left', sortable: true, value: 'lastName'},
          { text: 'MRN', align: 'center', value: 'mrn' },
          { text: 'Age', align: 'center', value: 'dob'},
          { text: 'Date Created', align: 'center', value: 'createdAt'},
        ],
        editPatientDialog: false
      }
    },
    watch: {
      pagination: {
        handler () {
          this.getDataFromApi()
            .then(data => {
              this.patients = data.items
              this.totalpatients = data.total
            })
        },
        deep: true
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
      async getDataFromApi () {
        this.loading = true
        return new Promise(async (resolve) => {
          const { sortBy, descending, page, rowsPerPage } = this.pagination
          let reply = await RegistryService.patientGetPage(this.registry.id, page, rowsPerPage, sortBy, descending)
          const total = reply.total
          let items = reply.results

          // if (this.pagination.sortBy) {
          //   items = items.sort((a, b) => {
          //     const sortA = a[sortBy]
          //     const sortB = b[sortBy]

          //     if (descending) {
          //       if (sortA < sortB) return 1
          //       if (sortA > sortB) return -1
          //       return 0
          //     } else {
          //       if (sortA < sortB) return -1
          //       if (sortA > sortB) return 1
          //       return 0
          //     }
          //   })
          // }

          /*if (rowsPerPage > 0) {
            items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
          }*/

            this.loading = false
            resolve({
              items,
              total
            })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.row td {
   cursor: pointer;
}
.dataTable {
   font-size: 15px !important;
}
table.v-table thead tr th {
  font-size: 16px;
}
table.v-table tbody tr td {
  font-size: 16px;
}
</style>
