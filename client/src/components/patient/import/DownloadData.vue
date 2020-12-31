/* eslint-disable vue/valid-template-root */
<template>
<div>
    <v-row>
        <v-col xs="12" class="pb-0">
              <v-alert
                text
                type="info"
                icon="mdi-alert-circle"
                class="mx-3"
              >
                  This is a data download tool
              </v-alert>
        </v-col>
    </v-row>
    <v-row>
        <v-col xs="12" class="pb-0">
              <v-alert
                text
                v-if="status"
                :type="statusCode"
                icon="mdi-alert-circle"
                class="mx-3"
              >
                  {{status}}
              </v-alert>
        </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" md="6" class="pt-0">
        <v-card ref="patients" class="ml-3 pa-3 mt-0">
          <v-form>
          <H3 class="ml-2">Download Patients</H3>

          <div class="text-center"><v-btn color="info" :loading="loading" :disabled="loading" class="text-center" @click="download()">Execute!</v-btn></div>
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
import * as XLSXDownload from '@/components/util/XLSXDownload.js'

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
        ],
        status: null,
        statusCode: 'info'
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
      async download () {
         const start = window.performance.now();
         try {
            this.loading = true
            const reply = await RegistryService.downloadAllData(this.$store.state.activeRegistry.id)
            const data = reply
            const end = window.performance.now();
            this.status = `Successfully downloaded ${reply.length} records. Executing time: ${Math.round(end - start)}ms`
            this.statusCode = 'success'
            XLSXDownload.convertRecordXlsx(document, data)
         } catch (e) {
            console.log(e)
            const end = window.performance.now();
            this.status = `Error encoungered. Execution time: ${Math.round(end - start)}ms`
            this.statusCode = 'error'
         }
         this.loading = false
         
         // let csv = 'Put,Column,Titles,Here\n';
         // this.csvdata.forEach((row) => {
         //          csv += row.join(',');
         //          csv += "\n";
         // });
      
         // const anchor = document.createElement('a');
         // anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
         // anchor.target = '_blank';
         // anchor.download = 'nameYourFileHere.csv';
         // anchor.click();
      }
    }
  }
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

