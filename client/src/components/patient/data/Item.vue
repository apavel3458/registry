/* eslint-disable vue/valid-template-root */
<template>
  <div>
      <v-dialog v-model="dialog" max-width="700px"> 
        <v-card>
          <v-card-title>
            <span class="headline">{{itemTitle}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md class="py-0">
              <v-form
                ref="itemForm"
                v-model="itemFormValid"
              >
                <v-layout wrap>
                  <slot name="dataEdit" v-bind:editedItem="editedItem" v-bind:types="itemTypes"></slot>
                  <v-flex xs12>
                    <v-textarea 
                      filled auto-grow clearable rows="2" hide-details
                      v-model="editedItem.comments"
                      label="Comments"
                    ></v-textarea>
                  </v-flex>
                  <v-divider></v-divider>
                <template v-if="itemDetails">
                    <v-flex xs12 sm4 v-for="(detail,i) in itemDetails" :key="i">
                      <template v-if="detail.type == 'number'">
                          <v-text-field
                            type="number" 
                            :rules="detail.required?[rules.required]:[]"
                            v-model.number="editedItem.details[detail.name]" 
                            :label="detail.text" filled
                            hide-details></v-text-field>
                      </template>
                      <template v-else-if="detail.type == 'boolean'">
                          <v-checkbox
                          :rules="detail.required?[rules.required]:[]"
                          v-model="editedItem.details[detail.name]"
                          :label="detail.text" hide-details
                          ></v-checkbox>
                      </template>
                      <template v-else-if="detail.type == 'string'">
                          <v-text-field filled
                          :rules="detail.required?[rules.required]:[]"
                          v-model.trim="editedItem.details[detail.name]"
                          :label="detail.text" hide-details
                          ></v-text-field>
                      </template>
                      <template v-else-if="detail.type == 'date'">
                          <v-text-field filled
                          mask="####-##-##"
                          prepend-icon="event"
                          :rules="detail.required?[rules.required]:[]"
                          v-model="editedItem.details[detail.name]"
                          :label="detail.text" hide-details
                          ></v-text-field>
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
                    </v-flex>
                </template>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
          
          
          
      <div class="searchWindow" v-show="searchDialog">
          <v-card flat class="mt-n1">
            <v-card-text class="pt-0" style="width: 50%">
                <v-text-field dense solo
                  v-model="searchText" ref="sech"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  clearable
                  width="50%"
                  style="display: inline; width: 50%;"
                  @click:clear="openCloseSearch"
              ></v-text-field>
            </v-card-text>
            
          </v-card>
      </div>



    
      <div class="tableWrapper">
      <v-data-table
        :headers="tableHeaders"
        :items="patient[itemType]"
        :single-expand="true"
        :expanded.sync="expanded"
        item-key="id"
        class="itemTable"
        hide-default-footer
        must-sort
        :options.sync="options"
        :search="searchText"
        :loading="loading"
      >
        <template v-slot:item="props">
          <tr @click="!expanded.length||expanded[0]!=props.item?expanded = [props.item]:expanded = []">
              <slot name="dataTable" v-bind:item="props.item"></slot>
              <td class="justify-center nowrap">
                <v-btn outlined x-small dark fab class="my-0 mx-0 text-center" color="grey darken-1" @click.stop="editItem(props.item)" style="display: inline-block;">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn outlined x-small dark fab ma-0 class="my-0 mx-1 text-center" color="grey darken-1" @click.stop="deleteItem(props.item)" style="display: inline-block;">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
          </tr>
        </template>
        <template v-slot:no-data>
          No items found.  Click <v-btn dark fab x-small color="green lighten-2" @click="dialog=true">
                                                <v-icon>mdi-plus</v-icon>
                                              </v-btn> to add an item.
        </template>
        <template v-slot:expanded-item="props">
          <td :colspan="props.headers.length">
          <v-card class="elevation-1 expandedRow">
            <v-card-text>
              <span v-for="(d, i) in itemsAndDetails(props.item)" v-bind:key="i" class="detailParent">
                <v-chip :outlined="(d.type=='boolean'&&!d.value)" :class="{falseBoolean:(d.type=='boolean'&&!d.value)}">
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
          </td>

        </template>
      </v-data-table>
      </div>

    <v-btn absolute dark fab bottom small right color="green lighten-2" style="right:5em"
      @click="dialog=true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-btn absolute dark fab bottom small right color="blue lighten-2" style="right:10em"
      @click="openCloseSearch()">
      <v-icon v-if="searchDialog">mdi-magnify-close</v-icon>
      <v-icon v-else>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script>

import _ from 'lodash'
import RegistryPatientDataService from '@/services/RegistryPatientDataService'
import {mapState} from 'vuex'
import GeneralMixin from '@/util/GeneralMixin'

export default {
  mixins: [GeneralMixin],
  props: [
      'typesJson', 
      'itemType', 
      'itemTitle', 
      'tableHeaders', 
      'defaultItem',//a blank item that is used for new entries
      'sortByP'], 
  data () {
    return {
      dialog: false,
      options: {
          sortDesc: [true],
          sortBy: [],
          itemsPerPage: -1,
          multiSort: true,
          mustSort: true
        },
      expanded: [],
      singleExpand: null,
      items: [],
      editedIndex: -1,
      editedItem: {
      },
      
      itemTypes: [],
      itemTypeName: '',
      itemFormValid: false,
      rules: {
        required: value => !!value || 'Required'
      },
      searchText: null,
      searchDialog: false,
      loading: false
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    itemDetails() {
      //alert(JSON.stringify(this.itemTypes))
      var item = this.itemTypes.filter(x => x[this.itemTypeName] == this.editedItem[this.itemTypeName])
      if (item.length == 0) return null
      return item[0].details
    },
    ...mapState ({
         patient: 'activePatient'
      })
  },

  watch: {
    patient: function(val) {
      this.initialize(val.id)
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

  mounted() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.itemTypes = this.typesJson
      this.itemTypeName = this.itemType + "Name"
      this.items = this.patient[this.itemType]
      // this.loading = true
      // if (id) {
      //   await RegistryPatientDataService.itemGet(id, this.itemType)
      //             .then((reply) => {
      //                 this.items = reply
      //             }).catch((err) => {
      //                this.showError(err)
      //             })
      //   this.loading = false
      // }
      if (this.sortByP) this.options.sortBy.push(this.sortByP)
    },

    itemDefaultDetails(item) {
      if (!item) return
      var itemType = this.itemTypes.filter(x => x[this.itemTypeName] == item)
      return (itemType.length==0)? null: itemType[0].details
    },

    itemsAndDetails(item) {
        //loop through each item.detail, find it int the ItemTypes.json, and display the readable name.  
        //If readable name not available, then print the less-readable name that the detail already has
        let typeFound = this.itemTypes.find(t => t[this.itemTypeName] == item[this.itemTypeName])
        if (!typeFound) return null
        let ret = Object.keys(item.details).map( k => {
            let detailFound = typeFound.details.find(t => t.name == k)
            if (detailFound) return {...detailFound, value: item.details[k]}
            else return {name: k, text: k, value: item.details[k]}
        })
        return ret
        //console.log(JSON.stringify(ret))
    },
    
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      if (!item.details || Array.isArray(item.details)) item.details = {} //remove null values, which mess this up
      this.editedItem = _.merge(_.assign({},this.defaultItem), item) //copy to default

      const itemTypeFound = this.itemTypes.find(t => t[this.itemTypeName] == item[this.itemTypeName])
      
      if (itemTypeFound)
        this.editedItem.details = _.pick(this.editedItem.details, 
                                itemTypeFound.details.map(x => {return x.name}))

      //console.log(JSON.stringify(this.editedItem))
      this.dialog = true;
    },

    async deleteItem(item) {
      const index = this.items.indexOf(item);
      if(confirm("Are you sure you want to delete this " + this.itemType + " item?")) {
        await RegistryPatientDataService.itemDelete(item, this.itemType)
            .then(() => {
              //this.items.splice(index, 1);
              this.$store.commit('ACTIVE_PATIENT_PROPERTY_DELETE', {prop: this.itemType, index: index})
              this.showSuccess("Successfully deleted item")
            }).catch(err => {
              this.showError(err)
            })
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
      if (!this.$refs.itemForm.validate()) {
        this.showError("Please ensure the information is filled out correctly")
        return
      }
      this.editedItem.patientId = this.patient.id

      //add visibleDetail so it shows up in main table 
      this.editedItem.visibleDetail = this.getVisibleDetail(this.editedItem)
      
      //any pre-processing by children:
      this.$emit('preSave', this.editedItem)

      if (this.editedIndex > -1) { //edited item
        await RegistryPatientDataService.itemPut(this.editedItem, this.itemType)
                  .then((reply) => {
                    //Object.assign(this.studies[this.editedIndex], reply);
                    this.$store.commit('ACTIVE_PATIENT_PROPERTY_UPDATE', {prop: this.itemType, val: reply, index: this.editedIndex})
                    this.showSuccess("Successfully updated item")
                  })
                  .catch((err) => {
                    this.showError(err)
                  })
        
      } else { //new item
        await RegistryPatientDataService.itemPost(this.editedItem, this.itemType)
                  .then((reply) => {
                      //this.items.push(reply);
                      this.$store.commit('ACTIVE_PATIENT_PROPERTY_ADD', {prop: this.itemType, val: reply})
                      this.showSuccess("Successfully added item")
                  }).catch((err) => {
                      this.showError(err)
                  })
      }
      this.close();
    },
    //------------UTILITY FUNCTIONS
    getItemSchema(item) {
      if (item.schema) {
        return item.schema
      } else {
        let result = this.itemTypes.find(t => t[this.itemTypeName] == item[this.itemTypeName])
        if (!result) return []
        else {
          item.schema = result
          return result
        }
      }
    },

    getVisibleDetail(item) {
      const blank = "--"
      let itemSchema = this.getItemSchema(item)
      let visibleDetailName = itemSchema.visibleDetail
      if (visibleDetailName) {
        let visibleDetail = itemSchema.details.find(d => d.name == visibleDetailName)
        if (visibleDetail && visibleDetail.type == "boolean")
          return (item.details[visibleDetailName])?visibleDetail.text:blank //if boolean
        else
          return item.details[visibleDetailName]
      } else {
        return "--"
      }
    },
    openCloseSearch() {
      if (this.searchDialog) {
        this.searchDialog = false
        this.searchText = null
      } else {
        this.searchDialog=true; 
        this.$nextTick(this.$refs.sech.focus)
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style="scss">

.falseBoolean.v-chip.v-chip--outlined {
  color: #d4d4d4;
}
.falseBoolean span.detailHeader {
  color: #8c8c8c;
}
/* .compact {
    transform: scale(0.875);
    transform-origin: left;
} */
.nowrap {
  white-space: nowrap;
}

.itemTable {
  text-align: center;
  width: 100%;
}
::v-deep .itemTable th {
  white-space: nowrap;
}
.itemTable tr {
   cursor: pointer;
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
.expandedRow {
  background-color: #fbfbfb;
}
</style>
