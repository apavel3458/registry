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
            <v-list-item-content class="itemHeading">Type</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.details.type?props.item.details.type:'--'}}</v-list-item-content>
         </v-list-item>
         <v-list-item>
            <v-list-item-content class="itemHeading">NYHA</v-list-item-content>
            <v-list-item-content class="itemContent">{{props.item.details.NYHA?props.item.details.NYHA:'--'}}</v-list-item-content>
         </v-list-item>
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
