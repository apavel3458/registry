<template>
      <v-dialog
      v-model="openDialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">Schedule Appointment</v-card-title>
        
        <v-card-text>
          <v-layout row>
            <v-flex xs12 sm6 class="mr-4">
              <v-text-field
                label="Clinic Date"
                v-model="schedule.clinicDate"
                type="date"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                label="Clinic Time"
                v-model="schedule.clinicTime"
                type="time"
              ></v-text-field>
            </v-flex>
          </v-layout>
        <v-layout row color="red">
            <v-flex xs12 sm6 class="mr-4" color="red">
              <v-text-field
                label="Test Date"
                v-model="schedule.testDate"
                type="date"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                label="Test Time"
                v-model="schedule.testTime"
                type="time"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
      
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="submitSchedule()"
          >
            Submit
          </v-btn>

            <v-btn
            color="green darken-1"
            flat="flat"
            @click="clearSchedule()"
          >
            Clear
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="openDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import Moment from 'moment'
import _ from 'lodash'
export default {
    data() {
        return {
            scheduleNew: {
                clinicDate: '',
                clinicTime: '',
                testDate: '',
                testTime: '',
            },
            schedule: {},
            openDialog: JSON.parse(JSON.stringify(this.dialogOpen))
        }
    },
    props: [
        'referral',
        'dialogOpen'
    ],
    methods: {
        formatDate (d) {
            const ndate = new Moment(d)
            if (!ndate.isValid()) {
                return '---'
            } else {
                return ndate.format('YYYY-MM-DD')
            }
        },
        submitSchedule() {
            this.$emit('submitSchedule', this.schedule)
            this.openDialog = false
        },
        clearSchedule() {
            this.schedule = this.scheduleNew
        }
    },
    watch: {
        dialogOpen(val) {
            this.openDialog = val
            this.schedule = _.pick(this.referral, ['clinicDate', 'clinicTime', 'testDate', 'testTime'])
        },
        openDialog(val) {
            this.$emit('dialogOpen', val)
        }
    },
    mounted() {
        this.schedule = this.scheduleNew
    }
    

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
