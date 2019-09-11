<template>
    <div>
        <v-container grid-list-md pa-2 fluid fill-height>
            <!-- <v-layout row :class="{'wrap':$vuetify.breakpoint.xs}"> -->
            <v-layout row :class="{'wrap':$vuetify.breakpoint.xs}" style="background: 0">
            <v-flex style="width: 250px"
                :class="[{'shrink':$vuetify.breakpoint.smAndUp}, 
                        {'xs12':$vuetify.breakpoint.xsAndDown},
                        {'patientBar':$vuetify.breakpoint.smAndUp}]">
                <patient-bar></patient-bar>
            </v-flex>
            <v-flex :class="{'patientData':$vuetify.breakpoint.smAndUp}" grow>
                <patient-data v-if="patient" :is="registryComponents[$store.state.activeRegistry.shortName]" :componentP="dataComponent"></patient-data>
                <patient-list v-else> </patient-list>
            </v-flex>
            </v-layout>
            
        </v-container>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PatientBar from './PatientBar'
import PatientDataSarcoidosis from './data/sarcoidosis/PatientData'
import PatientDataMedicalOncology from './data/medical_oncology/PatientData'
import PatientDataHeartFailure from './data/heart_failure/PatientData'
//import PatientDataHeartFailure from './data/sarcoidosis/PatientData'
import PatientList from './PatientList'

export default {
    components: {PatientBar, PatientList, PatientDataSarcoidosis, PatientDataMedicalOncology},
    data() {
        return {
            search: null,
            dataComponent: 'diagnosis',
            registryComponents: {'sarcoidosis': PatientDataSarcoidosis, 'medical_oncology': PatientDataMedicalOncology, 'heart_failure': PatientDataHeartFailure}
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
            this.$router.push({  name: 'registryselect' })
        } else {
            this.setRegistry(this.$route.params.registryId)
        }
        this.dataComponent = this.$route.params.component
        //PatientData = import('./data/medical_oncology/PatientData')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style="scss">
  ::v-deep .compact {
    transform: scale(0.875);
    transform-origin: middle;
  }
  .patientBar {
      width: 250px;
  }
  .patientData {
      width: 400px;
  }
</style>
