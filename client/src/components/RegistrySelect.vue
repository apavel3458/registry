/* eslint-disable vue/valid-template-root */
<template>
    <v-container>
        <v-row align="center"
            justify="center">
            <v-col xs="12" class="text-center"><H1>Select Registry:</H1></v-col>
        </v-row>
        <v-row
            align="center"
            justify="center"
        >
            <v-col cols="12" xs="12" sm="8" md="6" v-if="this.$store.state.registryList.length==0">
                <v-alert type="warning" dense text class="mx-auto text-center">You don't have permissions to access any registry.</v-alert>
            </v-col>
            <v-col cols="12" xs="6" sm="4" v-for="(item, i) in this.$store.state.registryList" :key="i">
            <v-hover v-slot:default="{ hover }">
                <v-card
                :elevation="hover?21:5"
                class="mx-auto"
                max-width="300"
                color=""
                style="cursor: pointer;"
                :to="{name:'registry', params:{registryId:item.id}}"
                >
                    <v-img
                        :src="getImage(item)"
                        height="200px"
                    >
                            <!-- <template v-slot:placeholder>
                                <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                                >
                                <v-progress-circular indeterminate color="grey" :size="50"></v-progress-circular>
                                </v-row>
                            </template> -->
                    </v-img>
                    <!-- <v-fade-transition>
                        <div
                            v-if="hover"
                            class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text"
                            style="height: 100%;"
                        >
                            Open
                        </div>
                    </v-fade-transition> -->
                    <v-card-text class="mt-1 pb-0 mb-0 text-center headline thin">{{item.registryName}}</v-card-text>
                    <v-card-text class="pb-2 pt-0 text-center subtitle thin">{{item.registrySize}} entries</v-card-text>
                </v-card>
            </v-hover>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import sarcoidosis from '@/assets/sarcoidosis.jpg'
import medical_oncology from '@/assets/medical_oncology.jpg'
import heart_failure from '@/assets/heart_failure.jpg'
export default {
    data() {
        return {
            registries: [
                { shortName: 'sarcoidosis', image: sarcoidosis},
                { shortName: 'medical_oncology', image: medical_oncology},
                { shortName: 'heart_failure', image: heart_failure}
            ]
        }
    },
    methods: {
        getImage(item) {
            const found = this.registries.find(r=>{return item.shortName == r.shortName})
            return found.image
            //return require(`@/assets/${item.shortName}.jpg`)
            //return 'https://photricity.com/flw/ajax/' //infinite loading for testing
        }
    },
    async created() {
        this.$store.dispatch('init')
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
}
</style>
