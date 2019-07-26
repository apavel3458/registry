/* eslint-disable vue/valid-template-root */
<template>
  <div>
  <v-container grid-list-md text-xs-center>
  <v-layout row>
    <v-flex xs12 sm10 offset-sm1 wrap>
      <panel title="Edit Referral" alignCenter="true" color="white" class="panel">
        <patient-info v-bind:pt="referral" :eventBus="eventBus" @validated="ptInfoValid = $event"></patient-info>
        <v-select
          :items="testOptions"
          v-model="referral.testSelected"
          label="Select Test"
        ></v-select>
      <v-layout>
        <v-flex xs12>
          <v-alert
            :value="successMessage"
            color="success"
            icon="check_circle"
            outline
            dismissible
            style="width: 70%"
          >
            {{successMessage}}
          </v-alert>
          <v-alert
            :value="errorMessage"
            color="error"
            icon="warning"
            outline
            dismissible
            style="width: 70%"
          >
            {{errorMessage}}
          </v-alert>
          <v-btn hover :to="{name: 'dashboard'}">Back to List</v-btn>
          <v-btn color="primary" hover @click="save()">Save</v-btn>
        </v-flex>
      </v-layout>

      </panel>
    </v-flex>
  </v-layout>
  </v-container>
  </div>
</template>

<script>
import ReferralService from '@/services/ReferralService'
import PatientInfo from './PatientInfo'
import Vue from 'vue'

export default {
  data () {
    return {
      referral: {},
      eventBus: new Vue(),
      patientInfoValid: null,
      successMessage: null,
      errorMessage: null,
      testOptions: [
        'Exercise Stress Echo', 'Nuclear Stress MIBI'
      ]
    }
  },
  components: { PatientInfo },
  methods: {
    validatePtInfo () {
      this.eventBus.$emit('validatePtInfoEvent')
      return this.patientInfoValid
    },
    async save () {
      try {
        // eslint-disable-next-line no-unused-vars
        const updated = (await ReferralService.put(this.referral)).data
        this.successMessage = 'Saved successfully!'
      } catch (err) {
        this.errorMessage = 'Error: ' + err
      }
    }
  },
  async mounted () {
    try {
      const referralId = this.$store.state.route.params.referralId
      this.referral = (await ReferralService.show(referralId)).data
    } catch (err) {
      alert('Error: ' + err)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panel {
  background-color: white;
}
</style>
