<template>
  <div>
    <v-list two-line>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ patient.lastName }}, {{ patient.firstName }}
            <span
              class="missing"
              v-if="!patient.lastName || !patient.firstName"
            >
              MISSING DATA
            </span>
            <span class="gender" v-if="patient.gender">
              ({{ patient.gender }})
            </span>
          </v-list-item-title>
          <v-list-item-subtitle>Name (Gender)</v-list-item-subtitle>
        </v-list-item-content>

        <!-- <v-list-item-action>
              <v-icon>chat</v-icon>
            </v-list-item-action> -->
      </v-list-item>

      <v-list-item>
        <v-list-item-content @click="copy(patient.mrn)" style="cursor: pointer">
          <v-list-item-title style="cursor: pointer">
            {{ patient.mrn }}
            <span v-if="patient.studyId" @click.stop="copy(patient.studyId)">
              ({{ patient.studyId }})
            </span>
          </v-list-item-title>
          <v-list-item-subtitle>
            Medical Record # (Study ID)
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <template v-if="patient.dob">
              {{ patient.dob }} (Age {{ age(patient.dob) }})
            </template>
            <span class="missing" v-if="!patient.dob">MISSING</span>
          </v-list-item-title>
          <v-list-item-subtitle>Date of Birth</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="patient.deceasedDate" class="">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold red--text">
            DECEASED: {{ patient.causeOfDeath }}
          </v-list-item-title>
          <v-list-item-subtitle class="font-weight-bold red--text">
            {{ patient.deceasedDate }} (Age
            {{ age(patient.dob, patient.deceasedDate) }})
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item class="grey lighten-3">
        <v-list-item-content>
          <v-list-item-title>{{ patient.createdAt }}</v-list-item-title>
          <v-list-item-subtitle>Date Created</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="grey lighten-3">
        <v-list-item-content>
          <v-list-item-title>{{ patient.createdBy }}</v-list-item-title>
          <v-list-item-subtitle>Created By</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import PatientMixin from '@/util/PatientMixin'
import { mapState } from 'vuex'
import GeneralMixin from '@/util/GeneralMixin.js'

export default {
  data() {
    return {}
  },
  mixins: [PatientMixin, GeneralMixin],
  computed: {
    ...mapState({
      patient: 'activePatient',
    }),
  },
  watch: {},
  methods: {
    copy(text) {
      var dummy = document.createElement('textarea')
      document.body.appendChild(dummy)
      dummy.value = text
      // dummy.setSelectionRange(0, 99999); /* For mobile devices */
      dummy.select()
      document.execCommand('copy')
      document.body.removeChild(dummy)
      this.showSuccess(`Copied ${text} to clipboard`)
    },
  },
  mounted() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.missing {
  font-weight: bold;
  color: red;
}
.deceased {
  color: red;
}
.gender {
  color: grey;
}
</style>
