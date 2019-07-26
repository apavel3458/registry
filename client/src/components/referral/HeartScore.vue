/* eslint-disable vue/valid-template-root */
<template>

  <v-container fluid grid-list-md class="pt-0">
    <v-layout row wrap>
      <v-flex d-flex xs12 text-center>
          <h3>Symptoms</h3>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': symptomsButtonSelected == 0 }">
        <v-card hover dark color="indigo lighten-2"

          @click="setSymptoms(0, 0)">
          <!--v-card-title primary class="title">Lorem</v-card-title-->
          <v-card-text class="pl-1 pr-1 pt-1">
            Slightly Suspicious <div class="score">0</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': symptomsButtonSelected == 1 }">
        <v-card hover color="indigo lighten-2" dark
          @click="setSymptoms(1, 1)">
          <v-card-text class="pl-1 pr-1 pt-1">
            Moderately Suspicious
            <div class="score">1</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': symptomsButtonSelected == 2 }">
        <v-card hover color="indigo lighten-2" dark
          @click="setSymptoms(2, 2)">
          <v-card-text class="pl-1 pr-1 pt-1">
            Highly Suspicious
            <div class="score">2</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-divider></v-divider>

    <v-layout row wrap>
      <v-flex d-flex xs12 text-center>
          <h3>ECG Changes</h3>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': ecgButtonSelected == 0 }">
        <v-card hover dark color="blue lighten-2"
          @click="setECG(0, 0)">
          <!--v-card-title primary class="title">Lorem</v-card-title-->
          <v-card-text class="pl-1 pr-1 pt-1">
            Normal <div class="score">0</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': ecgButtonSelected == 1 }">
        <v-card hover color="blue lighten-2" dark
          @click="setECG(1, 1)">
          <v-card-text class="pl-1 pr-1 pt-1">
            Non-specific repolarization disturbance
            <div class="score">1</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': ecgButtonSelected == 2 }">
        <v-card hover color="blue lighten-2" dark
          @click="setECG(2, 2)">
          <v-card-text class="pl-1 pr-1 pt-1">
            Significant ST deviation (not due to LVH or LBBB)
            <div class="score">2</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm6 offset-sm3 :class="{'activeButton': ecgButtonSelected == 3 }">
        <v-card hover color="blue lighten-2" dark
          @click="setECG(3, 1)">
          <v-card-text class="pl-1 pr-1 pt-1">
            No ST deviation but LBBB, LVH, repol. changes
            <div class="score">1</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-divider></v-divider>

    <v-layout row wrap class="mt-2">
      <v-flex d-flex xs12 sm4 :class="{'activeButton': ageButtonSelected == 0 }">
        <v-card hover dark color="deep-purple lighten-2"
          @click="setAge(0, 0)">
          <!--v-card-title primary class="title">Lorem</v-card-title-->
          <v-card-text class="pl-1 pr-1 pt-1">
            Age &lt;45 <div class="score">0</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': ageButtonSelected == 1 }">
        <v-card hover color="deep-purple lighten-2" dark
          @click="setAge(1, 1)">
          <v-card-text class="pl-1 pr-1 pt-1">
            Age 45-64
            <div class="score">1</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': ageButtonSelected == 2 }">
        <v-card hover color="deep-purple lighten-2" dark
          @click="setAge(2, 2)">
          <v-card-text class="pl-1 pr-1 pt-1">
            Age &gt;65
            <div class="score">2</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

 <v-divider></v-divider>

    <v-layout row wrap>
      <v-flex d-flex xs12 text-center>
          <h3>Risk Factors</h3>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': rfButtonSelected == 0 }">
        <v-card hover dark color="teal lighten-2"
          @click="setRf(0, 0)">
          <!--v-card-title primary class="title">Lorem</v-card-title-->
          <v-card-text class="pl-1 pr-1 pt-1">
            No Risk Factors <div class="score">0</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': rfButtonSelected == 1 }">
        <v-card hover color="teal lighten-2" dark
          @click="setRf(1, 1)">
          <v-card-text class="pl-1 pr-1 pt-1">
            1-2 Risk Factors
            <div class="score">1</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': rfButtonSelected == 2 }">
        <v-card hover color="teal lighten-2" dark
          @click="setRf(2, 2)">
          <v-card-text class="pl-1 pr-1 pt-1">
            &ge; 3 risk factors or prior hx of coronary disease
            <div class="score">2</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-divider></v-divider>

    <v-layout row wrap>
      <v-flex d-flex xs12 text-center>
          <h3>Troponin</h3>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': trpButtonSelected == 0 }">
        <v-card hover dark color="blue-grey lighten-2"
          @click="setTrp(0, 0)">
          <!--v-card-title primary class="title">Lorem</v-card-title-->
          <v-card-text class="pl-1 pr-1 pt-1">
            &le; Normal Limit <div class="score">0</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': trpButtonSelected == 1 }">
        <v-card hover color="blue-grey lighten-2" dark
          @click="setTrp(1, 1)">
          <v-card-text class="pl-1 pr-1 pt-1">
            1-3x Normal Limit
            <div class="score">1</div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm4 :class="{'activeButton': trpButtonSelected == 2 }">
        <v-card hover color="blue-grey lighten-2" dark
          @click="setTrp(2, 2)">
          <v-card-text class="pl-1 pr-1 pt-1">
            >3x Normal Limit
            <div class="score">2</div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex d-flex xs12>
        <v-card hover color="white lighten-2" light
          @click="setTrp(2, 2)">
          <v-card-text class="pl-1 pr-1 pt-1 pb-1">
            <h3 class="subheading font-weight-black mb-0"><span :class="recommendationClass" v-html="recommendation"></span></h3>
            HEART Score is: {{score}} Risk of MACE is {{maceRisk}}
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>

