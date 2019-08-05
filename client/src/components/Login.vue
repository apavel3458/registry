<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 mt-10>
        <panel title="Login">
          <v-form @submit.prevent="login()" ref="submitLoginForm" id="submitLoginForm">
          <v-flex xs12 sm12 md10 offset-md1>
                  <v-text-field
                    label="Username"
                    type="username"
                    name="username"
                    ref="username"
                    prepend-icon="mdi-account-circle"
                    v-model="username"
                    v-on:keyup.enter="login" 
                    >
                  </v-text-field>
                  <v-text-field
                    label="Password"
                    type="password"
                    name="password"
                    ref="password"
                    prepend-icon="mdi-lock"
                    append-icon="mdi-eye-off"
                    v-on:keyup.enter="login"
                    v-model="password">
                  </v-text-field>
                <v-alert dense type="error" v-if="error">{{error}} </v-alert>
                <div class="text-center">
                  <v-btn @click.prevent="login()" color="info">Login</v-btn>
                </div>
          </v-flex>
          </v-form>
       </panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'HelloWorld',
  data () {
    return {
      username: '',
      password: '',
      error: '',
      url: ''
    }
  },
  components: {},
  methods: {
    async login () {
      await AuthenticationService.login({
        username: this.username,
        password: this.password
      })
        .then(async (response) =>  {
          this.$store.commit('login', {token: response.token, user: response.user})
          await this.$store.dispatch('init')
          this.$router.push({
            name: 'home'
          })
        }).catch((err) => {
          if (err.response.status == 400) {
            this.error = err.response.data.error
          } else {
            this.error = "There was an error contacting the server: " + this.response.status
          }
        })
    }
  },
  mounted() {
    this.error = this.$route.params.error || ''
    this.url = this.$route.params.url || ''
    this.$store.commit('logout')
    this.$refs.username.focus();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .error {
  }
</style>
