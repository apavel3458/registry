/* eslint-disable vue/valid-template-root */
<template>
<div>
  <v-container fluid grid-list-md pa-0>
     <v-layout align-start justify-space-around row fill-height>
    <v-data-iterator
      :items="diagnoses"
      hide-default-footer
      row
      wrap
    >
      <template v-slot:no-data>
         No diagnosis found.  All patients must have at least one diagnosis. Click <v-btn dark fab small color="green lighten-2"
                                              @click="dialog=true">
                                              <v-icon>mdi-plus</v-icon>
                                            </v-btn> to add a diagnosis.
      </template>
      <template v-slot:item="props">
        <v-flex
         style="width: 300px"
        >
          <v-card>
            <v-card-title><h4>{{ props.item.diagnosisName }}</h4></v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-item>
                <v-list-item-content class="heading">Start Date:</v-list-item-content>
                <v-list-item-content class="align-end fudge">{{ props.item.dateStart }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="heading">End Date:</v-list-item-content>
                <v-list-item-content class="align-end fudge">{{ props.item.dateEnd }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="heading">Treating Physician:</v-list-item-content>
                <v-list-item-content class="align-end fudge">{{ props.item.treatingPhysician }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="heading">Biopsy Proven?</v-list-item-content>
                <v-list-item-content class="align-end fudge">{{ props.item.biopsyProven?'Yes':'No' }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="heading">NYHA Class:</v-list-item-content>
                <v-list-item-content class="align-end fudge">{{ props.item.details.NYHAatDx }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content class="heading">More Properties:</v-list-item-content>
                <v-list-item-content class="align-end fudge">{{ Object.keys(props.item.details).length }}</v-list-item-content>
              </v-list-item>
            </v-list>
            <div class="oneline">
               <span class="heading">Comments:</span> {{limit(props.item.comments, 100)}}
            </div>
            <v-btn absolute dark fab bottom small right color="blue lighten-2"
               @click="editItem(props.item)">
               <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn absolute dark fab bottom small right color="red lighten-2" style="right:5em"
               @click="deleteItem(props.item)">
               <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card>
        </v-flex>
      </template>
    </v-data-iterator>
    </v-layout>
  </v-container>
  <v-dialog v-model="dialog" max-width="900px"> 
      <v-card>
         <v-card-title>
         <span class="headline">Diagnosis</span>
         </v-card-title>
         <v-card-text>
         <v-container grid-list-md class="py-0">
            <v-layout wrap>
               <v-flex xs12>
                  <v-select
                     v-model="editedItem.diagnosisName"
                     filled
                     label="Diagnosis"
                     :items="diagnosisTypes"
                     item-text="diagnosisName"
                     item-value="diagnosisName"
                     @change="editedItem.details={}"
                     required :rules="[() => !!editedItem.diagnosisName || 'This field is required']"
                     style="width: 50%"
                  ></v-select>
               </v-flex>

               <v-flex xs12 sm6>
                  <v-text-field
                     v-model="editedItem.dateStart"
                     filled
                     label="Start Date (YYYY-MM-DD)"
                     prepend-inner-icon="mdi-calendar"
                     v-mask="'####-##-##'"
                     :rules="[() => !!editedItem.dateStart || 'This field is required']"
                     hide-details
                  ></v-text-field>
               </v-flex>

               <v-flex xs12 sm6>
                  <v-text-field
                     v-model="editedItem.dateEnd"
                     filled
                     label="End Date (YYYY-MM-DD) (optional)"
                     prepend-inner-icon="mdi-calendar"
                     v-mask="'####-##-##'"
                     hide-details
                  ></v-text-field>
               </v-flex>

               <v-flex xs12 sm6>
                  <v-text-field
                     v-model="editedItem.treatingPhysician"
                     hide-details
                     filled
                     label="Treating Physician"
                     prepend-inner-icon="mdi-account-tie"
                  ></v-text-field>
               </v-flex>

               <v-flex xs12 sm6>
                  <v-checkbox
                     v-model="editedItem.biopsyProven"
                     hide-details
                     filled
                     label="Biopsy Proven"
                  ></v-checkbox>
               </v-flex>
               
               <v-flex xs12>
                  <v-textarea 
                     filled auto-grow clearable rows="2" hide-details
                     v-model="editedItem.comments"
                     label="Comments"
                  ></v-textarea>
               </v-flex>
               <v-divider></v-divider>
               <template v-if="diagnosisDetails">
                  <v-flex xs12 sm4 v-for="detail in diagnosisDetails" :key="detail.diagnosisName">
                     <template v-if="detail.type == 'number'">
                        <v-text-field
                           type="number" 
                           v-model="editedItem.details[detail.name]" 
                           :label="detail.text" filled
                           hide-details></v-text-field>
                     </template>
                     <template v-else-if="detail.type == 'boolean'">
                        <v-checkbox
                        v-model="editedItem.details[detail.name]"
                        :label="detail.text" hide-details
                        ></v-checkbox>
                     </template>
                     <template v-else-if="detail.type == 'string'">
                        <v-text-field filled
                        v-model="editedItem.details[detail.name]"
                        :label="detail.text" hide-details
                        ></v-text-field>
                     </template>
                     <template v-else-if="detail.type == 'date'">
                          <v-text-field filled
                          type="tel"
                          v-mask="'####-##-##'"
                          append-icon="mdi-calendar"
                          :rules="detail.required?[rules.required]:[]"
                          v-model="editedItem.details[detail.name]"
                          :label="detail.text" hide-details
                          ></v-text-field>
                     </template>
                     
                  </v-flex>
               </template>
            </v-layout>
         </v-container>
         </v-card-text>

         <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="blue darken-1" text @click="dialog=false">Cancel</v-btn>
         <v-btn color="blue darken-1" text @click="saveItem()">Save</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
   <v-btn absolute dark fab bottom small right color="green lighten-1" style="right:10em"
      @click="dialog=true">
      <v-icon>mdi-plus</v-icon>
   </v-btn>
</div>
</template>

<script>
import { mapState } from 'vuex'
import DiagnosisTypes from "./DiagnosisTypes.json"
import RegistryPatientDataService from "@/services/RegistryPatientDataService"
import _ from "lodash"

export default {
   data() {
        return {
           dialog: false,
           editedIndex: -1,
           editedItem: {},
           diagnoses: [],
           diagnosisTypes: DiagnosisTypes,
           defaultItem: {
               diagnosisName: null,
               details: {}
            }
        }
   },
   watch: {
      dialog() {
         if (this.editedIndex === -1) { //close
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
         }
      },
      async patient() {
         this.diagnoses = await RegistryPatientDataService.diagnosisGet(this.patient.id)
      }
   },
   computed: {
      formTitle() {
         return this.editedIndex === -1 ? "New Item" : "Edit Item";
      },
      diagnosisDetails() {
         var diagnoses = DiagnosisTypes.filter(x => x.diagnosisName == this.editedItem.diagnosisName)
         if (diagnoses.length == 0) return null
         else return diagnoses[0].details
      },
      ...mapState ({
         patient: 'activePatient'
      })
   },
   methods: {
      editItem(item) {
         this.editedIndex = this.diagnoses.indexOf(item);
         if (!item.details || Array.isArray(item.details)) item.details = {} //remove null values, which mess this up
         this.editedItem = _.merge(_.assign({},this.defaultItem), item) //copy to default
         this.dialog = true;
      },
      async saveItem() {
         this.editedItem.patientId = this.$route.params.patientId
         if (this.editedIndex > -1) { //edited itemv
            await RegistryPatientDataService.diagnosisPut(this.editedItem)
                     .then((reply) => {
                        Object.assign(this.diagnoses[this.editedIndex], reply)
                     })
                     .catch((err) => {
                        // eslint-disable-next-line no-console
                        alert(err)
                        err && err.config.status == 400 && alert(err) 
                     })

         } else { //new item
            await RegistryPatientDataService.diagnosisPost(this.editedItem)
                     .then((reply) => {
                        this.diagnoses.push(reply);
                     }).catch((err) => {
                        alert(err)
                     })
         }
         this.dialog = false
      },
      async deleteItem(item) {
       const index = this.diagnoses.indexOf(item)
       if (!confirm(`Are you sure you want to delete '${item.diagnosisName}' diagnosis?`)) return
       RegistryPatientDataService.diagnosisDelete(item)
            .then(() => {
               this.diagnoses.splice(index, 1)
            }).catch((err) => {
               if (err.config.status === 400) {
                  alert("Could not delete this item")
               }
            })
      },
      limit(str, maxChar=10) {
         return (str && str.length > maxChar)?str.substr(0,maxChar)+'...':str
      }
   },
   mounted() {
      //default diagnosis set to registry
      let defaultDiagnosisName = DiagnosisTypes.filter(x => x.diagnosisName == this.patient.registry.registryName)
      this.defaultItem.diagnosisName = defaultDiagnosisName?defaultDiagnosisName[0].diagnosisName:null
      
   },
   async created() {
      this.diagnoses = await RegistryPatientDataService.diagnosisGet(this.patient.id)
   }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="sass">
.heading {
   font-weight: bold;
   color: #3f824f;
}
.oneline {
   width: 100%;
   text-align: left;
   padding: 0 15px 25px 15px;
   font-size: 15px;
}
.dataheader {
   z-index: 10;
}
.v-list__item__content {
  font-size: 15px;
}
.fudge {
   position: absolute;
   margin-right: 10px;
   right: 10px;
}
</style>
