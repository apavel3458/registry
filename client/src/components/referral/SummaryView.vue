/* eslint-disable vue/valid-template-root */
<template>
  <div>
  <v-layout wrap align-top>
    <v-flex xs12 md6 class="infoBox">
      <div class="head">
        {{ patient.lastName }}, {{ patient.firstName }}
      </div>
      <div class="subhead">
        <span class="subsubhead"><span class="infoHeader">DOB:</span> {{ patient.dob }}</span><br/>
        <span class="subsubhead"><span class="infoHeader">LHSC PIN:</span>{{ patient.pin }}</span>
      </div>
    </v-flex>
    <v-flex xs12 md6 class="infoBox">
      <div class="head2">
        Referring: {{ patient.referringAttending }}
      </div>
      <div class="subhead">
        <span class="subsubhead"><span class="infoHeader">Referring Name:</span> {{patient.referringName}}</span><br/>
        <span class="subsubhead"><span class="infoHeader">Referring Email:</span>({{ patient.referringEmail }})</span>
        <br/>
        <span class="subsubhead"><span class="infoHeader">Date Seen in ER:</span>{{patient.dateSeenInER }}</span>
      </div>
    </v-flex>

    <v-flex xs12 md6 infoBox>
      <div class="head2">
        {{ patient.testSelected }}
      </div>
      <div class="subhead">
        <span class="subsubhead"><span class="infoHeader">Instructions to follow</span></span>
      </div>
    </v-flex>
    <v-flex xs12 md6 infoBox>
      <div class="head2">
        Comments:
      </div>
      <div class="subhead">
        {{patient.comments}}
      </div>
    </v-flex>

  </v-layout>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  props: {
    patient: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate (d) {
      return moment(d, 'YYYY-MM-DD')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.infoBox {
  text-align: left;
  margin: 10px auto;
}
.head {
  font-weight: bold;
  font-size: 1.2rem;
  margin-left: 20px;
}
.head2 {
  font-weight: bold;
  margin-left: 20px;
}
.subhead {
  color: grey;
  margin-left: 40px;
}
.subsubhead {
  white-space: nowrap;
}
.centerText {
  text-align: center; width: 100%; display:inline-block
}
.infoHeader {
  font-weight: bold;
  padding-right: 5px;
  padding-left: 5px;
}
.listBox {
  background-color: transparent;
}

</style>
