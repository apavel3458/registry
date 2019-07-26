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
                      label="Last Name"
                      type="text"
                      name="lastName"
                      v-model="user.lastName">
                    </v-text-field>
                    <v-text-field
                      label="Username"
                      type="text"
                      name="username"
                      :rules="[() => !!user.username || 'This field is required']"
                      v-model="user.username">
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
        if (!this.$refs.registrationForm.validate()) return
        await AuthenticationService.register(this.user)
        .then(async response => {
            if (response.successMessage) {
              this.successMessage = response.successMessage //if there is a message, don't log in, but give message
            } else {
              this.$store.commit('login', {token: response.token, user: response.user})
              await this.$store.dispatch('init')
              this.$router.push({
                name: 'home'
              })
            }
        }).catch(err => {
            //console.log(err)
            if (err.response.status == 400) {
              this.errorMessage = err.response.data.error
            } else {
              this.errorMessage = "There was an error contacting the server: " + this.response.status
            }
        })
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
