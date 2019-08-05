/* eslint-disable vue/valid-template-root */
<template>
  <item :patientP="patientP" 
    itemType="event" 
    typePropName="eventName"
    itemTitle="Clinical Events"
    :tableHeaders="tableHeaders"
    :defaultItem="defaultItem"
    sortByP="eventDate"
    :typesJson="eventTypes">
    <template v-slot:dataEdit="{editedItem, types}">
                <v-flex xs12 sm6>
                  <v-select
                    v-model="editedItem.eventName"
                    filled
                    label="Event Type"
                    :items="types"
                    item-text="eventName"
                    item-value="eventName"
                    @change="editedItem.details={}"
                    required :rules="[() => !!editedItem.eventName || 'This field is required']"
                  ></v-select>

                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="editedItem.eventDate"
                    filled
                    label="Event Date (YYYY-MM-DD)"
                    prepend-inner-icon="mdi-calendar"
                    required
                    v-mask="'####-##-##'"
                    :rules="[() => !!editedItem.eventDate || 'This field is required']"
                  ></v-text-field>
                </v-flex>
    </template>
    <template v-slot:dataTable="props">
          <td class="text-xs-center" style="white-space: nowrap;">{{ props.item.eventDate }}</td>
          <td class="eventName nowrap">{{ props.item.eventName }}</td>
          <td class="text-xs-center nowrap">{{ props.item.visibleDetail }}</td>
          <td class="text-xs-center overflow-cell-wrapper"><div class="overflow-cell">{{ props.item.comments }}</div></td>
    </template>
  </item>
</template>

<script>

import Item from "../Item"
import EventTypes from "./EventTypes"

export default {
  props: ['patientP'],
  components: {Item},
  data () {
    return {
      eventTypes: EventTypes,
      tableHeaders: [
        { text: "Date", value: "eventDate", align: "center", width: "1%"},
        { text: "Event", value: "eventName", align: "center", width: "1%" },
        { text: "Detail", value: "visibleDetail", align: "center", width: "1%"},
        { text: "Comments", align: "center", value: "comments"},
        { text: "Actions", align: "center", value: "name", sortable: false, width: "1%" }
      ],
      defaultItem: {
        eventName: "",
        eventDate: null,
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
