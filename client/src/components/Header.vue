<template>
  <div>
  <v-toolbar dense dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>

    <v-toolbar-title class="white--text">
      <span class="home" @click="navigateTo('root')">
      Registry
      </span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
            v-if="isAuthenticated"
            flat
            dark
            @click="navigateTo('home')">
          Home
        </v-btn>
        <v-btn
            v-if="isAuthenticated"
            flat
            dark
            @click="navigateTo('reports')">
          Reports
        </v-btn>
        <v-btn
            v-if="isAdmin"
            flat
            dark
            @click="navigateTo('admin-users')">
          Users
        </v-btn>
        <v-btn
          v-if="!isAuthenticated"
            flat
            dark
            @click="navigateTo('login')">
          Login
        </v-btn>

      <v-btn icon
        v-if="!$store.getters.isAuthenticated"
        @click="navigateTo('register')">
        <v-icon>account_box</v-icon>
      </v-btn>

      
      <v-btn flat dark v-if="$store.getters.isAuthenticated">
        <v-icon>account_box</v-icon>
        {{$store.state.user.firstName}} {{$store.state.user.lastName}} ({{$store.state.user.username}})
      </v-btn>
      </v-toolbar-items>

      <v-tooltip bottom v-if="isAuthenticated">
        <template v-slot:activator="{ on }">
          <v-btn icon
            v-on="on"
            @click="logout()">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
                <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-tile
            v-if="!isAuthenticated"
            @click="$router.push({name: 'login'})"
          >
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            v-if="!isAuthenticated"
            @click="$router.push({name: 'register'})"
          >
            <v-list-tile-title>Register</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            v-if="isAdmin"
            @click="$router.push({name: 'admin-users'})">
            <v-list-tile-title>User Management</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            v-if="isAuthenticated"
            @click="$router.push({name: 'useroptions'})">
            <v-list-tile-title>Change Password</v-list-tile-title>
          </v-list-tile>
                    <v-list-tile
            v-if="isAuthenticated"
            @click="logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
  </v-toolbar>
</div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  components: {},
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'isAdmin'
    ])
  },
  methods: {
    navigateTo (route) {
      this.$router.push({name: route})
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'root'
      })
    }
  }
}

</script>

<style scoped>
.home {
  cursor: pointer;
}
.home:hover {
  color: rgb(218, 218, 218);
}
.headerElement {
  vertical-align: middle;
}
.headerElementSpan {
  line-height: 4;
  vertical-align: middle;
}
</style>
