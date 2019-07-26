/* eslint-disable vue/valid-template-root */
<template>
<div>
  <v-container fluid grid-list-md pa-0>
     <v-layout align-start justify-space-around row fill-height>
    <v-data-iterator
      :items="diagnoses"
      content-tag="v-layout"
      hide-actions
      row
      wrap
    >
      <template v-slot:no-data>
         No diagnosis found.  All patients must have at least one diagnosis. Click <v-btn dark fab small color="green lighten-2"
                                              @click="dialog=true">
                                              <v-icon>add</v-icon>
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
              <v-list-tile>
                <v-list-tile-content>Start Date:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ props.item.dateStart }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>End Date:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ props.item.dateEnd }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>Treating Physician:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ props.item.treatingPhysician }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>Biopsy Proven?</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ props.item.biopsyProven?'Yes':'No' }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>More Properties:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ Object.keys(props.item.details).length }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <div class="oneline">
               Comments: {{limit(props.item.comments, 100)}}
            </div>
            <v-btn absolute dark fab bottom small right color="blue lighten-2"
               @click="editItem(props.item)">
               <v-icon>edit</v-icon>
            </v-btn>
            <v-btn absolute dark fab bottom small right color="red lighten-2" style="right:5em"
               @click="deleteItem(props.item)">
               <v-icon>delete</v-icon>
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
                     box
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
                     box
                     label="Start Date (YYYY-MM-DD)"
                     prepend-inner-icon="event"
                     return-masked-value
                     mask="####-##-##"
                     :rules="[() => !!editedItem.dateStart || 'This field is required']"
                     hide-details
                  ></v-text-field>
               </v-flex>

               <v-flex xs12 sm6>
                  <v-text-field
                     v-model="editedItem.dateEnd"
                     box
                     label="End Date (YYYY-MM-DD) (optional)"
                     prepend-inner-icon="event"
                     return-masked-value
                     mask="####-##-##"
                     hide-details
                  ></v-text-field>
               </v-flex>

               <v-flex xs12 sm6>
                  <v-text-field
                     v-model="editedItem.treatingPhysician"
                     hide-details
                     box
                     label="Treating Physician"
                     prepend-inner-icon="person"
                  ></v-text-field>
               </v-flex>

               <v-flex xs12 sm6>
                  <v-checkbox
                     v-model="editedItem.biopsyProven"
                     hide-details
                     box
                     label="Biopsy Proven"
                  ></v-checkbox>
               </v-flex>
               
               <v-flex xs12>
                  <v-textarea 
                     box auto-grow clearable rows="2" hide-details
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
                           :label="detail.text" box
                           hide-details></v-text-field>
                     </template>
                     <template v-else-if="detail.type == 'boolean'">
                        <v-checkbox
                        v-model="editedItem.details[detail.name]"
                        :label="detail.text" hide-details
                        ></v-checkbox>
                     </template>
                     <template v-else-if="detail.type == 'string'">
                        <v-text-field box
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
         <v-btn color="blue darken-1" flat @click="dialog=false">Cancel</v-btn>
         <v-btn color="blue darken-1" flat @click="saveItem()">Save</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
   <v-btn absolute dark fab bottom small right color="green lighten-1" style="right:10em"
      @click="dialog=true">
      <v-icon>add</v-icon>
   </v-btn>
</div>
</template>

<script>
import { mapState } from 'vuex'
import DiagnosisTypes from "./sarcoidosis/DiagnosisTypes.json"
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
         this.editedItem.patientId = this.$route.params.id
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
<style scoped>
.oneline {
   width: 100%;
   text-align: left;
   padding: 0 15px 25px 15px;
   font-size: 15px;
}
.dataheader {
   z-index: 10;
}
.v-list__tile__content {
  font-size: 15px;
}
</style>
