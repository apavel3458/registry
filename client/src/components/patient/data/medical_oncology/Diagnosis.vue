/* eslint-disable vue/valid-template-root */
<template>
   <item-block
      :typesJson="typesJson"
      itemType="diagnosis"
      >
      <template v-slot:displayData="props">
         <v-list-item>
            <v-list-item-content class="itemHeading">Start Date</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.dateStart}}</v-list-item-content>
         </v-list-item>
         <v-list-item>
            <v-list-item-content class="itemHeading">Extent</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.details.extent?props.item.details.extent:'n/a'}}</v-list-item-content>
         </v-list-item>
         <v-list-item>
            <v-list-item-content class="itemHeading">Recurrence?</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.details.recurrence?'Yes':'No'}}</v-list-item-content>
         </v-list-item>
         <v-list-item>
            <v-list-item-content class="itemHeading">Hypertension?</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.details.hypertension?'Yes':'No'}}</v-list-item-content>
         </v-list-item>
         <v-list-item>
            <v-list-item-content class="itemHeading">Diabetes?</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.details.diabetes?'Yes':'No'}}</v-list-item-content>
         </v-list-item>
         <v-list-item>
            <v-list-item-content class="itemHeading">Treating Physician</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.treatingPhysician?props.item.treatingPhysician:'N/A'}}</v-list-item-content>
         </v-list-item>   
         <v-list-item>
            <v-list-item-content class="itemHeading">Herceptin Study?</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.details.herceptinStudy?'Yes':'No'}}</v-list-item-content>
         </v-list-item>
         <v-list-item>
            <v-list-item-content class="itemHeading">Herceptin Study Date?</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.details.herceptinStudyDate}}</v-list-item-content>
         </v-list-item>
         <!-- <v-list-item>
            <v-list-item-content class="itemHeading">More Properties:</v-list-item-content>
            <v-list-item-content class="itemContent">{{ Object.keys(props.item.details).length }}</v-list-item-content>
         </v-list-item> -->
      </template>
      <template v-slot:dataEdit="{editedItem, types}">
            <v-flex xs12>
               <v-select
                  v-model="editedItem.diagnosisName"
                  filled
                  label="Diagnosis"
                  :items="typesJson.filter(x=>x.diagnosisName)"
                  item-text="diagnosisName"
                  item-value="diagnosisName"
                  @change="editedItem.details={}"
                  required :rules="[() => !!editedItem.diagnosisName || 'This field is required']"
                  style="width: 50%"
               ></v-select>
            </v-flex>

            <v-flex xs12 sm4>
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

            <v-flex xs12 sm4>
               <v-text-field
                  v-model="editedItem.endDate"
                  filled
                  label="End Date (YYYY-MM-DD)"
                  prepend-inner-icon="mdi-calendar"
                  v-mask="'####-##-##'"
                  hide-details
               ></v-text-field>
            </v-flex>

            <v-flex xs12 sm4>
               <v-text-field
                  v-model="editedItem.treatingPhysician"
                  hide-details
                  filled
                  label="Treating Physician (Last Name Only)"
                  prepend-inner-icon="mdi-account-tie"
               ></v-text-field>
            </v-flex>
      </template>
   </item-block>
</template>

<script>
import ItemBlock from '../ItemBlock'
import DiagnosisTypes from './DiagnosisTypes'

export default {
   components: {ItemBlock},
   data() {
      return {
         typesJson: DiagnosisTypes
      }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="sass">

</style>
