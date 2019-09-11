/* eslint-disable vue/valid-template-root */
<template>
  <item :patientP="patientP" 
    itemType="medication" 
    itemTitle="Medications"
    :tableHeaders="tableHeaders"
    :defaultItem="defaultItem"
    sortByP="startDate"
    :typesJson="classes">
    <template v-slot:dataEdit="{editedItem, types}">
              <v-flex xs12 sm6>
                <v-combobox
                  v-model="editedItem.drug"
                  filled
                  label="Drug Name"
                  :items="drugs"
                  item-text="drugName"
                  return-item
                  hide-details
                  @change="setDrugDefaults(editedItem)"
                  required :rules="[() => !!editedItem.drug || 'This field is required']"
                ></v-combobox>

                </v-flex>
                <v-flex xs12 sm6>
                  <v-combobox
                    v-model="editedItem.medicationName"
                    filled
                    label="Class"
                    :items="types"
                    item-text="medicationName"
                    item-value="medicationName"
                    :return-object="false"
                    hide-details
                    @change="medicationNameChange(editedItem)"
                    required :rules="[() => !!editedItem.medicationName || 'This field is required']"
                  ></v-combobox>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model.number="editedItem.dose"
                    filled hide-details
                    label="Dose (number only)"
                    type="number"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="editedItem.unit"
                    filled hide-details
                    label="Unit"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="editedItem.startDate"
                    filled hide-details
                    label="Start Date (YYYY-MM-DD)"
                    prepend-inner-icon="mdi-calendar"
                    required
                    return-masked-value
                    v-mask="'####-##-##'"
                    :rules="[() => !!editedItem.startDate || 'This field is required']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="editedItem.endDate"
                    filled hide-details
                    label="End Date (YYYY-MM-DD)"
                    prepend-inner-icon="mdi-calendar"
                    required
                    v-mask="'####-##-##'"
                  ></v-text-field>
                </v-flex>
    </template>
    <template v-slot:dataTable="props">
          <td class="text-xs-center text-no-wrap" style="">{{ props.item.drugName }}</td>
          <td class="text-xs-center text-no-wrap" style="">{{ props.item.drugClass }}</td>
          <td class="eventName nowrap">{{ props.item.startDate }}</td>
          <td class="eventName nowrap">{{ props.item.endDate }}</td>
          <td class="nowrap">{{ props.item.dose }} {{ props.item.unit }}</td>
          <td class="text-xs-center overflow-cell-wrapper">
            <div class="overflow-cell">{{ props.item.comments }}</div>
          </td>
    </template>
  </item>
</template>

<script>

import Item from "../Item"
import MedicationTypes from "./MedicationTypes"
import MedicationDrugTypes from "./MedicationDrugTypes"

//Unfortunatley the way it works is xName is sent to Item.vue, where x is associated with item.details
// item.details is assocaited with drug class, so i had to use medicationName as class (I really duplicated medicationName to class using watch property)
// item.drugName is the actual drug name. 

export default {
  props: ['patientP'],
  components: {Item},
  data () {
    return {
      classes: MedicationTypes,
      drugs: MedicationDrugTypes,
      tableHeaders: [
        { text: "Drug Name", value: "drugName", align: "center", width: "1%" },
        { text: "Drug Class", value: "drugClass", align: "center", width: "1%" },
        { text: "Start Date", value: "startDate", align: "center", width: "1%"},
        { text: "End Date", value: "endDate", align: "center", width: "1%"},
        { text: "Dose", value: "dose", align: "center", width: "1%"},
        { text: "Comments", align: "center", value: "comments"},
        { text: "Actions", align: "center", value: "name", sortable: false, width: "1%" }
      ],
      defaultItem: {
        medicationName: "",
        comments: "",
        details: {}
      },
    }
  },
  watch: {
    
  },
  methods: {
    medicationNameChange(editedItem) {
      editedItem.details={}; 
      editedItem.drugClass = editedItem.medicationName
    },
    setDrugDefaults(editedItem) {
      if (editedItem.drug.drugClass) {
        const {drugClass, drugName, dose, unit} = editedItem.drug
        Object.assign(editedItem, {drugClass, drugName, dose, unit, medicationName: drugClass})
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.nowrap {
  white-space: nowrap;
}
.eventName {
  font-weight: bold;
}
</style>
