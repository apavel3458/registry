<template>

<v-dialog
   v-model="editPatientDialog"
   max-width="590">
   <v-card>
      <v-card-title class="headline">Register Patient</v-card-title>

      <v-card-text>
         <v-form ref="ptForm">
         <v-layout row wrap>
            
               <v-flex xs12>
                     <v-select
                        :items="registryList" return-object
                        label="Registry" prepend-icon="recent_actors"
                        item-text="registryName" disabled
                        v-model="pt.registry" style="width: 50%">
                     </v-select>
               </v-flex>
               <v-flex xs6>
                  <v-text-field
                        label="First Name" type="text" required :rules="[() => !!pt.firstName || 'This field is required']"
                        v-model="pt.firstName" autofocus>
                  </v-text-field>
               </v-flex>
               <v-flex xs6 class="pl-2">
                  <v-text-field
                        label="Last Name" type="text" required :rules="[() => !!pt.lastName || 'This field is required']"
                        v-model="pt.lastName">
                  </v-text-field>
               </v-flex>
               <v-flex xs6>
                  <v-text-field
                        label="MRN" type="text"
                        v-model="pt.mrn">
                  </v-text-field>
               </v-flex>
               <v-flex xs6 class="pl-2">
                  <v-text-field
                        v-model="pt.dob" label="Date of Birth (YYYY-MM-DD)"
                        prepend-icon="event"
                        required return-masked-value mask="####-##-##"
                        :rules="[() => !!pt.dob || 'This field is required']"
                     ></v-text-field>
               </v-flex>
               <v-flex xs12 class="pl-2">
                  <v-checkbox
                     v-model="deceased"
                     label="Deceased?"
                  ></v-checkbox>
               </v-flex>
               <v-flex xs6 v-if="deceased">
                  <v-text-field
                        v-model="pt.causeOfDeath" label="Cause of Death"
                        >
                  </v-text-field>
               </v-flex>
               <v-flex xs6 v-if="deceased">
                  <v-text-field
                        v-model="pt.deceasedDate" label="Date Deceased"
                        prepend-icon="event"
                        return-masked-value
                        mask="####-##-##" class="ml-2"
                  ></v-text-field>
               </v-flex>
            
         </v-layout>
         </v-form>
      </v-card-text>

      <v-card-actions>
         <v-spacer></v-spacer>

         <v-btn
            color="green darken-1"
            flat="flat"
            @click="editPatientDialog = false">
            Cancel
         </v-btn>

         <v-btn
            color="green darken-1"
            flat="flat"
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
         editPatientDialog: false
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
