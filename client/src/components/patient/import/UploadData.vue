/* eslint-disable vue/valid-template-root */
<template>
<div>
    <v-row>
        <v-col xs="12" class="pb-0">
              <v-alert
                text
                type="error"
                icon="mdi-alert-circle"
                class="mx-3"
              >
                Warning: this page is for mass data migration.  Do not touch this unless you know what you are doing!
              </v-alert>
        </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" md="6" class="pt-0">
        <v-card ref="patients" class="ml-3 pa-3 mt-0">
          <v-form>
          <H3 class="ml-2">Upload Patients</H3>
          <v-file-input 
            v-model="patientsFile"
            ref="patientsFile"
            chips clearable outlined accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
            persistent-hint hint="Select CSV/XLSX file to upload" style="cursor:pointer;"
            show-size label="Upload File" class="mr-2">
          </v-file-input>

          <div class="text-center"><v-btn color="info" :loading="loading" :disabled="loading" class="text-center" @click="uploadPatients()">Execute!</v-btn></div>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" md="6" class="pt-0">
        <v-card ref="patientDetail" class="mr-3 pa-3 mt-0">
          <v-form>
          <H3 class="ml-2">Upload Data on Existing Patients</H3>
          <v-file-input 
            v-model="patientsDataFile"
            ref="patientsFile"
            chips clearable outlined accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
            persistent-hint hint="Select CSV/XLSX file to upload" style="cursor:pointer;"
            show-size label="Upload File" class="mr-2">
          </v-file-input>

          <div class="text-center"><v-btn color="info" :loading="loading" :disabled="loading" class="text-center" @click="uploadPatientsData()">Execute!</v-btn></div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>





    <v-card v-show="results && results.length > 0" class="pa-4">
      <v-toolbar dense elevation="2" color="grey lighten-4">
        <v-toolbar-title>Results: (Records processed: {{results.length}}</v-toolbar-title>

        <!-- <div class="flex-grow-1"></div> -->

        <v-toolbar-items>
          <v-btn text class="ml-10" @click="results=[]">Clear Table</v-btn>
        </v-toolbar-items>
      </v-toolbar>
        <v-data-table dense :headers="resultsHeaders" :items="results" class="elevation-1">
          <template v-slot:item.result="{item}">
              <span :class="[{'successRow':item.success},{'errorRow':!item.success}]">{{item.result}}</span>
          </template>
          <template v-slot:item.output="{item}">
              <span :class="[{'successRow':item.success},{'errorRow':!item.success}]">{{item.output}}</span>
          </template>
      </v-data-table>
    </v-card>
</div>
</template>

<script>
import { mapState } from 'vuex'
import RegistryService from '@/services/RegistryService'
import PatientMixin from '@/util/PatientMixin'
import GeneralMixin from '@/util/GeneralMixin'
import xlsx from 'xlsx'
import {format} from 'date-fns'
import {patientDataPreProcess} from '@/components/util/ImportScripts'

export default {
   mixins: [PatientMixin, GeneralMixin],
   data () {
      return {
        loading: false,
        patientsFile: null,
        patientsDataFile: null,
        results: [], // [{result: 'Success', success: true, output: 'Blah'}],
        resultsHeaders: [
                  {
                    text: 'Success?',
                    align: 'center',
                    sortable: true,
                    value: 'result',
                    width: '110'
                  },
                  { text: 'Output', value: 'output' }
        ]
      }
    },
    mounted () {
    },
    computed: {
      ...mapState({
        registry: 'activeRegistry'
      })
    },
    methods: {
      async uploadPatients() {
        this.loading = true
        if (!this.patientsFile) {
          this.showErrorMessage("Please select the file")
          this.loading = false
          return
        } 
        // console.log(this.patientsFile)
          const reader = new FileReader()
            reader.onload = async e =>  {
              var data = e.target.result
              var workbook = xlsx.read(data, {type: 'binary'})
              // let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[0], {
              //   header: 1,
              //   defval: '',
              //   blankrows: true
              // });
                var parsedJson= xlsx.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
                console.log("Found rows: " + parsedJson.length)
                await parsedJson.forEach((item) => {
                  //let item = parsedJson[2]
                  let p = Object.assign({}, item)
                  // pre-processing
                  p = this.patientPreProcess(p)
                  if (p == null) return //skip if preProcess error
                  console.log(p)
                  RegistryService.addPatient(p)
                    .then(reply => {
                        this.results.push({
                            index: 1,
                            result: "Success",
                            success: true,
                            output: `(${reply.id} - MRN: ${reply.mrn}) ${reply.lastName}, ${reply.firstName}, ${reply.middleName} (DOB: ${reply.dob})`
                      })
                    }).catch(err => {
                        this.results.push({ 
                            index: 1,
                            result: "ERROR",
                            success: false,
                            output: `(MRN: ${item.mrn}) ${item.ptName} (DOB: ${item.dob}) | Error: ${this.getErrorMessage(err)}`
                        })
                        if (err && err.response && err.response.status == 500)
                          alert("server error")
                          throw new Error("Server Error")
                    })
                })
                this.loading = false
                //var json_object = JSON.stringify(parsedJson);
                
            }
            reader.readAsBinaryString(this.patientsFile)
      },
      patientPreProcess(p) {
        //screen empties
        if (!p) return null
        if (!p.ptName) return null

        p.registry = this.$store.state.activeRegistry

        //screen date of birth
        if (typeof p.dob == 'number') {//convert from excel date to javascript
          let dateObj = new Date((p.dob - (25567 + 1))*86400*1000)
          p.dob = format(dateObj, "YYYY-MM-DD" )
          //p.dob = dateObj
        }

        //parse name
        let nameLastFirst = p.ptName.trim().split(',')
        if (nameLastFirst.length != 2) {
          this.results.push({index: this.results.length-1, result: "ERROR", success: false,
                                      output: `(MRN: ${p.mrn}) ${p.ptName} (DOB: ${p.dob})  - UNABLE TO SPLIT NAME INTO TWO`
                                      })
          return null
        }

        let nameFirstMiddle = nameLastFirst[1].trim().split(' ')
        if (nameFirstMiddle.length >= 2) {
          p.middleName = nameFirstMiddle[nameFirstMiddle.length-1] //last one bercomes middle name
          nameFirstMiddle.pop()
          p.firstName = nameFirstMiddle.join(' ') //all others become first
        } else {
          p.firstName = nameLastFirst[1]
        }
        p.lastName = nameLastFirst[0]
        return p
      },

      uploadPatientsData() {
        this.loading = true
        if (!this.patientsDataFile) {
          this.showErrorMessage("Please select the file")
          this.loading = false
          return
        } 
        // console.log(this.patientsFile)
          const reader = new FileReader()
            reader.onload = async e =>  {
              var data = e.target.result
              var workbook = xlsx.read(data, {type: 'binary'})
                var parsedJson= xlsx.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
                console.log("Found rows: " + parsedJson.length)
                //console.log(parsedJson)
                await parsedJson.forEach((item) => {
                  //let item = parsedJson.find(x=>{return x.studyId=="BR154"})
                  if (!item) {
                    alert("cannot find item in excel file")
                    this.loading = false
                    return
                  }
                  let p = Object.assign({}, item)
                  // pre-processing
                  if (p == null) {
                    this.results.push({result: "ERROR", success: false, output: 'FAILED TO LOAD PATIENT DATA FROM FILE'})
                  }
                  RegistryService.patientSelect(this.$store.state.activeRegistry.id, {studyId: p.studyId})
                    .then(pt => {
                        pt = patientDataPreProcess(pt, p)
                        RegistryService.updatePatientAllData(pt)
                          .then(() => {
                            this.results.push({ 
                            result: "SUCCESS",
                            success: true,
                            output: `(StudyID: ${pt.studyId} | ${pt.lastName}, ${pt.firstName}) | Updated`
                            })
                          })
                          .catch(error => {
                            this.results.push({ 
                                result: "ERROR",
                                success: false,
                                output: `(StudyID: ${pt.studyId}) | ${pt.lastName}, ${pt.firstName} | CANNOT UPDATE PATIENT | Error: ${this.getErrorMessage(error)}`
                            })
                          })
                    })
                    .catch(err => {
                        this.results.push({ 
                            result: "ERROR",
                            success: false,
                            output: `(StudyID: ${p.studyId}) | CANNOT SELECT THE PATIENT | Error: ${this.getErrorMessage(err)}`
                        })
                        if (err && err.response && err.response.status == 500)
                          alert("server error")
                          throw new Error("Server Error")
                    })
                })
                this.loading = false
                //var json_object = JSON.stringify(parsedJson);
                
            }
            reader.readAsBinaryString(this.patientsDataFile)
      }
    }
  }

            // const reader = new FileReader()
            // reader.onload = e =>  {
            //   var data = e.target.result
            //   var workbook = xlsx.read(data, {
            //     type: 'binary'
            //   })
            //   let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[0], {
            //     header: 1,
            //     defval: '',
            //     blankrows: true
            //   });
            //   alert(sheetData.length)
            // }
            // reader.readAsBinaryString(this.patientsFile)
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.errorRow {
  color: red;
  font-weight: bold;
}
.successRow {
  color: green;
}

</style>

