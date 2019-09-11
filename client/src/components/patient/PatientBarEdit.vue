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
               <v-flex xs5>
                  <v-text-field
                        label="Last Name" type="text" required :rules="[() => !!pt.lastName || 'This field is required']"
                        prepend-icon="mdi-account"
                        v-model="pt.lastName" autofocus>
                  </v-text-field>
               </v-flex>
               <v-flex xs5 class="px-2">
                  <v-text-field
                        label="First Name" type="text" required :rules="[() => !!pt.firstName || 'This field is required']"
                        prepend-icon="mdi-account"
                        v-model="pt.firstName">
                  </v-text-field>
               </v-flex>
               <v-flex xs2 class="px-2">
                  <v-select
                     :items="['M','F']"
                     v-model="pt.gender"
                     required :rules="[() => !!pt.gender || 'This field is required']"
                     label="Gender"
                  ></v-select>
               </v-flex>
               <v-flex xs5>
                  <v-text-field
                        label="MRN" type="text"
                        prepend-icon="mdi-laptop"
                        v-model="pt.mrn">
                  </v-text-field>
               </v-flex>
               <v-flex xs7 class="px-2">
                  <v-text-field
                        v-model="pt.dob" label="Date of Birth (YYYY-MM-DD)"
                        prepend-icon="mdi-calendar"
                        required v-mask="'####-##-##'"
                        :rules="[() => !!pt.dob || 'This field is required']"
                     ></v-text-field>
               </v-flex>
               <v-flex xs12 class="px-2">
                  <v-checkbox
                     v-model="deceased"
                     label="Deceased?"
                  ></v-checkbox>
               </v-flex>
               <v-flex xs6 v-if="deceased">
                        <v-combobox
                           v-model="pt.causeOfDeath"
                           label="Cause of Death (select or type in)"
                           :items="causesOfDeath"
                        ></v-combobox>
               </v-flex>
               <v-flex xs6 v-if="deceased">
                  <v-text-field
                        v-model="pt.deceasedDate" label="Date Deceased"
                        prepend-icon="mdi-calendar"
                        v-mask="'####-##-##'" class="ml-2"
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
import { mapState, mapMutations } from 'vuex'
import RegistryService from '@/services/RegistryService'

export default {
   data() {
      return {
         defaultPt: {
            firstName: '',
            lastName: '',
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
      ...mapMutations({
          showError: 'messaging/showError',
          showSuccess: 'messaging/showSuccess'
      }),
      initialize() {
         if (this.patientP) {
            Object.assign(this.pt, this.patientP)
            if (this.pt.deceasedDate) this.deceased = true
         } else {
            this.pt = Object.assign({}, this.defaultPt)
            this.pt.registry = this.activeRegistry
         }
      },
      async save() {
         if (!this.$refs.ptForm.validate()) return null
         this.pt.user = this.$store.state.user
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
            this.$store.dispatch('registryCount', {registryId: this.activeRegistry.id, increment:1})
            RegistryService.addPatient(this.pt)
               .then(async reply =>  {
                  this.$store.dispatch('loadPatient', reply.id) //update home object
                  this.$router.push({name:'patient', params:{id: reply.id}})
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
