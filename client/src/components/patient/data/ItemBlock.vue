/* eslint-disable vue/valid-template-root */
<template>
<div>
  <v-container fluid grid-list-md pa-0>
     <v-layout align-start justify-space-around row fill-height>
    <v-data-iterator
      :items="items"
      hide-default-footer
      :loading="loading"
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
            <v-list dense class="mainList">
              <slot name="displayData" :item="props.item" :types="typesJson"></slot>
            </v-list>
            <div class="oneline">
               <span class="itemHeading">Comments:</span> {{limit(props.item.comments, 100)}}
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
               <v-form ref="itemForm">
               <v-layout wrap>
                  <slot name="dataEdit" v-bind:editedItem="editedItem" v-bind:types="typesJson"></slot>
                  
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
                        <template v-else-if="detail.type == 'autocomplete string'">
                           <v-autocomplete filled clearable
                                 :rules="detail.required?[rules.required]:[]"
                                 v-model="editedItem.details[detail.name]" :items="detail.options"
                                 :label="detail.text">
                           </v-autocomplete>
                        </template>
                        <template v-else-if="detail.type == 'combobox string'">
                           <v-combobox filled clearable
                                 @input.native="editedItem.details[detail.name]=$event.srcElement.value"
                                 :rules="detail.required?[rules.required]:[]"
                                 v-model.trim="editedItem.details[detail.name]" :items="detail.options"
                                 :label="detail.text">
                           </v-combobox>
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
            </v-form>
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
import RegistryPatientDataService from "@/services/RegistryPatientDataService"
import _ from "lodash"
import GeneralMixin from '@/util/GeneralMixin'

export default {
   mixins: [GeneralMixin],
   props: ['typesJson', 'itemType'],
   data() {
        return {
            dialog: false,
            editedIndex: -1,
            editedItem: {},
            items: [],
            defaultItem: {
                  diagnosisName: null,
                  details: {}
            },
            rules: {
               required: value => !!value || 'Required'
            },
            loading: false
        }
    },
    watch: {
      dialog() {
         if (this.editedIndex === -1) { //close
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
         }
      },
      // async patient() {
      //    this.loading = true
      //    await RegistryPatientDataService.diagnosisGet(this.patient.id)
      //    .then(reply => {
      //       this.items = reply
      //    }).catch(err => {
      //       this.showError(err)
      //    })
      //    this.loading = false
      // }
   },
   computed: {
      formTitle() {
         return this.editedIndex === -1 ? "New Item" : "Edit Item";
      },
      diagnosisDetails() {
         var diagnoses = this.typesJson.filter(x => x.diagnosisName == this.editedItem.diagnosisName)
         if (diagnoses.length == 0) return null
         else return diagnoses[0].details
      },
      ...mapState ({
         patient: 'activePatient'
      })
   },
   methods: {
      editItem(item) {
         this.editedIndex = this.items.indexOf(item);
         if (!item.details || Array.isArray(item.details)) item.details = {} //remove null values, which mess this up
         this.editedItem = _.merge(_.assign({},this.defaultItem), item) //copy to default
         this.dialog = true;
      },
      async saveItem() {
         if (!this.$refs.itemForm.validate()) {
            this.showError("Please ensure the information is filled out correctly")
            return
         }
         this.editedItem.patientId = this.$route.params.patientId
         if (this.editedIndex > -1) { //edited itemv
            await RegistryPatientDataService.diagnosisPut(this.editedItem)
                     .then((reply) => {
                        //Object.assign(this.items[this.editedIndex], reply)
                        this.$store.commit('ACTIVE_PATIENT_PROPERTY_UPDATE', {prop: this.itemType, val: reply, index: this.editedIndex})
                        this.showSuccess("Record updated successfully")
                     })
                     .catch((err) => {
                        this.showError(err)
                     })

         } else { //new item
            await RegistryPatientDataService.diagnosisPost(this.editedItem)
                     .then((reply) => {
                        //this.items.push(reply);
                        this.$store.commit('ACTIVE_PATIENT_PROPERTY_ADD', {prop: this.itemType, val: reply})
                        this.showSuccess("Record added successfully")
                     }).catch((err) => {
                        this.showError(err)
                     })
         }
         this.dialog = false
      },
      async deleteItem(item) {
       const index = this.items.indexOf(item)
       if (!confirm(`Are you sure you want to delete '${item.diagnosisName}' diagnosis?`)) return
       RegistryPatientDataService.diagnosisDelete(item)
            .then(() => {
               //this.items.splice(index, 1)
               this.$store.commit('ACTIVE_PATIENT_PROPERTY_DELETE', {prop: this.itemType, index: index})
               this.showSuccess("Record deleted successfully")
            }).catch((err) => {
               this.showError(err)
            })
      },
      limit(str, maxChar=10) {
         return (str && str.length > maxChar)?str.substr(0,maxChar)+'...':str
      }
   },
   mounted() {
      //default diagnosis set to registry
      let defaultDiagnosisName = this.typesJson.filter(x => x.primary)
      this.defaultItem.diagnosisName = defaultDiagnosisName?defaultDiagnosisName[0].diagnosisName:null
      
   },
   async created() {
      // this.loading = true
      // await RegistryPatientDataService.diagnosisGet(this.patient.id)
      //    .then(reply => {
      //       this.diagnoses = reply
      //    }).catch(err => {
      //       this.showError(err)
      //    })
      // this.loading = false
      this.items = this.patient[this.itemType]
      if (!this.items) this.items = []
   }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style="scss">
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
.mainList >>> .itemHeading, .itemHeading{
   font-weight: bold;
   color: #3f824f;
}
.mainList >>> .itemContent {
   position: absolute;
   margin-right: 10px;
   right: 10px;
}
</style>
