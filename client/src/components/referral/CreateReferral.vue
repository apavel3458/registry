<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1>
        <v-stepper v-model="e1" non-linear>
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1" editable>Introduction</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2" editable>Patient Info</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 3" step="3" editable>Test Selection</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="4">Submit</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
             <!-- STEP 1 --------------------------------------------STEP 1 -->
            <v-stepper-content step="1">
              <v-card
                class="mb-5"
                color="grey lighten-4"

              >
              <introduction></introduction>

              <v-dialog
                v-model="dialog"
                width="800"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="indigo"
                    dark
                    v-on="on"
                    class="introButton"
                  >
                    Use Risk Stratification Tool
                  </v-btn>

                </template>

                <v-card>
                  <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                  >
                    Risk Stratify Patient using HEART Score
                  </v-card-title>

                  <v-card-text>
                    <heart-score></heart-score>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      flat
                      @click="dialog = false"
                    >
                      Finished
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <br/>

              <v-btn
                color="primary"
                class="introButton"
                @click="e1 = 2">
                Begin Referral
              </v-btn>

              </v-card>

            </v-stepper-content>
            <!-- STEP 2 --------------------------------------------STEP 2 -->
            <v-stepper-content step="2">
              <v-card
                class="mb-1"
                color="grey lighten-5">
              <panel title="Cardiology Referral Form">
                <patient-info v-bind:pt="pt" :eventBus="eventBus" @validated="ptInfoValid = $event"></patient-info>
              </panel>

              </v-card>

              <v-btn hover @click="e1 = 1">Back</v-btn>
              <v-btn hover @click="reset(true)">Reset Form</v-btn>
              <v-btn hover
                color="primary"
                @click="validatePtInfo()">
                Next
              </v-btn>
            </v-stepper-content>

             <!-- STEP 3 --------------------------------------------STEP 3 -->

            <v-stepper-content step="3">
              <v-card
                class="mb-1"
                color="grey lighten-5">
                <test-selection @selectTest="updateTest" :eventBus="eventBus"></test-selection>
              </v-card>
              <v-btn hover @click="e1 = 2">Back</v-btn>
              <v-btn hover @click="reset(true)">Reset Form</v-btn>
              <v-btn hover
                color="primary"
                @click="e1 = 4"
              >
                Continue
              </v-btn>
            </v-stepper-content>

             <v-stepper-content step="4">
              <v-card
                class="mb-1"
                color="grey lighten-5">
                <v-flex xs12>
                  <h3>Please review information below and click SUBMIT.</h3>
                  <h3>You can go back and make changes to the data if needed.</h3>
                </v-flex>
                <summary-view v-bind:patient="pt"></summary-view>

              </v-card>

              <v-alert
                :value="errorMessage"
                color="error"
                icon="warning"
                outline>
                Error: {{errorMessage}}
              </v-alert>

              <v-btn hover @click="e1 = 3">Back</v-btn>
              <v-btn hover @click="reset(true)">Reset Form</v-btn>
              <v-btn hover
                color="primary"
                @click="submit()">
                Submit Form
              </v-btn>
            </v-stepper-content>

             <v-stepper-content step="5">
              <v-card
                class="mb-1"
                color="grey lighten-5">
                  <v-alert
                    :value="successReferenceId"
                    color="success"
                    icon="check_circle"
                    class="message"
                    outline>
                    <H3>Success, referral sent! Reference ID: {{this.successReferenceId}}</H3>
                  </v-alert>

              </v-card>

              <v-btn hover @click="reset(true)">Back to Home Page</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import HeartScore from '@/components/referral/HeartScore'
import Introduction from '@/components/referral/Introduction'
import PatientInfo from '@/components/referral/PatientInfo'
import TestSelection from '@/components/referral/TestSelection'
import SummaryView from '@/components/referral/SummaryView'
import ReferralService from '@/services/ReferralService'
import Vue from 'vue'

export default {
  data () {
    return {
      pt: {
        lastName: null,
        firstName: null,
        dob: null,
        pin: null,
        referringName: null,
        referringEmail: null,
        referringAttending: null,
        dateSeenInER: new Date().toISOString().substr(0, 10),
        comments: null,
        testSelected: null
      },
      ptInfoValid: null,
      e1: 1,
      steps: null,
      dialog: null,
      eventBus: new Vue(),
      successReferenceId: null,
      errorMessage: null

    }
  },
  components: {HeartScore, Introduction, PatientInfo, TestSelection, SummaryView},
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    e1 () {
      if (this.e1 === 1) {
        this.referenceId = null
        this.errorMessage = null
      }
    }
  },
  methods: {
    updateTest (val) {
      // alert('updatetest')
      this.pt.testSelected = val
    },
    save (date) {
      this.referenceId = null
      this.errorMessage = null
      this.$refs.menu.save(date)
    },
    reset (backToStart) {
      if (backToStart) {
        this.e1 = 1
      }
      for (var i in this.pt) {
        this.pt[i] = null
      }
      this.eventBus.$emit('resetPtInfo')
      this.eventBus.$emit('resetTestSelection')
      this.referenceId = null
      this.errorMessage = null
    },
    async submit () {
      // call API
      try {
        const response = await ReferralService.post(this.pt)
        this.successReferenceId = response.data.id
        // this.successReferenceId = 5 //for tests

        // throw new Exception() //test
        this.reset(false)
        this.e1 = 5
      } catch (err) {
        this.errorMessage = err
        // console.log(err)
      }
    },
    validatePtInfo () {
      // this.e1 = 3
      this.eventBus.$emit('validatePtInfoEvent')
      if (this.ptInfoValid) {
        this.e1 = 3
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3, h2 {
  font-weight:normal;
}
.introButton {
  margin-top: 20px;
  margin-bottom: 20px;
}
.message {
  font-weight: bold;
}
</style>
