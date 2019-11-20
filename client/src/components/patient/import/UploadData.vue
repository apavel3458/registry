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
      <v-progress-linear
        :value="progress"
        v-show="progress && progress < 100"
        height="10"
        striped
        color="deep-orange"
      ></v-progress-linear>
      <v-toolbar dense elevation="2" color="grey lighten-4">
        <v-toolbar-title>Results: (Records processed: {{results.length}})</v-toolbar-title>

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
import {patientDataPreProcess, patientPreProcess} from '@/components/util/ImportScripts'

export default {
   mixins: [PatientMixin, GeneralMixin],
   data () {
      return {
        loading: false,
        patientsFile: null,
        patientsDataFile: null,
        results: [], // [{result: 'Success', success: true, output: 'Blah'}],
        totalItems: 0,
        progress: 0,
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
    watch: {
      results(oldV, newV) {
        let newProgress = Math.round((newV.length/this.totalItems)*10)*10+10 //round to nearest 10
        if (newProgress == this.progress) return
        else {
          this.progress = newProgress
        }
      }
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
                this.totalItems = parsedJson.length
                console.log("Found rows: " + this.totalItems)
                await parsedJson.forEach((item) => {
                  //let item = parsedJson[2]
                  let p = Object.assign({}, item)
                  // pre-processing
                  let target = patientPreProcess(p, this.$store.state.activeRegistry)
                  if (target == null || target.success === false) {
                    this.results.push(target)
                    return
                  }
                  console.log(target)
                  RegistryService.addPatient(target)
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
                this.totalItems = parsedJson.length
                //console.log(parsedJson)
                await parsedJson.forEach((item) => {
                  //let item = parsedJson.find(x=>{return x.studyId=="BR132"})
                  if (!item) {
                    alert("cannot find item in excel file")
                    this.loading = false
                    return
                  }
                  // pre-processing
                  if (item == null) {
                    this.results.push({result: "ERROR", success: false, output: 'FAILED TO LOAD PATIENT DATA FROM FILE'})
                    return null
                  }
                  RegistryService.patientSelect(this.$store.state.activeRegistry.id, {studyId: item.studyId})
                    .then(pt => {
                      console.log("found: " + pt)
                      if (!pt) {
                        this.results.push({result:"ERROR", success: false, output: `(StudyId: ${item.studyId}) | CANNOT FIND PATIENT`})
                        return null
                      }
                      pt = patientDataPreProcess(pt, item)
                      if (pt.success === false) {
                        this.results.push(pt)
                        return null
                      }
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
                            output: `(StudyID: ${item.studyId}) | CANNOT SELECT THE PATIENT | Error: ${this.getErrorMessage(err)}`
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

