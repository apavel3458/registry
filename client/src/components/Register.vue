<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
          <panel title="Register New User">
                <v-flex xs12 sm12 md10 offset-md1>
                  <v-form name="registrationForm" ref="registrationForm" autocomplete="off">
                    <v-text-field
                      label="First Name"
                      type="text"
                      name="firstName"
                      ref="firstName"
                      v-model="user.firstName">
                    </v-text-field>
                    <v-text-field
                      label="First Name"
                      type="text"
                      name="lastName"
                      v-model="user.lastName">
                    </v-text-field>
                    <v-text-field
                      label="E-Mail"
                      type="email"
                      name="email"
                      :rules="emailRules"
                      v-model="user.email">
                    </v-text-field>
                    <v-text-field
                      label="Password"
                      :rules="[() => !!user.password || 'This field is required']"
                      type="password"
                      name="password"
                      autocomplete="new-password"
                      v-model="user.password">
                    </v-text-field>
                    <div>
                      <vue-recaptcha
                        ref="recaptcha"
                        @verify="onVerify"
                        @expired="onExpired"
                        :sitekey="sitekey">
                      </vue-recaptcha>
                    </div>

                    <v-alert
                      :value="successMessage"
                      color="success"
                      icon="check_circle"
                      outline
                    >
                      {{successMessage}}
                    </v-alert>
                    <v-alert
                      :value="errorMessage"
                      color="error"
                      icon="warning"
                      outline
                    >
                      {{errorMessage}}
                    </v-alert>
                    <v-btn color="info" @click="register">Register</v-btn>
                  </v-form>
                </v-flex>                
          </panel>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import VueRecaptcha from 'vue-recaptcha';
export default {
  name: 'HelloWorld',
  data () {
    return {
      user: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      recaptchaToken: ''
      },
      errorMessage: null,
      successMessage: null,
      sitekey: '6LejLpgUAAAAAG0OivRXLro19nNSy0wUe94qgiJw',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  components: {VueRecaptcha},
  methods: {
    async register () {
      try{
        if (!this.$refs.registrationForm.validate()) return
        const response = await AuthenticationService.register(this.user)
        alert(JSON.stringify(response))
        if (response.error) {
          this.errorMessage = response.error
          this.successMessage = null
        } else if (response.successMessage) {
          this.successMessage = response.successMessage
          this.errorMessage = null
        } else { //if no message returned, then just log them in
          this.$store.dispatch('setToken', response.token)
          this.$store.dispatch('setUser', response.user)
          this.$router.push({
            name: 'dashboard'
          })
        }
      } catch (err) {
        alert(err)
      }
    },
    onVerify (token) {
      this.user.recaptchaToken = token
    },
    onExpired () {
      this.user.recaptchaToken = ''
    }
  },
  mounted() {
    this.$refs.firstName.focus()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .error {
  }
</style>
