/* eslint-disable vue/valid-template-root */
<template>
  <item :patientP="patientP" 
    itemType="imaging" 
    itemTitle="Imaging"
    :tableHeaders="tableHeaders"
    :defaultItem="defaultItem"
    v-on:preSave="preSave($event)"
    sortByP="studyDate"
    :typesJson="imagingTypes">
    <template v-slot:dataEdit="{editedItem, types}">
      
                <v-flex xs12 sm6>
                  <v-select
                    v-model.trim="editedItem.imagingName"
                    filled
                    label="Imaging Type"
                    :items="imagingTypes"
                    item-text="imagingName"
                    item-value="imagingName"
                    @change="editedItem.details={}"
                    required :rules="[() => !!editedItem.imagingName || 'This field is required']"
                  ></v-select>

                </v-flex>
                <v-flex xs12 sm6>
                  
                  <v-text-field
                    v-model="editedItem.studyDate"
                    filled
                    label="Study Date (YYYY-MM-DD)"
                    prepend-inner-icon="mdi-calendar"
                    required
                    v-mask="'####-##-##'"
                    :rules="[() => !!editedItem.studyDate || 'This field is required']"
                  ></v-text-field>

                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field 
                    v-model.trim="editedItem.EFtext" 
                    filled 
                    v-mask="'##-##'" 
                    hide-details 
                    required :rules="[() => !!editedItem.EFtext || 'This field is required']"
                    label="EF % (Range or Exact)"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field 
                    type="number" 
                    v-model.number="editedItem.EF" 
                    filled hide-details disabled 
                    label="EF Absolute (Calculated)"></v-text-field>
                </v-flex>
    </template>
    <template v-slot:dataTable="props">
          <td class="eventName text-no-wrap" style="white-space: nowrap; font-weight: bold;">{{ props.item.studyDate }}</td>
          <td class="eventName text-no-wrap nowrap">{{ props.item.imagingName }}</td>
          <td class="text-center nowrap">{{ props.item.EFtext }}</td>
          <td class="text-center nowrap">{{ props.item.EF }}</td>
          <td class="text-center text-no-wrap nowrap">{{ props.item.visibleDetail }}</td>
            <v-tooltip bottom>
              <template v-slot:activator="{on}">
                <td class="text-center overflow-cell-wrapper">
                  <div class="overflow-cell" v-on="on">{{ props.item.comments }}</div>
                </td>
              </template>
              <span>{{props.item.comments}}</span>
            </v-tooltip>
    </template>
  </item>
</template>

<script>

import Item from "../Item"
import ImagingTypes from "./ImagingTypes"

export default {
  props: ['patientP'],
  components: {Item},
  data () {
    return {
      imagingTypes: ImagingTypes,
      tableHeaders: [
        { text: "Study Date", value: "studyDate", align: "center"},
        { text: "Study Type", value: "imagingName", align: "center"},
        { text: "EF", value: "EFtext", align: "center"},
        { text: "EF (absolute)", value: "EF", align: "center"},
        { text: "3D LVEF", value: "visibleDetail", align: "center"},
        { text: "Comments", align: "center", value: "comments"},
        { text: "Actions", align: "center", value: "name", sortable: false}
      ],
      defaultItem: {
        studyDate: "",
        imagingName: null,
        EF: null,
        EFtext: "",
        comments: "",
        details: {}
      },
    }
  },
  methods: {
    preSave(item) {
      if (item.EFtext.endsWith('-')) {
        item.EFtext = item.EFtext.substring(0, item.EFtext.length-1)
      }
    }
  },
  mounted() {
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
