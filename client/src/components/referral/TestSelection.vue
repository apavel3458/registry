/* eslint-disable vue/valid-template-root */
<template>
  <v-container fluid grid-list-md class="pt-0">
    <H3>A risk stratification test must be ordered before a patient is seen in this clinic</H3>
    <H3>Please answer the following questions to help us choose the appropriate test:</H3>

            <v-layout row wrap class="text-xs-center">
              <v-flex xs12>
                <div class="question">
                  Does the patient have a baseline LBBB or pacemaker?
                </div>
                <v-radio-group v-model="testSelection.lbbb" row class="yesNo">
                  <v-radio label="Yes" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 v-if="testSelection.lbbb == false">
                <div class="question">
                Can the patient exdercise on a treadmill to reach target HR?
                (Target HR=220-Age)?
                </div>
                <!--v-switch v-model="testSelection.exertion" class="yesNo" :label="`${yesNo(testSelection.exertion)}`"></v-switch-->
                <v-radio-group v-model="testSelection.exertion" row class="yesNo">
                  <v-radio label="Yes" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 v-if="testSelection.lbbb == true || testSelection.exertion == false">
                <div class="question">
                Does the patient have moderate-to-severe asthma?
                </div>
                <v-radio-group v-model="testSelection.asthma" row  class="yesNo">
                  <v-radio label="Yes" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 v-if="showESE()">
                <panel title="Recommend Exercise Stress Echo" align-center="true" bar-colour="green darken-1">
                  <v-flex xs12 sm6 offset-sm3>
                  <!--ol class="instructionList">
                    <li>Log into powerchart</li>
                    <li>Select 'Stress Echo' order</li>
                    <li>In the patient info section write "for chest pain clinic"</li>
                    <li>Click "Submit Form" at the bottom of this form to send us this information</li>
                  </ol-->
                  </v-flex>
                </panel>
              </v-flex>
              <v-flex xs12 v-if="showMIBI()">
                <panel title="Recommend Nuclear Stress Test" align-center="true" bar-colour="deep-purple">
                  &nbsp;
                </panel>
              </v-flex>
              <v-flex xs12 v-if="showConsult()">
                <panel title="Recommend Cardiology consultation prior to stress test" align-center="true" bar-colour="red darken-4">
                    <H3>This patient has factors not amenable to stress testing.  Recommend consultation with a Cardiologist for an anatomic test such as coronary CT or angiography.</h3>
                </panel>
              </v-flex>
            </v-layout>

    <v-divider></v-divider>
     <v-flex xs12 sm6 offset-sm3>
        <v-select
          v-model="testSelected"
          :items="testOptions"
          :menu-props="{ maxHeight: '400' }"
          label="Select Manually (not recommended)"
          hint="Test Selection"
          persistent-hint>
        </v-select>
     </v-flex>
  </v-container>
</template>

<script>
// import _ from 'lodash'

export default {
  data () {
    return {
      testSelection: {
        lbbb: null,
        exertion: null,
        asthma: null
      },
      testSelected: null,
      testOptions: [
        'Exercise Stress Echo', 'Nuclear Stress MIBI'
      ]
    }
  },
  props: [
    'eventBus'
  ],
  components: {},
  watch: {
    testSelected (newVal) {
      this.$emit('selectTest', newVal)
      // alert('emitted')
    }
  },
  methods: {
    yesNo (val) {
      if (val) {
        return 'Yes'
      } else if (val === false) {
        return 'No'
      } else {
        return 'Select'
      }
    },
    showESE () {
      if ((this.testSelection.lbbb === false && this.testSelection.exertion === true)) {
        this.testSelected = this.testOptions[0]
        return true
      }
      return false
    },
    showMIBI () {
      if ((this.testSelection.lbbb === true || this.testSelection.exertion === false) && (this.testSelection.asthma === false)) {
        this.testSelected = this.testOptions[1]
        return true
      }
      return false
    },
    showConsult () {
      if ((this.testSelection.lbbb === true || this.testSelection.exertion === false) && (this.testSelection.asthma === true)) {
        this.testSelected = null
        return true
      } else {
        return false
      }
    }
  },
  created: function () {
    this.eventBus.$on('resetTestSelection', () => {
      for (var i in this.testSelection) {
        this.testSelection[i] = null
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.yesNo {
  display: inline-block;
  margin-left: 10px;
}
.instructionList {
  text-align: left;
}
.yesNo {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
