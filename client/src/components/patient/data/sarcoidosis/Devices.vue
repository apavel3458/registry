/* eslint-disable vue/valid-template-root */
<template>
  <item :patientP="patientP" 
    itemType="device" 
    itemTitle="Devices"
    :tableHeaders="tableHeaders"
    :defaultItem="defaultItem"
    :typesJson="deviceTypes">
    <template v-slot:dataEdit="{editedItem, types}">
                <v-flex xs12 sm6>
                  <v-select
                    v-model="editedItem.deviceName"
                    box
                    label="Device Type"
                    :items="types"
                    item-text="deviceName"
                    item-value="deviceName"
                    @change="editedItem.details={}"
                    required :rules="[() => !!editedItem.deviceName || 'This field is required']"
                  ></v-select>

                </v-flex>
                <v-flex xs6 sm6>
                  <v-text-field
                    v-model="editedItem.implantDate"
                    box
                    label="Implant Date (YYYY-MM-DD)"
                    prepend-icon="event"
                    required
                    return-masked-value
                    mask="####-##-##"
                    :rules="[() => !!editedItem.implantDate || 'This field is required']"
                  ></v-text-field>
                </v-flex>
                <v-flex offset-sm6 xs6 sm6>
                  <v-text-field
                    v-model="editedItem.explantDate"
                    box
                    label="Explant Date (YYYY-MM-DD)"
                    prepend-icon="event"
                    required
                    return-masked-value
                    mask="####-##-##"
                  ></v-text-field>
                </v-flex>
    </template>
    <template v-slot:dataTable="props">
          <td class="eventName" style="white-space: nowrap; font-weight: bold;">{{ props.item.deviceName }}</td>
          <td class="eventName nowrap">{{ props.item.visibleDetail }}</td>
          <td class="text-xs-center nowrap">{{ props.item.implantDate }}</td>
          <td class="text-xs-center nowrap">{{ props.item.explantDate }}</td>
          <td class="text-xs-center hideOverflow">{{ props.item.comments }}</td>
    </template>
  </item>
</template>

<script>

import Item from "../Item"
import DeviceTypes from "./DeviceTypes"

export default {
  props: ['patientP'],
  components: {Item},
  data () {
    return {
      deviceTypes: DeviceTypes,
      tableHeaders: [
        { text: "Device", value: "deviceName", align: "center", width: "1%"},
        { text: "Mode/Type", value: "visibleDetail", align: "center", width: "1%"},
        { text: "Implanted", value: "implantDate", align: "center", width: "1%"},
        { text: "Explanted", value: "explantDate", align: "center", width: "1%" },
        { text: "Comments", align: "center", value: "comments"},
        { text: "Actions", align: "center", value: "name", sortable: false, width: "1%" }
      ],
      defaultItem: {
        deviceName: "",
        implantDate: null,
        explantDate: null,
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
