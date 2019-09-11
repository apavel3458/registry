/* eslint-disable vue/valid-template-root */
<template>
  <v-container grid-list-md text-xs-center>
    <v-layout  wrap>
      <v-flex xs12>
        <v-card>
            <v-toolbar color="indigo lighten" dark dense>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
                <v-toolbar-title>Users</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-toolbar>

            <v-data-table
            :headers="computedHeaders"
            :items="users"
            :search="search"
            class="userTable"
            :loading="loading"
            >

            <template v-slot:headerCell="props" class="pa-0">
                <span class="pa-0">
                    {{ props.header.text }}
                </span>
            </template>
            
            <template v-slot:item="props">
                <tr>
                    <td class="text-center" :class="{inactive:!props.item.active}">{{ props.item.username }}</td>
                    <td class="text-center" :class="{inactive:!props.item.active}">{{ props.item.firstName }}</td>
                    <td class="text-center" :class="{inactive:!props.item.active}">{{ props.item.lastName }}</td>
                    <td class="text-center" :class="{inactive:!props.item.active}" 
                        v-if="!$vuetify.breakpoint.smAndDown">
                        {{ formatDate(props.item.lastLogin) }}
                    </td>
                    <td class="text-xs-center pa-0" :class="{inactive:!props.item.active}">
                        <v-btn :class="[{activate:props.item.active}]"
                        fab x-small outlined color="purple lighten-1" 
                        v-if="!props.item.active"
                        class="ma-0 pa-0" @click="toggleDisableUser(props.item)">
                            <v-icon>
                                mdi-format-color-text
                            </v-icon>
                        </v-btn>
                        <v-btn :class="[{activate:props.item.active}]"
                        fab x-small outlined color="green lighten-1" 
                        v-if="props.item.active"
                        class="ma-0 pa-0" @click="toggleDisableUser(props.item)">
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                        </v-btn>
                    </td>
                    <td class="text-center pa-0 text-no-wrap" :class="{inactive:!props.item.active}">

                        <v-btn x-small fab outlined color="blue" @click="editUserDialog(props.item)">
                            <v-icon>
                                mdi-wrench
                            </v-icon>
                        </v-btn>
                        
                        
                        <v-btn x-small fab outlined color="red lighten-1" class="ma-0 pa-0" icon @click="deleteUser(props.item)">
                            <v-icon>
                                mdi-delete
                            </v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>
            </v-data-table>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 offset-md2 class="mt-3">
        <v-card>
            <v-toolbar color="red" dark dense>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
                <v-toolbar-title>Groups</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-flex xs12 sm10 offset-sm1>
                <admin-groups 
                class="" 
                :groupsParent="groups"
                @updateGroup="groups = $event"></admin-groups> 
            </v-flex>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog" max-width="600px">
    <v-card>
        <v-card-title>
        <span class="headline">Edit User: {{dialogUser.id}}</span>
        </v-card-title>
        <v-card-text>
            <user-edit v-bind:user="dialogUser" :groups="groups"></user-edit>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="updateUser(dialogUser)">Save</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
    <messaging></messaging>
  </v-container>

</template>

<script>
import AdminUserService from '@/services/AdminUserService'
import {format, isValid} from 'date-fns'
import UserEdit from './AdminUserEdit'
import AdminGroups from '@/components/user/AdminGroups'
import { mapMutations } from 'vuex'
import Messaging from '@/components/util/Messaging'

export default {
    components: {UserEdit, AdminGroups, Messaging},
    data() {
        return {
            search: '',
            dialog: false,
            dialogUser: {},
            users: [],
            groups: [],
            headers: [
                { text: 'Username', value: 'username', align: 'center'},
                { text: 'Last Name', value: 'lastName', align: 'center' },
                {
                    text: 'First Name',
                    align: 'center',
                    sortable: true,
                    value: 'firstName'
                },
                { text: 'Last Login', value: 'lastLogin', align: 'center', hide: 'smAndDown'},
                { text: 'Active?', value: 'active', align: 'center', width: 20},
                { text: 'Actions', value: 'actions', align: 'center'}
            ],//,
            //rowsPerPage: [10,20,25, {"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]
            loading: false
        }
    },
    computed: {
        computedHeaders () {
            return this.headers.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide])  
        }
    },
    methods: {
        ...mapMutations({
            showError: 'messaging/showError',
            showSuccess: 'messaging/showSuccess'
        }),
        formatDate (dd) {
            if (!dd || !isValid(new Date(dd)))
                return '---'
            else
                return format(new Date(dd), 'YYYY-MM-DD HH:mm:ss')
        },
        async toggleDisableUser (user) {
            const action = user.active?'BLOCK': 'ACTIVATE'
            if (!confirm(`Are you sure you want to ${action} user '${user.username}' (${user.email})`)) {
                return
            }
            const selected = this.users[this.users.indexOf(user)]
            selected.active = !selected.active
            selected.loginAttempts = 0
            await AdminUserService.put(selected)
                .then((reply) => {
                    this.selected = reply
                    this.showSuccess(`User '${selected.username}' is now ${selected.active?'ACTIVATED':'BLOCKED'}`)
                }).catch(err => {
                    this.showError(err.response.data.error)
                    selected.active = !selected.active
                })

        },
        async updateUser(user) {

                await AdminUserService.put(user)
                    .then(async (reply) => {
                        this.user = reply
                        this.groups = await AdminUserService.groups({params: {eager: '[users]'}})
                        this.showSuccess(`User '${user.username}' successfully updated`)
                        this.dialog = false
                    }).catch(async err => {
                        this.showError("ERROR: " + err.response.data.error)
                        await this.loadData()
                    })
        },
        async deleteUser(user) {
            if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName} (${user.email})?`)) {
                await AdminUserService.delete(user)
                    .then(() => {
                        this.users.splice(this.users.indexOf(user), 1)
                        this.showSuccess(`User '${user.username}' successfully deleted`)
                        this.dialog = false
                    }).catch(async err => {
                        this.showError("Error" + err.response.data.error)
                        await this.loadData()
                    })
            }
        },
        editUserDialog(user) {
            this.dialogUser = user
            this.dialog = true
        },
        async loadData() {
            this.loading = true
            this.users = await AdminUserService.index({
                params: {
                    eager: `[usergroups]`
                }
                })
            this.groups = await AdminUserService.groups({params: {eager: 'users'}})
            this.loading = false
        },


    },
    async mounted() {
        await this.loadData()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.userTable >>> th {
    padding: 0px;
}
.inactive {
    background-color: rgb(255, 246, 240);
    color: #afafaf;
}
</style>
