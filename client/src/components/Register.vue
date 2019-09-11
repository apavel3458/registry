<template>
  <v-container grid-list-md text-xs-center>
    <v-row justify="center">
      <v-col xs="12" sm="8" md="6">
          <panel title="Register New User">
                <v-flex xs12 sm12 md10 offset-md1>
                  <v-form name="registrationForm" ref="registrationForm" autocomplete="off">
                    <v-text-field
                      label="First Name"
                      type="text"
                      name="firstName"
                      ref="firstName"
                      prepend-icon="mdi-account"
                      v-model="user.firstName">
                    </v-text-field>
                    <v-text-field
                      label="Last Name"
                      type="text"
                      name="lastName"
                      prepend-icon="mdi-account"                      
                      v-model="user.lastName">
                    </v-text-field>
                    <v-text-field
                      label="Username"
                      type="text"
                      name="username"
                      prepend-icon="mdi-account-card-details"
                      :rules="[() => !!user.username || 'This field is required']"
                      v-model="user.username">
                    </v-text-field>
                    <v-text-field
                      label="E-Mail"
                      type="email"
                      name="email"
                      prepend-icon="mdi-email"
                      :rules="emailRules"
                      v-model="user.email">
                    </v-text-field>
                    <v-text-field
                      label="Password"
                      :rules="[() => !!user.password || 'This field is required']"
                      type="password"
                      name="password"
                      prepend-icon="mdi-lock"
                      autocomplete="new-password"
                      v-model="user.password">
                    </v-text-field>
                    <div class="text-center mt-2 mx-auto">
                      <vue-recaptcha
                        ref="recaptcha"
                        @verify="onVerify"
                        @expired="onExpired"
                        class="mx-auto"
                        :sitekey="sitekey">
                      </vue-recaptcha>
                    </div>
                    <div class="mt-2">
                      <v-alert
                        :value="successMessage"
                        color="success"
                        icon="mdi-check-circle"
                        dense text
                      >
                        {{successMessage}}
                      </v-alert>
                      <v-alert
                        :value="errorMessage"
                        color="error"
                        icon="mdi-alert"
                        dense text
                      >
                        {{errorMessage}}
                      </v-alert>
                    </div>
                    <div class="center">
                      <v-btn color="info" @click="register" class="mt-2 mr-3"><v-icon>mdi-account-box</v-icon> Register</v-btn>
                      <v-btn color="" :to="{name:'login'}" class="mt-2"><v-icon>mdi-login-variant</v-icon> Back to Login</v-btn>
                    </div>
                  </v-form>
                </v-flex>                
          </panel>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import VueRecaptcha from 'vue-recaptcha';
import siteConfig from '@/config/config.js'

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
      sitekey: siteConfig.google.recaptchaSiteKey,
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
        this.errorMessage = null
        this.successMessage = null
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
            this.$refs.recaptcha.reset()
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
  .center {
    text-align: center;
  }
</style>
