<template>
  <div>
  <v-toolbar dense dark color="primary">
    <v-app-bar-nav-icon></v-app-bar-nav-icon>

    <v-toolbar-title class="white--text">
      <span class="home" @click="navigateTo('root')">
      Registry
      </span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
            v-if="isAuthenticated"
            text
            dark
            @click="navigateTo('home')">
          Home
        </v-btn>
        <v-btn
            v-if="isAuthenticated"
            text
            dark
            @click="navigateTo('registryselect')">
          Change Registry
        </v-btn>
        <v-btn
            v-if="isAuthenticated"
            text
            dark
            @click="navigateTo('reports')">
          Reports
        </v-btn>
        <v-btn
            v-if="isAdmin"
            text
            dark
            @click="navigateTo('admin-users')">
          Users
        </v-btn>
        <v-btn
          v-if="!isAuthenticated"
            text
            dark
            @click="navigateTo('login')">
          Login
        </v-btn>

      <v-btn icon
        v-if="!$store.getters.isAuthenticated"
        @click="navigateTo('register')">
        <v-icon>mdi-account-box</v-icon>
      </v-btn>

      
      <v-btn text dark v-if="$store.getters.isAuthenticated">
        <v-icon>mdi-account-box</v-icon>
        {{$store.state.user.firstName}} {{$store.state.user.lastName}} ({{$store.state.user.username}})
      </v-btn>
      </v-toolbar-items>

      <v-tooltip bottom v-if="isAuthenticated">
        <template v-slot:activator="{ on }">
          <v-btn icon
            v-on="on"
            @click="logout()">
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="!isAuthenticated"
            @click="$router.push({name: 'login'})"
          >
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="!isAuthenticated"
            @click="$router.push({name: 'register'})"
          >
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="isAdmin"
            @click="$router.push({name: 'admin-users'})">
            <v-list-item-title>User Management</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="isAuthenticated"
            @click="$router.push({name: 'useroptions'})">
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item>
                    <v-list-item
            v-if="isAuthenticated"
            @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
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
