<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 mt-10>
        <panel title="Login" style="width: 380px" class="mx-auto">
          <v-form
            id="submitLoginForm"
            ref="submitLoginForm"
            @submit.prevent="login()"
          >
            <div>
              <v-text-field
                ref="username"
                v-model="username"
                label="Username"
                type="username"
                name="username"
                prepend-icon="mdi-account-circle"
                @keyup.enter="login"
              ></v-text-field>
              <v-text-field
                ref="password"
                v-model="password"
                label="Password"
                type="password"
                name="password"
                prepend-icon="mdi-lock"
                append-icon="mdi-eye-off"
                @keyup.enter="login"
              ></v-text-field>
              <v-alert v-if="error" dense type="error" class="text-center">
                {{ error }}
              </v-alert>
              <div class="text-center">
                <v-btn :loading="loading" color="info" @click.prevent="login()">
                  Login
                </v-btn>
              </div>
            </div>
          </v-form>
        </panel>
      </v-flex>
    </v-layout>
    <v-btn :to="{ name: 'register' }" text class="hiddenRegister white--text">
      Register
    </v-btn>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import GeneralMixin from '@/util/GeneralMixin'

export default {
  name: 'HelloWorld',
  components: {},
  mixins: [GeneralMixin],
  data() {
    return {
      username: '',
      password: '',
      error: '',
      url: '',
      loading: false,
    }
  },
  mounted() {
    this.error = this.$route.params.error || ''
    this.url = this.$route.params.url || ''
    this.$store.dispatch('logout')
    this.$refs.username.focus()
  },
  methods: {
    async login() {
      this.loading = true
      await AuthenticationService.login({
        username: this.username,
        password: this.password,
      })
        .then(async (response) => {
          await this.loginSuccess(response)
          this.loading = false
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(err))
          this.error = this.getErrorMessage(err)
          this.loading = false
        })
    },
    async loginSuccess({ token, user }) {
      this.$store.commit('login', { token, user })
      await this.$store.dispatch('init')
      this.$router.push({
        name: 'registryselect',
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hiddenRegister {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
