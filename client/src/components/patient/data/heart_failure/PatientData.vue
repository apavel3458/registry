<template>
    <v-card>
        <v-tabs v-model="tabSelected" background-color="blue" dark align-with-title slider-color="yellow">
            <v-tab v-for="tab in tabs" 
                :key="tab"
                >{{tab}}</v-tab>
            <v-tab-item v-for="tab in tabs" 
                :key="tab" 
                :transition="false" 
                :reverse-transition="false">
                <v-card flat>
                    <v-card-text><imaging :is="tab"></imaging></v-card-text>
                </v-card>
            </v-tab-item>
                      <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon fab v-on="on" @click="$router.push({name: 'registry', params: {registryId: $store.state.activeRegistry.id}})" style="margin-top: -3px;">
                    <v-icon>mdi-format-list-bulleted-square</v-icon>
              </v-btn>
            </template>
            <span>Back to Patient List</span>
          </v-tooltip>
        </v-tabs>
    </v-card>
</template>

<script>
// import Imaging from './data/Imaging'
// import Diagnosis from './data/Diagnosis'
import { mapState } from 'vuex'

export default {
    components: {
        'Imaging': () => import(`./Imaging`),
        'Diagnosis': () => import('./Diagnosis'),
        'Events': () => import('./Events'),
        'Medications': () => import('./Medications'),
        'Devices': () => import('./Devices'),
    },
    props: ['componentP'],
    data() {
        return {
            tabSelected: null,
            tabs: ['Diagnosis', 'Imaging', 'Medications', 'Events', 'Devices']
        }
    },
    watch: {
        tabSelected(val) {
            if (this.patient) {
                this.$router.push({name:'patientData', params:{patientId: this.patient.id, component: this.tabs[val]}})
            }
        },
        componentP() {
            this.setComponent(this.componentP)
        }
    },
    computed: {
        ...mapState({
            patient: 'activePatient',
            registry: 'activeRegistry'
        })
    },
    methods: {
        setComponent(val) {
            if (val) {
            this.tabSelected = this.tabs.findIndex(x => 
                {return x.toUpperCase() === val.toUpperCase()})
            }
        }
    },
    created() {

    },
    mounted() {
        this.setComponent(this.componentP)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
