<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <panel title="Login">
          <v-form @submit.prevent="login()" ref="submitLoginForm" id="submitLoginForm">
          <v-flex xs12 sm12 md8 offset-md2>
                  <v-text-field
                    label="E-Mail"
                    type="email"
                    name="email"
                    ref="email"
                    v-model="email"
                    v-on:keyup.enter="login" 
                    placeholder="E-mail">
                  </v-text-field>
                  <v-text-field
                    label="Password"
                    type="password"
                    name="password"
                    ref="password"
                    placeholder="Password"
                    v-on:keyup.enter="login"
                    v-model="password">
                  </v-text-field>
                <div class="error" v-html="error" />
                <v-btn @click.prevent="login()" color="info">Login</v-btn>
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
      email: '',
      password: '',
      error: ''
    }
  },
  components: {},
  methods: {
    async login () {
      await AuthenticationService.login({
        email: this.email,
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
    this.$store.commit('logout')
    this.$refs.email.focus();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .error {
  }
</style>
