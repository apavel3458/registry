/* eslint-disable vue/valid-template-root */
<template>
  <item :patientP="patientP" 
    itemType="other" 
    itemTitle="Other"
    :tableHeaders="tableHeaders"
    :defaultItem="defaultItem"
    sortByP = "otherDate"
    :typesJson="otherTypes">
    <template v-slot:dataEdit="{editedItem, types}">
                <v-flex xs12 sm6>
                  <v-select
                    v-model="editedItem.otherName"
                    filled
                    label="Other Type"
                    :items="types"
                    item-text="otherName"
                    item-value="otherName"
                    @change="editedItem.details={}"
                    required :rules="[() => !!editedItem.otherName || 'This field is required']"
                  ></v-select>

                </v-flex>
                <v-flex xs6 sm6>
                  <v-text-field
                    v-model="editedItem.otherDate"
                    filled
                    label="Other Date (YYYY-MM-DD)"
                    prepend-inner-icon="mdi-calendar"
                    required
                    v-mask="'####-##-##'"
                    :rules="[() => !!editedItem.otherDate || 'This field is required']"
                  ></v-text-field>
                </v-flex>
    </template>
    <template v-slot:dataTable="props">
          <td class="eventName" style="white-space: nowrap; font-weight: bold;">{{ props.item.otherName }}</td>
          <td class="eventName nowrap">{{ props.item.visibleDetail }}</td>
          <td class="text-xs-center nowrap">{{ props.item.otherDate }}</td>
          <td class="text-xs-center overflow-cell-wrapper">
            <div class="overflow-cell">{{ props.item.comments }}</div>
            </td>
    </template>
  </item>
</template>

<script>

import Item from "../Item"
import OtherTypes from "./OtherTypes"

export default {
  props: ['patientP'],
  components: {Item},
  data () {
    return {
      otherTypes: OtherTypes,
      tableHeaders: [
        { text: "Other", value: "otherName", align: "center", width: "1%"},
        { text: "Detail", value: "visibleDetail", align: "center", width: "1%"},
        { text: "Date", value: "otherDate", align: "center", width: "1%"},
        { text: "Comments", align: "center", value: "comments"},
        { text: "Actions", align: "center", value: "name", sortable: false, width: "1%" }
      ],
      defaultItem: {
        otherName: "",
        otherDate: null,
        comments: "",
        visibleDetail: "",
        details: {}
      },
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
