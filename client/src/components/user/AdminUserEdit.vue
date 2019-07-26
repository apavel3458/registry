<template>
<div>
    <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field label="Username" v-model="user.username" autocomplete="off"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Password*" type="password" v-model="user.password"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="First Name" required v-model="user.firstName"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Last Name"
                  required
                  v-model="user.lastName"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" required v-model="user.email"></v-text-field>
              </v-flex>
              
              <v-flex xs4>
                <v-text-field label="Login Count" type="text" disabled v-model="user.loginCount"></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field label="Active" type="text" disabled v-model="user.active"></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field label="Login Attempts" type="text" disabled v-model="user.loginAttempts"></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field label="Date Created" type="text" disabled :placeholder="formatDate(user.createdAt)"></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field label="Date Updated" type="text" disabled :placeholder="formatDate(user.updatedAt)"></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field label="Last Login" type="text" disabled :placeholder="formatDate(user.lastLogin)"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                    v-model="user.usergroups"
                    :items="groups"
                    item-text="groupName"
                    return-object
                    chips
                    label="Groups"
                    multiple
                    solo
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
</div>
</template>

<script>
import Moment from 'moment'
export default {
    props: {
        user: {
            type: Object,
            required: true
        },
        groups: {
            type: Array,
            required: false,
            defaultValue: []
        }
  },
    data() {
        return {
        }
    },
    watchers: {
    },
    methods: {
        formatDate (d) {
            var ndate = new Moment(d)
            if (!ndate.isValid()) {
              return '????'
            } else {
                return ndate.format('YYYY-MM-DD HH:MM:SS')
            }
        },
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
