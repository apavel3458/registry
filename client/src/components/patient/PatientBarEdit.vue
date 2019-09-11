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
               <v-flex xs6>
                  <v-text-field
                        label="First Name" type="text" required :rules="[() => !!pt.firstName || 'This field is required']"
                        prepend-icon="mdi-account"
                        v-model="pt.firstName" autofocus>
                  </v-text-field>
               </v-flex>
               <v-flex xs6 class="px-2">
                  <v-text-field
                        label="Last Name" type="text" required :rules="[() => !!pt.lastName || 'This field is required']"
                        prepend-icon="mdi-account"
                        v-model="pt.lastName">
                  </v-text-field>
               </v-flex>
               <v-flex xs6>
                  <v-text-field
                        label="MRN" type="text"
                        prepend-icon="mdi-laptop"
                        v-model="pt.mrn">
                  </v-text-field>
               </v-flex>
               <v-flex xs6 class="px-2">
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
import { mapState } from 'vuex'
import RegistryService from '@/services/RegistryService'

export default {
   data() {
      return {
         defaultPt: {
            firstName: '',
            lastName: '',
            mrn: '',
            dob: '',
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
         activeRegistry: 'activeRegistry'
      })
   },
   methods: {
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
         let reply = null
         if (this.patientP) { //editing
            reply = await RegistryService.updatePatient(this.pt)
         } else {
            this.$store.dispatch('registryCount', {registryId: this.activeRegistry.id, increment:1})
            reply = await RegistryService.addPatient(this.pt)
         }
         if (reply.error) {
               alert(reply.error)
         } else if (reply.message) {
               alert(reply.message)
         }
         this.editPatientDialog = false
         this.$store.dispatch('setActivePatient', reply) //update home object
         this.$router.push({name:'patient', params:{id: reply.id}})
         
         
      }
   },
   mounted() {
   }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
