/* eslint-disable vue/valid-template-root */
<template>

                <v-form name="patientInfo" ref="patientInfo" v-model="valid" autocomplete="off">
                  <v-layout row wrap>
                    <v-flex xs12 sm6>
                        <v-text-field
                            label="Patient's Last Name"
                            type="text"
                            required
                            :rules="[() => !!pt.lastName || 'This field is required']"
                            v-model="pt.lastName">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-text-field
                            label="Patient's First Name"
                            type="text"
                            required
                            :rules="[() => !!pt.firstName || 'This field is required']"
                            v-model="pt.firstName">
                        </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6 sm6>
                        <!--v-text-field
                            label="Patient's DOB"
                            type="date"
                            v-model="dob">
                        </v-text-field-->
                        <v-text-field
                            v-model="pt.dob"
                            label="Date of Birth (YYYY-MM-DD)"
                            prepend-icon="event"
                            required
                            return-masked-value
                            :rules="[() => !!pt.dob || 'This field is required']"
                            mask="####-##-##"
                          ></v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6>
                        <v-text-field
                            label="LHSC PIN (if known)"
                            type="text"
                            v-model="pt.pin">
                        </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6 sm6>
                        <v-text-field
                            label="Your Name"
                            required
                            :rules="[() => !!pt.referringName || 'This field is required']"
                            type="text"
                            v-model="pt.referringName">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6>
                        <v-text-field
                            label="Contact E-mail (if more info needed)"
                            type="email"
                            required
                            :rules="emailRules"
                            v-model="pt.referringEmail">
                        </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6 sm6>
                        <v-text-field
                            label="Referring Attending (if different)"
                            type="text"
                            v-model="pt.referringAttending">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs6 sm6>
                        <!--v-text-field
                            label="Date Seen in ER"
                            type="date"
                            v-model="dateSeenInER">
                        </v-text-field-->

                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="pt.dateSeenInER"
                              label="Date Seen in ER"
                              prepend-icon="event"
                              readonly
                              return-masked-value
                              :rules="[() => !!pt.dateSeenInER || 'This field is required']"
                              mask="####-##-##"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="pt.dateSeenInER" @input="menu2 = false"></v-date-picker>
                        </v-menu>

                        <!--v-date-picker v-model="dateSeenInER" :landscape="landscape" :reactive="reactive"></v-date-picker-->
                    </v-flex>
                    <v-flex xs12>
                      <v-textarea
                        outline
                        name="input-7-4"
                        v-model="pt.comments"
                        label="Comments/History"
                        value=""
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-form>
</template>

<script>

export default {
  props: [
    'pt', 'eventBus'
  ],
  data () {
    return {
      menu: null,
      menu2: null,
      valid: null,
      /*
      rules: {
        required: [
          v => !!v || 'Required Field'
        ],
        email: [
          v => /.+@.+/.test(v) || 'Bad email'
        ]
      }, */
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      nameRules: [
        v => (v && v.length > 2 && v.length <= 30) || 'Name must be valid between 2 and 30 characters'
      ]
    }
  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date)
    },
    validate () {
      return this.$refs.patientInfo.validate()
    }
  },
  next () {
    if (this.$refs.patientInfo.validate()) {
      this.snackbar = true
    }
  },
  created () {
    this.eventBus.$on('validatePtInfoEvent', () => {
      this.validate()
      this.$emit('validated', this.valid)
    })
    this.eventBus.$on('resetPtInfo', () => {
      this.$refs.patientInfo.reset()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* eslint-disable-next-line css-ruleorselectorexpected*/
>>> .theme--light.v-text-field--outline>.v-input__control>.v-input__slot {
  border: 1px solid rgb(151, 151, 173);
}
</style>
