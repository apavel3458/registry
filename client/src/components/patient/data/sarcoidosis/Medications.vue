/* eslint-disable vue/valid-template-root */
<template>
  <item :patientP="patientP" 
    itemType="medication" 
    itemTitle="Medications"
    :tableHeaders="tableHeaders"
    :defaultItem="defaultItem"
    :typesJson="classes">
    <template v-slot:dataEdit="{editedItem, types}">
              <!-- <v-flex xs12 sm6>
                <v-combobox
                  v-model="editedItem.drug"
                  box
                  label="Drug Name"
                  :items="drugs"
                  item-text="drugName"
                  return-item
                  @change="setDrugDefaults(editedItem)"
                  required :rules="[() => !!editedItem.drug || 'This field is required']"
                ></v-combobox>

                </v-flex> -->
                <v-flex xs12 sm6>
                  <v-autocomplete
                    v-model="editedItem.medicationName"
                    box
                    label="Class"
                    :items="types"
                    item-text="medicationName"
                    item-value="medicationName"
                    :return-object="false"
                    @change="medicationNameChange(editedItem)"
                    required :rules="[() => !!editedItem.medicationName || 'This field is required']"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-if="editedItem.medicationName=='Steroid'"
                    v-model.number="editedItem.dose"
                    box
                    label="Dose (number only)"
                    type="number"
                    required :rules="[() => (!editedItem.dose && editedItem.medicationName=='Steroid') && 'This field is required']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="editedItem.startDate"
                    box
                    label="Start Date (YYYY-MM-DD)"
                    prepend-icon="event"
                    required
                    return-masked-value
                    mask="####-##-##"
                    :rules="[() => !!editedItem.startDate || 'This field is required']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="editedItem.endDate"
                    box
                    label="End Date (YYYY-MM-DD)"
                    prepend-icon="event"
                    required
                    return-masked-value
                    mask="####-##-##"
                  ></v-text-field>
                </v-flex>
    </template>
    <template v-slot:dataTable="props">
          <td class="text-xs-center nowrap">{{ props.item.medicationName }}</td>
          <td class="text-xs-center nowrap">{{ props.item.dose }}</td>
          <td class="eventName nowrap">{{ props.item.startDate }}</td>
          <td class="eventName nowrap">{{ props.item.endDate }}</td>
          <td class="text-xs-center hideOverflow">{{ props.item.comments }}</td>
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
        { text: "Class", value: "medicationName", align: "center", width: "1%" },
        { text: "Dose", value: "medicationName", align: "center", width: "1%" },
        { text: "Start Date", value: "startDate", align: "center", width: "1%"},
        { text: "End Date", value: "endDate", align: "center", width: "1%"},
        { text: "Comments", align: "center", value: "comments"},
        { text: "Actions", align: "center", value: "name", sortable: false, width: "1%" }
      ],
      defaultItem: {
        medicationName: "",
        class: "",
        drugName: "",
        startDate: null,
        endDate: null,
        dose: null,
        unit: null,
        comments: "",
        visibleDetail: "",
        details: {}
      },
    }
  },
  watch: {
    
  },
  methods: {
    medicationNameChange(editedItem) {
      editedItem.details={}; 
      editedItem.class = editedItem.medicationName
    },
    setDrugDefaults(editedItem) {
      if (editedItem.drug.class) {
        editedItem.medicationName = editedItem.drug.class
        // editedItem.drugName = editedItem.drug.drugName
        // alert(editedItem.drugName)
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
.hideOverflow {
  text-overflow: ellipsis;
  overflow: hidden;
  /* max-width: 200px;
  white-space: nowrap;  --> makes it one line*/
}
.eventName {
  font-weight: bold;
}
</style>
