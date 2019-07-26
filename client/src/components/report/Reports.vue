<template>
  <v-container grid-list-md pa-2 text-xs-center fluid fill-height align-center>
    <v-layout row :class="{'wrap':$vuetify.breakpoint.xs}">
      <v-flex 
        :class="[{'shrink':$vuetify.breakpoint.smAndUp}, 
                 {'xs12':$vuetify.breakpoint.xsAndDown},
                 {'patientBar':$vuetify.breakpoint.smAndUp}]">
          <patient-bar></patient-bar>
      </v-flex>
      <v-flex>
        <v-toolbar dark color="purple lighten-1" dense>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>Select Report</v-toolbar-title>
        <v-spacer></v-spacer>
        </v-toolbar>
        
        <v-layout>
        <v-flex xs12 mt-0>
            test

      </v-flex>
      </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import PatientBar from '@/components/patient/PatientBar'

export default {
    components: {PatientBar},
    data() {
        return {
            search: null,
            dataComponent: 'diagnosis',
        }
    },
    watch: {
        '$route.params.id': {
        //immediate: true,
            handler (id) {
                id = null
                this.$store.dispatch('loadPatient', id)
            }
        },
        '$route.params.component': {
        //immediate: true,
         handler (component) {
            if (component != null) {
                this.dataComponent = component
            }
         }
        },

    },
    computed: {
        ...mapState({
            patient: 'activePatient',
            registry: 'activeRegistry'
        })
    },
    methods: {
        //async loadPatient(id) {  //do not use only for 
            //await this.$store.dispatch('loadPatient')
            
        //}
        // openPatient(id) { //updates URL
        //     if (id && id !== '') {
        //        this.$router.push({name:'patient', params:{id: id}})
        //     }
            
        // },
    },
    async created() {
        //await this.loadPatient(this.$route.params.id)
        this.dataComponent = this.$route.params.component
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  /deep/ .compact {
    transform: scale(0.875);
    transform-origin: middle;
  }
  .patientBar {
      width: 250px;
  }
</style>
