<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 mt-10>
        <panel title="Login" style="width: 380px;" class="mx-auto">
          <v-form @submit.prevent="login()" ref="submitLoginForm" id="submitLoginForm">
          <div>
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
                <v-alert dense type="error" v-if="error" class="text-center">{{error}} </v-alert>
                <div class="text-center">
                  <v-btn @click.prevent="login()" :loading="loading" :disabled="loading" color="info">Login</v-btn>
                </div>
          </div>
          </v-form>
       </panel>
      </v-flex>
    </v-layout>
    <v-btn :to="{name:'register'}" text class="hiddenRegister white--text">Register</v-btn>
  </v-container>
  
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import GeneralMixin from '@/util/GeneralMixin'

export default {
  name: 'HelloWorld',
  mixins: [GeneralMixin],
  data () {
    return {
      username: '',
      password: '',
      error: '',
      url: '',
      loading: false
    }
  },
  components: {},
  methods: {
    async login () {
      this.loading = true
      await AuthenticationService.login({
        username: this.username,
        password: this.password
      })
        .then(async (response) =>  {
          this.loading = false
          this.loginSuccess(response)
        }).catch((err) => {
          this.loading = false
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(err))
          this.error = this.processError(err)
        })
    },
    async loginSuccess({token, user}) {      
      this.$store.commit('login', {token, user})
      await this.$store.dispatch('init')
      this.$router.push({
        name: 'registryselect'
      })
    },
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
.hiddenRegister {
  position: absolute;
  top:0 ;
  right: 0;
}
</style>
