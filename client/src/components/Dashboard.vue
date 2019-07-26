<template>
  <v-container grid-list-md pa-2 text-xs-center fluid>
    <v-layout row wrap>
      <v-flex shrink>
       <v-card class="">
        <v-toolbar color="blue" dark dense>

            <v-toolbar-title>Select Patient</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-text-field
                v-model="searchText"
                solo
                label="Search Name, Referring Name, PIN"
                class="compact"></v-text-field>

        <v-list two-line>
          <v-list-group
            v-for="(referral, index) in referrals"
            :key="referral.id"
            v-model="referral.active"
            :prepend-icon="referral.action"
            append-icon=""
            no-action
          >

            <template v-slot:activator>
              <v-list-tile
                :key="referral.id"
                ripple
                @click="open(referral)"
                 :class="{item: (index!=referrals.length-1 && activeReferral!=referral)}">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span class="ptName">{{ referral.lastName }}, {{ referral.firstName }}</span>
                    ({{formatDate(referral.dob)}})
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">
                      <span class="subsubtitle">Test: </span>{{referral.testSelected}}
                      <span class="subsubtitle">Referring: </span> {{ referral.referringName }}
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                      <v-icon color="green lighten-2" v-if="referral.clinicDate">check_circle</v-icon>
                      <v-icon color="grey" v-if="!referral.clinicDate">help</v-icon>
                      <span :class="[{schedulePending: !referral.clinicDate}, {scheduleDone: referral.clinicDate}]">
                        <span class="subsubtitle" style="padding-left: 0px;">Clinic Date:</span> {{referral.clinicDate||'(Pending)'}} {{referral.clinicTime||''}}
                        <span class="subsubtitle">Test:</span> {{referral.testDate||'(Pending)'}} {{referral.testTime||''}}
                      </span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-list-tile-action-text>{{fromNow(referral)}}</v-list-tile-action-text>
                  <div class="actionButtonWrapper">

                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn @click.stop="schedule(referral)" icon ripple class="actionButton mr-1" v-on="on">
                          <v-icon
                            color="blue lighten-2">
                            schedule
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Schedule</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn :to="{name: 'edit-referral', params: {referralId: referral.id}}" icon ripple v-on="on" class="actionButton mr-1">
                          <v-icon
                            color="blue lighten-2">
                            edit
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn @click.stop="deleteReferral(referral)" icon ripple class="actionButton" v-on="on">
                          <v-icon
                            color="red lighten-3">
                            delete
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>

                  </div>
                </v-list-tile-action>

              </v-list-tile>
            </template>

            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="text--primary">
                  <span class="subsubtitle">Attending: </span> {{referral.referringAttending}}
                  <span class="subsubtitle">Contact E-mail:</span>{{referral.referringEmail}}
                </v-list-tile-sub-title>
                <v-list-tile-sub-title class="text--primary">
                  <span class="subsubtitle">Date Seen in ER:</span>{{formatDate(referral.dateSeenInER)}}
                  <span class="subsubtitle">Pin:</span>{{referral.pin}}
                </v-list-tile-sub-title>
                <v-list-tile-sub-title class="text--primary">
                  <span class="subsubtitle">Comments: </span> {{referral.comments}}
                </v-list-tile-sub-title>

              </v-list-tile-content>

              <!--v-list-tile-action>
                <v-icon>delete</v-icon>
              </v-list-tile-action-->
            </v-list-tile>
            <v-divider
            :key="index"></v-divider>
          </v-list-group>

        </v-list>
      </v-card>
      </v-flex>


      <v-flex grow>
        <v-card>
          <v-toolbar color="blue" dark dense>
            <v-toolbar-side-icon></v-toolbar-side-icon>

            <v-toolbar-title>Patient Data</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn icon @click="getXLSX">
              <v-icon>get_app</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>check_circle</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card>
      </v-flex>

      <!-- Dialog boxes -------------------------- -->
      <dashboard-schedule-dialog 
      :referral="scheduleReferral" 
      :dialogOpen="scheduleDialog"
      v-on:dialogOpen="scheduleDialog = $event"
      v-on:submitSchedule="submitSchedule($event)">
      </dashboard-schedule-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import ReferralService from '@/services/ReferralService'
import Moment from 'moment'
import _ from 'lodash'
//import XLSX from 'xlsx'
import XLSXDownload from './util/XLSXDownload'

export default {
  data () {
    return {
      patientsSearchResult: [],
      scheduleDialog: false,
      activeReferral: null,
      scheduleReferral: {},
      searchActive: true,
      searchText: ''
    }
  },
  components: {
    DashboardScheduleDialog: () => import('./DashboardScheduleDialog')
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    searchText (search) {
      const route = {
        name: 'dashboard'
      }
      if (this.searchText !== '') {
        route.query = {
          search: this.searchText
        }
      }
      this.$router.push(route)
      this.search()
    },
    '$route.query.search': {
      immediate: true,
      handler (value) {
        this.searchText = value
      }
    }
 
  },
  methods: {
    async deleteReferral (obj) {
      if (confirm(`Are you sure you want to delete ${obj.firstName} ${obj.lastName} referral?`)) {
        try {
          // eslint-disable-next-line no-unused-vars
          const result = await ReferralService.delete(obj)
          this.referrals.splice(this.referrals.indexOf(obj), 1)
        } catch (err) {
          alert(`Error deleting entry: ${err}`)
        }
      }
    },
    fromNow (referral) {
      return new Moment(referral.createdAt).fromNow()
    },
    formatDate (d) {
      return new Moment(d).format('YYYY-MM-DD')
    },
    open (ref) {
      this.activeReferral = ref
    },
    search: _.debounce(async function () {
      this.referrals = (await ReferralService.index(this.searchText)).data
    }, 700),
    schedule(referral) {
      this.scheduleDialog = true
      this.scheduleReferral = referral
    },
    async submitSchedule(scheduleData) {
      var sendReferral = JSON.parse(JSON.stringify(this.scheduleReferral))
      Object.assign(sendReferral, scheduleData)
      try {
        // eslint-disable-next-line no-unused-vars
        const updated = (await ReferralService.put(sendReferral)).data
        this.referrals.splice(this.referrals.indexOf(this.scheduleReferral), 1, updated)
      } catch (err) {
        this.errorMessage = 'Error: ' + err
      }
    },
    async getXLSX() {
      try {
        const all = (await ReferralService.all()).data
        XLSXDownload(document, all)
      } catch (err) {
        alert(err)
      }
      
    }
  },
  async mounted () {
    this.referrals = (await ReferralService.index(this.searchText)).data
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .compact {
    transform: scale(0.875);
    transform-origin: middle;
  }
  .error {
  }
  .ptName {
    font-weight: bold;
  }
  .subsubtitle {
    color: #529a52;
    padding-left: 10px;
  }
  .actionButton {

  }
  .actionButtonWrapper {

  }
  .item {
    border-bottom: 1px solid #e4e4e4;
  }
  .scheduleDone {
    background-color: rgb(235, 255, 242);
    padding: 0px 5px;
    border-radius: 5px;
  }
  .schedulePending {
    background-color: rgb(240, 240, 240);
    padding: 0px 5px;
    border-radius: 5px;
  }
</style>
