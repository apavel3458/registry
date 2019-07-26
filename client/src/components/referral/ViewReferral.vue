/* eslint-disable vue/valid-template-root */
<template>
  <div>
  <v-layout row>
    <v-flex xs12 md8 offset-md2 wrap>
      <panel title="View Referral" alignCenter="true" color="white" class="panel">
        <summary-view :patient="referral"></summary-view>
      </panel>
    </v-flex>
  </v-layout>
  <v-layout>
    <v-flex xs12>
      <v-btn color="primary" hover :to="{name: 'dashboard'}">Back to List</v-btn>
    </v-flex>
  </v-layout>
  </div>
</template>

<script>
import ReferralService from '@/services/ReferralService'
import SummaryView from '@/components/referral/SummaryView'

export default {
  data () {
    return {
      referral: {}
    }
  },
  components: { SummaryView },
  async mounted () {
    const referralId = this.$store.state.route.params.referralId
    this.referral = (await ReferralService.show(referralId)).data
    // console.log(this.referral)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panel {
  background-color: white;
}
</style>
