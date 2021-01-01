<template>
  <div>
    <v-card class="">
      <v-toolbar color="blue" dark dense>
        <v-toolbar-title>Search Patient</v-toolbar-title>
        <v-btn
          absolute
          dark
          small
          fab
          right
          color="green lighten-1"
          style="right: -0.5em"
          @click="newPatient()"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
      </v-toolbar>
      <v-select
        v-model="selectedRegistry"
        :items="registryList"
        item-text="registryName"
        @focus="$router.push({ name: 'registryselect' })"
        height="25"
        return-object
        label="Registry"
        prepend-icon="mdi-database-refresh"
        class="mr-1 ml-1 mb-0 pt-5 pb-0 pl-1 pr-2"
      >
        <template v-slot:prepend="">
          <v-icon class="mt-n2">mdi-database-refresh</v-icon>
        </template>
        <template v-slot:item="{ item }">
          {{ item.registryName }} ({{ item.registrySize }})
        </template>
        <template v-slot:selection="{ item }">
          {{ item.registryName }} ({{ item.registrySize }})
        </template>
      </v-select>

      <v-autocomplete
        v-model="searchSelected"
        :items="searchResults"
        :search-input.sync="searchText"
        :loading="isLoading"
        prepend-icon="mdi-magnify"
        label="Search Name or PIN"
        placeholder="Start typing..."
        flat
        clearable
        item-text="lastName"
        item-value="id"
        no-filter
        class="mx-1 my-0 pl-1 pr-2 py-0"
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>No results yet...</v-list-item-title>
          </v-list-item>
        </template>

        <template v-slot:item="{ item }">
          <v-list-item-content class="text-left pa-0 ma-0">
            <v-list-item-title>
              {{ item.lastName }}, {{ item.firstName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              DOB: {{ item.dob }} (Age {{ age(item.dob) }})
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-autocomplete>

      <patient-bar-edit
        :editPatientDialogP="editPatientDialog"
        v-on:reset="editPatientDialog = false"
        :patientP="editPatientObj"
      ></patient-bar-edit>
    </v-card>

    <v-card class="mt-2" v-if="patient">
      <v-toolbar color="blue" dark dense>
        <v-toolbar-title>Demographics</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <patient-bar-info v-if="patient"></patient-bar-info>
      <v-btn
        absolute
        dark
        fab
        bottom
        small
        right
        color="blue lighten-2"
        @click="editPatient(patient)"
      >
        <v-icon>mdi-account-edit</v-icon>
      </v-btn>
      <v-btn
        absolute
        dark
        fab
        bottom
        small
        right
        color="red lighten-2"
        style="right: 5em"
        @click="deletePatient(patient)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import PatientMixin from '@/util/PatientMixin'
import RegistryService from '@/services/RegistryService'

export default {
  components: {
    PatientBarEdit: () => import('./PatientBarEdit'),
    PatientBarInfo: () => import('./PatientBarInfo'),
  },
  mixins: [PatientMixin],
  data() {
    return {
      searchText: '',
      searchResults: [],
      searchSelected: null,
      registryList: [
        {
          registryName: 'NOT DEFINED',
        },
      ],
      error: null,
      message: null,
      select: null,
      isLoading: false,
      selectedRegistry: null,
      editPatientDialog: false,
      editPatientObj: null,
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
      handler(newRegistry) {
        if (newRegistry != null)
          this.selectedRegistry = this.$store.state.activeRegistry
      },
    },
  },
  computed: {
    ...mapState({
      patient: 'activePatient',
      registry: 'activeRegistry',
    }),
  },
  methods: {
    search: _.debounce(async function () {
      const reply = await RegistryService.patientSearch(
        this.registry.id,
        this.searchText
      )
      if (Array.isArray(reply)) {
        this.searchResults = reply
      } else {
        this.searchResults = []
      }
      //alert(JSON.stringify(this.searchResults))

      this.isLoading = false
    }, 700),

    async deletePatient(p) {
      if (
        confirm(
          `Are you sure you want to delete ${p.firstName} ${p.lastName}?`
        ) &&
        confirm(
          `Warning!  All the data related to this patient will be deleted.  This action cannot be undone.`
        )
      ) {
        const reply = await RegistryService.deletePatient(p)
        if (reply.error) this.error = reply.error
        else {
          this.$router.push({ name: 'home' })
          this.$store.dispatch('registryCount', {
            registryId: p.registry.id,
            increment: -1,
          })
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
    },
  },
  async mounted() {
    this.registryList = this.$store.state.registryList
    this.selectedRegistry = this.registry
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style="css">
.centered-input input {
  text-align: center;
}
</style>
