<template>
    <div>
        <v-container grid-list-md pa-2 text-xs-center fluid fill-height align-center>
            <v-layout row :class="{'wrap':$vuetify.breakpoint.xs}">
            <v-flex 
                :class="[{'shrink':$vuetify.breakpoint.smAndUp}, 
                        {'xs12':$vuetify.breakpoint.xsAndDown},
                        {'patientBar':$vuetify.breakpoint.smAndUp}]">
                <patient-bar></patient-bar>
            </v-flex>
            <v-flex>
                <patient-data v-if="patient" :componentP="dataComponent"></patient-data>
                <patient-list v-else> </patient-list>
            </v-flex>
            </v-layout>
            
        </v-container>
        <messaging></messaging>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PatientBar from './PatientBar'
import PatientData from './PatientData'
import PatientList from './PatientList'
import Messaging from '@/components/util/Messaging'

export default {
    components: {PatientBar, PatientData, PatientList, Messaging},
    data() {
        return {
            search: null,
            dataComponent: 'diagnosis',
        }
    },
    watch: {
        '$route.params.patientId': {
        //immediate: true,
            handler (id) {
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
        '$route.params.registryId': {
        //immediate: true,
            handler (registryId) {
                if (registryId != null) {
                    this.setRegistry(registryId)
                }
            }
        }
    },
    computed: {
        ...mapState({
            patient: 'activePatient',
            registry: 'activeRegistry'
        })
    },
    methods: {
        ...mapMutations({
            showError: 'messaging/showError',
            showSuccess: 'messaging/showSuccess'
        }),
        //async loadPatient(id) {  //do not use only for 
            //await this.$store.dispatch('loadPatient')
            
        //}
        // openPatient(id) { //updates URL
        //     if (id && id !== '') {
        //        this.$router.push({name:'patient', params:{id: id}})
        //     }
            
        // },
        async setRegistry(id) {
            const result = await this.$store.dispatch('setActiveRegistryById', id)
            if (!result) {
                this.$router.push({  name: 'registry', params: { registryId: 1 } })
                this.showError("Unable to load registry with ID: " + id)
            }
        }
    },
    async created() {
        if (this.$route.params.registryId == null) {
            //this.showError("Error: Registry ID not set")
            this.$router.push({  name: 'registry', params: { registryId: 1 } })
        } else {
            this.setRegistry(this.$route.params.registryId)
        }
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
