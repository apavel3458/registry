/* eslint-disable vue/valid-template-root */
<template>
  <div>
      <v-dialog v-model="dialog" max-width="700px"> 
        <v-card>
          <v-card-title>
            <span class="headline">Imaging Studies</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md class="py-0">
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-select
                    v-model="editedItem.studyName"
                    box
                    label="Imaging Type"
                    :items="imagingTypes"
                    item-text="studyName"
                    item-value="studyName"
                    @change="editedItem.details={}"
                    required :rules="[() => !!editedItem.studyName || 'This field is required']"
                  ></v-select>

                </v-flex>
                <v-flex xs12 sm6>
                  
                  <v-text-field
                    v-model="editedItem.studyDate"
                    box
                    label="Study Date"
                    prepend-icon="event"
                    required
                    return-masked-value
                    mask="####-##-##"
                    :rules="[() => !!editedItem.studyDate || 'This field is required']"
                  ></v-text-field>

                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="editedItem.EFtext" box return-masked-value mask="##-##" hide-details label="EF Range %"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field type="number" v-model.number="editedItem.EF" box hide-details disabled 
                      label="EF Absolute (Calculated)"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea 
                    box auto-grow clearable rows="2" hide-details
                    v-model="editedItem.comments"
                    label="Comments"
                  ></v-textarea>
                </v-flex>
                <v-divider></v-divider>
                <template v-if="editedItemDetails">
                  <v-flex xs4 v-for="detail in editedItemDetails" :key="detail.studyName">
                    <template v-if="detail.type == 'number'">
                      <v-text-field type="number" v-model="editedItem.details[detail.name]" :label="detail.text"
                      hide-details box></v-text-field>
                    </template>
                    <template v-else-if="detail.type == 'boolean'">
                      <v-checkbox
                        v-model="editedItem.details[detail.name]"
                        
                        :label="detail.text"
                      ></v-checkbox>
                    </template>
                  </v-flex>
                </template>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <v-data-table
      :headers="headers"
      :items="studies"
      :expand="expand"
      item-key="id"
      class="elevation-1"
      hide-actions
      :pagination.sync="pagination"
    >
      <template v-slot:items="props">
        <tr @click="props.expanded = !props.expanded">
          <td>{{ props.item.studyName }}</td>
          <td class="text-xs-center">{{ props.item.studyDate }}</td>
          <td class="text-xs-center">{{ props.item.EF }}</td>
          <td class="text-xs-center">{{ props.item.EFtext }}</td>
          <td class="text-xs-center">{{ props.item.comments }}</td>
          <td class="justify-center">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        No imaging studies found.  Click <v-btn dark fab small color="green lighten-2"
                                              @click="dialog=true">
                                              <v-icon>add</v-icon>
                                            </v-btn> to add an imaging study.
      </template>
      <template v-slot:expand="props">
        <v-card flat>
          <v-card-text>
            <span v-for="(d, i) in imagingDetails(props.item)" v-bind:key="i" class="detailParent">
              <v-chip :outline="!props.item.details[d.name]">
                <span class="detailHeader">{{d.text}}</span>
                <span class="detailValue" v-if="props.item.details[d.name] !== true && !!props.item.details[d.name]">
                  <span class="detailHeader">: </span>{{props.item.details[d.name]}}
                </span> 
              </v-chip>
            </span>
            <span v-if="Object.keys(props.item.details).length == 0">
              No extra properties
            </span>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>

    <v-btn absolute dark fab bottom small right color="green lighten-2" style="right:5em"
      @click="dialog=true">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import ImagingTypes from "./ImagingTypes.json"
import _ from 'lodash'
import RegistryPatientDataService from '@/services/RegistryPatientDataService'

export default {
  props: ['patientP'],
  data () {
    return {
      dialog: false,
      headers: [
        {
          text: "Imaging Test",
          value: "studyName",
          align: "center",
          sortable: true
        },
        {
          text: "Study Date",
          value: "studyDate",
          align: "center",
          sortable: true
        },
        { text: "EF", value: "EF", align: "center", sortable: true },
        { text: "EF Text", align: "center", value: "EFtext" },
        { text: "Comments", align: "center", value: "comments" },
        { text: "Actions", align: "center", value: "name", sortable: false }
      ],
      pagination: {
          sortBy: 'studyDate',
          descending: true
        },
      expand: false,
      studies: [],
      editedIndex: -1,
      editedItem: {
        studyName: "",
        studyDate: null,
        EF: 0,
        EFtext: 0,
        comments: "",
        details: {}
      },
      defaultItem: {
        studyName: "",
        studyDate: null,
        EF: 0,
        EFtext: 0,
        comments: "",
        details: {}
      },
      imagingTypes: ImagingTypes,
      patient: this.patientP
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    editedItemDetails() {
      var modality = ImagingTypes.filter(x => x.studyName == this.editedItem.studyName)
      if (modality.length == 0) return null
      return modality[0].details
    }
  },

  watch: {
    patientP(val) {
      this.patient = val
    },
    '$route.params.id': function(val) {
      this.initialize(val)
    },
    dialog(val) {
      val || this.close();
    },
    'editedItem.EFtext': function(newValue) {
      if (newValue) {
        const vals = newValue.split('-')
        if (vals.length === 1 || vals[1] == '' || Number.isNaN(vals[1])) {
          this.editedItem.EF = parseFloat(vals[0])
        } else {
          this.editedItem.EF = (parseFloat(vals[0])+parseFloat(vals[1]))/2
        }
      }
    }
  },

  created() {
    this.initialize(this.$route.params.id);
  },

  methods: {
    async initialize(patientId) {
      if (patientId) {
        this.studies = await RegistryPatientDataService.itemGet(patientId, 'imaging')
      }
    },
    imagingDetails(item) {
      var modality = ImagingTypes.filter(x => x.studyName == item.studyName)
      if (modality.length == 0) return null
      return modality[0].details
    },
    
    editItem(item) {
      this.editedIndex = this.studies.indexOf(item);
      if (!item.details || Array.isArray(item.details)) item.details = {} //remove null values, which mess this up
      this.editedItem = _.merge(_.assign({},this.defaultItem), item) //copy to default
      //console.log(JSON.stringify(this.editedItem))
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.studies.indexOf(item);
      if(confirm("Are you sure you want to delete this item?")) {
        const reply = await RegistryPatientDataService.itemDelete(item, 'imaging')
        if (reply.error) {
          this.error = reply.error
        } else { //assume successful
          this.studies.splice(index, 1);
        }
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async save() {
      this.editedItem.patientId = this.$route.params.id
      if (this.editedIndex > -1) { //edited itemv
        RegistryPatientDataService.itemPut(this.editedItem, 'imaging')
                  .then((reply) => {
                    Object.assign(this.studies[this.editedIndex], reply);
                  })
                  .catch((err) => {
                    alert(err) 
                  })
        
      } else { //new item
        RegistryPatientDataService.itemPost(this.editedItem, 'imaging')
                  .then((reply) => {
                      this.studies.push(reply);
                  }).catch((err) => {
                      alert(err)
                  })
      }
      this.close();
    },
    saveSend() {

    }
  },
  mounted() {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.row td {
   cursor: pointer;
}
table.v-table thead tr th {
  font-size: 14px;
}
table.v-table tbody tr td {
  font-size: 14px;
}
.detailParent {
  padding-left: 4px;
  font-size: 14px;
}
.detailHeader {
  padding: 0 2px 0 2px;
  font-weight: bold;
  color: green;
}
.detailValue {
  padding: 0 2px 0 2px;
}
</style>