</template>

<script>

export default {
  data () {
    return {
      symptoms: null,
      symptomsButtonSelected: null,
      ecg: null,
      ecgButtonSelected: null,
      age: null,
      ageButtonSelected: null,
      rf: null,
      rfButtonSelected: null,
      trp: null,
      trpButtonSelected: null
    }
  },
  computed: {
    score: function () {
      let finalscore = this.symptoms + this.ecg + this.age + this.rf + this.trp
      return finalscore
    },
    maceRisk: function () {
      if (this.score <= 3) return '0.9-1.7%'
      else return '12-16.6%'
    },
    recommendation: function () {
      if (this.symptoms == null || this.ecg == null || this.age == null || this.rf == null || this.trp == null) {
        return 'Please complete the above questions'
      }
      if (this.score > 3) {
        return 'Recommend inpatient cardiology consultation'
      } else if (this.trp > 0) {
        return 'Recommend inpatient cardiology consultation (Positive Troponin)'
      } else {
        return 'Appropriate for outpatient management'
      }
    },
    recommendationClass: function () {
      if (this.symptoms == null || this.ecg == null || this.age == null || this.rf == null || this.trp == null) {
        return {neutral: true}
      }
      if (this.score > 3 || this.trp > 0) {
        return {bad: true}
      } else {
        return {good: true}
      }
    }
  },
  methods: {
    setSymptoms (id, score) {
      this.symptoms = score
      this.symptomsButtonSelected = id
    },
    setECG (id, score) {
      this.ecg = score
      this.ecgButtonSelected = id
    },
    setAge (id, score) {
      this.age = score
      this.ageButtonSelected = id
    },
    setRf (id, score) {
      this.rf = score
      this.rfButtonSelected = id
    },
    setTrp (id, score) {
      this.trp = score
      this.trpButtonSelected = id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.active {
  color: red;
}
.score {
  position: absolute;
  bottom: 1px;
  left: 0;
  right: 0;
  font-size: 0.8rem;
  margin-left: auto;
  margin-right: auto;
}
.good {
  color: rgb(38, 208, 38);
}
.bad {
  color: rgb(236, 88, 88);
}
.neutral {
  color: rgb(130, 130, 130);
}
.activeButton {
  background-color: #f56161;
}
</style>
