<template>
  <v-app>
    <page-header />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import PageHeader from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    PageHeader,
  },
  data() {
    return {
      //
    }
  },
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
.overflow-cell-wrapper {
  display: table;
  table-layout: fixed;
  width: 100%;
}

.overflow-cell {
  display: table-cell;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
div.v-window {
  overflow: visible;
}
</style>
