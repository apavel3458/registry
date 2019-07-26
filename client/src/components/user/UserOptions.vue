/* eslint-disable vue/valid-template-root */
<template>
  <v-container grid-list-md text-xs-center>
    <v-layout  wrap>
      <v-flex class="xs8 offset-xs2">
        <panel title="User Options" alignCenter="true">
            <v-form @submit.prevent="saveUser()" name="saveUserForm" id="saveUserForm" ref="saveUserForm" autocomplete="off">
                <v-text-field 
                label="Current Password" 
                hint="Current Password"
                :rules="[() => !!user.password || 'This field is required']"
                type="password"
                v-model="user.password"
                >
                </v-text-field>
                <v-text-field 
                label="New Password" 
                hint="Must be >8 characters"
                :rules="passwordRules"
                type="password"
                v-model="user.newPassword"
                >
                </v-text-field>
                <v-text-field 
                label="Confirm New Password" 
                hint="Confirm Password"
                type="password"
                :rules="confirmPasswordRules"
                v-model="confirmPassword"
                >
                </v-text-field>
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
                >
                  {{errorMessage}}
                </v-alert>
                <v-btn type="submit" color="primary" for="saveUserForm">Save</v-btn>
                <v-btn type="submit" @click="reset">Reset</v-btn>
            </v-form>
        </panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Panel from '@/components/globals/Panel'
import UserService from '@/services/UserService'

export default {
    data() {
      return { //also add to reset() method
        user: {
          password: '',
          newPassword: ''
        },
        confirmPassword: '',
        successMessage: null,
        errorMessage: null,
        passwordRules: [
          v => v.length >= 8 || 'Password must be at least 8 characters'
        ],
        confirmPasswordRules: [
          v => v===this.user.newPassword || 'Passwords must match'
        ]
      }
    },
    components: {Panel},
    methods: {
      async saveUser() {
        if (!this.$refs.saveUserForm.validate()) return false
        const reply = (await UserService.put(this.user)).data
        if (reply.error) {
          this.errorMessage = reply.error
          this.successMessage = null
        } else {
          this.successMessage = "Success!  Changes saved."
          this.errorMessage = null
        }

      },
      reset() {
        this.user.password = ''
        this.user.newPassword = ''
        this.confirmPassword = ''
      }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
