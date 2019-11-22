<template>

<v-dialog
   v-model="editPatientDialog"
   max-width="590">
   <v-card>
      <v-card-title class="headline">Register Patient</v-card-title>

      <v-card-text class="px-5">
         <v-form ref="ptForm">
         <v-layout row wrap>
            
               <v-flex xs12>
                     <v-select
                        :items="registryList" return-object
                        label="Registry" prepend-icon="mdi-database"
                        item-text="registryName" disabled
                        v-model="pt.registry" style="width: 50%">
                     </v-select>
               </v-flex>
               <v-flex xs4>
                  <v-text-field
                        label="Last Name" type="text" required :rules="[() => !!pt.lastName || 'This field is required']"
                        prepend-icon="mdi-account"
                        v-model="pt.lastName" autofocus>
                  </v-text-field>
               </v-flex>
               <v-flex xs4 class="px-2">
                  <v-text-field
                        label="First Name" type="text" required :rules="[() => !!pt.firstName || 'This field is required']"
                        prepend-icon="mdi-account"
                        v-model="pt.firstName">
                  </v-text-field>
               </v-flex>
               <v-flex xs4>
                  <v-text-field
                        label="Middle Name (Optional)" type="text"
                        prepend-icon="mdi-account"
                        v-model="pt.middleName" autofocus>
                  </v-text-field>
               </v-flex>
         </v-layout>
         <v-layout row wrap>
               <v-flex xs4>
                  <v-text-field
                        v-model="pt.dob" label="Date of Birth (YYYY-MM-DD)"
                        prepend-icon="mdi-calendar"
                        required v-mask="'####-##-##'"
                        :rules="[() => !!pt.dob || 'This field is required']"
                     ></v-text-field>
               </v-flex>
               <v-flex xs3 class="px-2">
                  <v-select
                     :items="['M','F','O']"
                     v-model="pt.gender"
                     prepend-icon="mdi-gender-male-female"
                     required :rules="[() => !!pt.gender || 'Required']"
                     label="Gender"
                  ></v-select>
               </v-flex>
         </v-layout>
         <v-layout row wrap>
               <v-flex xs4>
                  <v-text-field
                        label="MRN" type="text"
                        prepend-icon="mdi-laptop"
                        required :rules="[() => !!pt.mrn || 'Required']"
                        v-model="pt.mrn">
                  </v-text-field>
               </v-flex>
               <v-flex xs4 class="px-2">
                  <v-text-field
                        label="Study ID (optional)" type="text"
                        prepend-icon="mdi-view-list"
                        v-model="pt.studyId">
                  </v-text-field>
               </v-flex>
         </v-layout>
         <v-layout>
               
               <v-flex xs4 class="px-2">
                  <v-checkbox
                     v-model="deceased"
                     label="Deceased?"
                  ></v-checkbox>
               </v-flex>
               <v-flex xs8 pt-8>
                  <v-divider></v-divider>
               </v-flex>
         </v-layout>
         <v-layout v-if="deceased">
               <v-flex xs6>
                        <v-combobox
                           v-model="pt.causeOfDeath"
                           label="Cause of Death (select or type in)"
                           :items="causesOfDeath"
                        ></v-combobox>
               </v-flex>
               
               <v-flex xs6>
                  <v-text-field
                        v-model="pt.deceasedDate" label="Date Deceased (YYYY-MM-DD)"
                        prepend-icon="mdi-calendar"
                        v-mask="'####-##-##'" class="ml-2"
                        required :rules="[() => !!pt.deceasedDate || 'Required']"
                  ></v-text-field>
               </v-flex>
         </v-layout>
         </v-form>
      </v-card-text>

      <v-card-actions>
         <v-spacer></v-spacer>

         <v-btn
            color="green darken-1"
            text
            @click="editPatientDialog = false">
            Cancel
         </v-btn>

         <v-btn
            color="green darken-1"
            text
            @click="save()">
            Save Patient
         </v-btn>
      </v-card-actions>
   </v-card>

</v-dialog>

</template>

<script>
import { mapState } from 'vuex'
import RegistryService from '@/services/RegistryService'
import GeneralMixin from '@/util/GeneralMixin'
import _ from 'lodash'

export default {
   mixins: [GeneralMixin],
   data() {
      return {
         defaultPt: {
            firstName: '',
            middleName: '',
            lastName: '',
            studyId: '',
            mrn: '',
            dob: '',
            gender: '',
            deceasedDate: undefined,
            causeOfDeath: undefined
         },
         pt: {},
         deceased: false,
         registrySelected: null,
         editPatientDialog: false,
         causesOfDeath: ['Arrhythmia', 'Heart Failure', 'Malignancy', "Other", "Unknown"]
      }
   },
   props: {
      patientP: {
         type: Object,
         default: null
      },
      editPatientDialogP: {
         type: Boolean,
         default: false
      }
   },
   watch: {
      editPatientDialogP(val) {
         val && (this.editPatientDialog = val) && (this.initialize())
      },
      editPatientDialog(val) {
         !val && this.$emit('reset')
      }
   },
   computed: {
      ...mapState ({
         registryList: 'registryList',
         activeRegistry: 'activeRegistry',
         patient: 'activePatient'
      })
   },
   methods: {
      initialize() {
         if (this.patientP) {
            Object.assign(this.pt, _.pick(this.patientP, ['id', ...Object.keys(this.defaultPt)]))
            this.deceased = !!this.pt.deceasedDate
         } else {
            this.pt = Object.assign({}, this.defaultPt)
            this.pt.registry = this.activeRegistry
            this.deceased = false
         }
      },
      async save() {
         if (!this.$refs.ptForm.validate()) return null
         if (this.patientP) { //editing
            RegistryService.updatePatient(this.pt)
               .then(async reply => {
                  let updatedPatient = Object.assign({}, this.patient)
                  Object.assign(updatedPatient, reply)
                  this.$store.dispatch('setActivePatient', updatedPatient) //update home object
                  this.showSuccess("Successfully updated patient")
                  this.editPatientDialog = false
               })
         } else {
            RegistryService.addPatient(this.pt)
               .then(reply =>  {
                  this.$store.dispatch('registryCount', {registryId: this.activeRegistry.id, increment:1})
                  //this.$store.dispatch('loadPatient', reply.id) //update home object
                  this.$router.push({name:'patient', params:{patientId: reply.id}})
                  this.showSuccess("Successfully added new patient")
                  this.editPatientDialog = false
               }).catch(err => {
                  this.showError(err)
               })
         }

         
      }
   },
   mounted() {
   }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
