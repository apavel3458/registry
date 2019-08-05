// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import Panel from '@/components/globals/Panel'
import vuetify from '@/plugins/vuetify'
import VueTheMask from 'vue-the-mask'
//import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(VueTheMask)
Vue.component('panel', Panel)

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  
  router,
  store,
  components: { App },
  vuetify,
  template: '<App/>'
})
