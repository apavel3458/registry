<template>
  <div class="d-print-none">
    <v-app-bar
      v-if="isAuthenticated"
      color="#6A76AB"
      dark
      src="https://picsum.photos/1920/1080/?blur=10"
      fade-img-on-scroll
    >
      <template #img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon
        @click="
          $router.push({
            name: 'registry',
            params: { registryId: $store.state.activeRegistry.id },
          })
        "
      ></v-app-bar-nav-icon>

      <v-toolbar-title>
        <span class="home" @click="navigateTo('root')">
          <template v-if="$store.state.activeRegistry">
            TzemosLabs - {{ $store.state.activeRegistry.registryName }}
          </template>
          <template v-else> Welcome to TzemosLabs </template>
        </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-tooltip v-if="!isAuthenticated" bottom>
        <template #activator="{ on }">
          <v-btn icon dark v-on="on" @click="navigateTo('Login')">
            <v-icon>mdi-account-box</v-icon>
          </v-btn>
        </template>
        <span>Login</span>
      </v-tooltip>

      <!-- <v-card class="body-1 mt-2 pa-1" outlined color="rgba(169, 169, 169, 0.2)"
      v-if="isAuthenticated">{{$store.state.user.firstName}} {{$store.state.user.lastName}} ({{$store.state.user.username}})</v-card> -->

      <v-tooltip v-if="isAuthenticated" bottom>
        <template #activator="{ on }">
          <v-btn
            icon
            dark
            v-on="on"
            @click="$router.push({ name: 'registryselect' })"
          >
            <v-icon>mdi-database-refresh</v-icon>
          </v-btn>
        </template>
        <span>Select Different Registry</span>
      </v-tooltip>

      <v-tooltip v-if="isAuthenticated && $store.state.activeRegistry" bottom>
        <template #activator="{ on }">
          <v-btn
            icon
            dark
            v-on="on"
            @click="
              $router.push({
                name: 'registry',
                params: { registryId: $store.state.activeRegistry.id },
              })
            "
          >
            <v-icon>mdi-home-variant</v-icon>
          </v-btn>
        </template>
        <span>{{ $store.state.activeRegistry.registryName }} Home</span>
      </v-tooltip>

      <v-tooltip v-if="isAdmin" bottom>
        <template #activator="{ on }">
          <v-btn
            color="red lighten-2"
            icon
            dark
            v-on="on"
            @click="navigateTo('admin-users')"
          >
            <v-icon>mdi-shield-check</v-icon>
          </v-btn>
        </template>
        <span>User Management</span>
      </v-tooltip>

      <v-tooltip v-if="isAuthenticated" bottom>
        <template #activator="{ on }">
          <v-btn icon dark v-on="on" @click="navigateTo('useroptions')">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <span>User Options</span>
      </v-tooltip>

      <v-tooltip v-if="isAuthenticated" bottom>
        <template #activator="{ on }">
          <v-btn icon v-on="on" @click="logout()">
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>

      <v-menu>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="!isAuthenticated"
            @click="$router.push({ name: 'login' })"
          >
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="!isAuthenticated"
            @click="$router.push({ name: 'register' })"
          >
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="isAuthenticated"
            @click="$router.push({ name: 'registryselect' })"
          >
            <v-list-item-title>Select Registry</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="isAuthenticated && $store.state.activeRegistry"
            @click="
              $router.push({
                name: 'registry',
                params: { registryId: $store.state.activeRegistry.id },
              })
            "
          >
            <v-list-item-title
              >{{
                $store.state.activeRegistry.registryName
              }}
              Home</v-list-item-title
            >
          </v-list-item>
          <v-list-item
            v-if="isAdmin"
            @click="$router.push({ name: 'admin-users' })"
          >
            <v-list-item-title class="red--text"
              >User Management</v-list-item-title
            >
          </v-list-item>
          <v-list-item
            v-if="isAuthenticated"
            @click="$router.push({ name: 'useroptions' })"
          >
            <v-list-item-title>User Settings</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isAuthenticated" @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <messaging v-show="isAuthenticated"></messaging>
    <v-footer
      absolute
      padless
      height="30"
      color="primary lighten-3 text-center white--text font-weight-light d-flex justify-space-around body-2"
    >
      <v-flex
        ><strong>Registry</strong> - {{ new Date().getFullYear() }}
        <span v-if="$store.state.user">
          - Logged in as: {{ $store.state.user.firstName }}
          {{ $store.state.user.lastName }} ({{
            $store.state.user.username
          }})</span
        >
      </v-flex>
    </v-footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Messaging from '@/components/util/Messaging';

export default {
  components: { Messaging },
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin']),
  },
  methods: {
    navigateTo(route) {
      this.$router.push({ name: route });
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({
        name: 'root',
      });
    },
  },
};
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
