/* eslint-disable vue/valid-template-root */
<template>
  <v-container grid-list-md text-xs-center>
    <v-row wrap justify="center">
      <v-col cols="12" xs="12" sm="6">
         <v-form @submit.prevent="saveUser()" name="saveUserForm" id="saveUserForm" ref="saveUserForm">
              <panel title="User Options" alignCenter="true">
               <v-text-field 
                  label="First Name" 
                  :rules="[() => !!user.firstName || 'This field is required']"
                  v-model="user.firstName"
                >
               </v-text-field>
                <v-text-field 
                  label="Last Name" 
                  :rules="[() => !!user.lastName || 'This field is required']"
                  v-model="user.lastName"
                >
                </v-text-field>
                <v-text-field 
                  label="Username" 
                  :rules="[() => !!user.username || 'This field is required']"
                  v-model="user.username"
                >
                </v-text-field>
                <v-text-field 
                  label="Email" 
                  :rules="emailRules"
                  v-model="user.email"
                >
                </v-text-field>
                <v-text-field 
                label="New Password (Leave blank to keep unchanged)" 
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
              </panel>
              <v-card class="py-2 px-5 mt-4">
                <v-text-field 
                label="Current Password (REQUIRED)" 
                hint="PASSWORD IS MANDATORY FOR CHANGES"
                type="password"
                error-messages="PASSWORD IS MANDATORY FOR CHANGES"
                v-model="user.password"
                >
                </v-text-field>
                <div class="text-center my-4">
                <v-btn type="submit" color="primary" for="saveUserForm" class="mr-8">Save</v-btn>
                <v-btn type="submit" @click="reset">Reset</v-btn>
                </div>
            </v-card>

        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Panel from '@/components/globals/Panel'
import UserService from '@/services/UserService'
import GeneralMixin from '@/util/GeneralMixin'

export default {
    mixins: [GeneralMixin],
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
          v => (v.length == 0 || v.length >= 8) || 'Password must be at least 8 characters'
        ],
        confirmPasswordRules: [
          v => v===this.user.newPassword || 'Passwords must match'
        ],
        emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
      }
    },
    components: {Panel},
    methods: {
      async saveUser() {
        if (!this.$refs.saveUserForm.validate()) return false
        await UserService.put(this.user)
          .then(async reply => {
            this.$store.commit('login', reply)
            await this.$store.dispatch('init')
            this.showSuccess("Successfully updated user informaiton.")
            this.reset()
          }).catch(err => {
            this.showError(err)
          })

      },
      reset() {
        this.user.password = ''
        this.user.newPassword = ''
        this.confirmPassword = ''
        this.passordInitialNotice = true
      },
    },
    created() {
        this.user.username = this.$store.state.user.username
        this.user.firstName = this.$store.state.user.firstName
        this.user.lastName = this.$store.state.user.lastName
        this.user.email = this.$store.state.user.email
      }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
