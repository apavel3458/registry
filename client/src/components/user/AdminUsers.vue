/* eslint-disable vue/valid-template-root */
<template>
  <v-container grid-list-md text-xs-center>
    <v-layout  wrap>
      <v-flex xs12>
        <v-card>
            <v-toolbar color="indigo lighten" dark dense>
                <v-toolbar-side-icon></v-toolbar-side-icon>
                <v-toolbar-title>Users</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-toolbar>

            <v-data-table
            :headers="computedHeaders"
            :items="users"
            :search="search"
            :rows-per-page-items="rowsPerPage"
            class="userTable"
            >

            <template v-slot:headerCell="props" class="pa-0">
                <span class="pa-0">
                    {{ props.header.text }}
                </span>
            </template>
            
            <template v-slot:items="props">
                <td class="text-xs-center pa-0" :class="{inactive:!props.item.active}">{{ props.item.firstName }}</td>
                <td class="text-xs-center pa-0" :class="{inactive:!props.item.active}">{{ props.item.lastName }}</td>
                <td class="text-xs-center pa-0" :class="{inactive:!props.item.active}">{{ props.item.email }}</td>
                <td class="text-xs-center pa-0" :class="{inactive:!props.item.active}" 
                    v-if="!$vuetify.breakpoint.smAndDown">
                    {{ formatDate(props.item.lastLogin) }}
                </td>
                <td class="text-xs-center pa-0" :class="{inactive:!props.item.active}">
                    <v-btn :class="[{activate:props.item.active}]"
                     fab small outline color="purple lighten-1" 
                     v-if="!props.item.active"
                     class="ma-0 pa-0" @click="toggleDisableUser(props.item)">
                        <v-icon>
                            remove_circle
                        </v-icon>
                    </v-btn>
                    <v-btn :class="[{activate:props.item.active}]"
                     fab small outline color="green lighten-1" 
                     v-if="props.item.active"
                     class="ma-0 pa-0" @click="toggleDisableUser(props.item)">
                        <v-icon>
                            text_format
                        </v-icon>
                    </v-btn>
                </td>
                <td class="text-xs-center pa-0 text-no-wrap" :class="{inactive:!props.item.active}">

                    <v-btn small fab outline color="blue" @click="editUserDialog(props.item)">
                        <v-icon>
                            build
                        </v-icon>
                    </v-btn>
                    
                    <v-btn small fab outline color="red lighten-1" class="ma-0 pa-0" icon @click="deleteUser(props.item)">
                          <v-icon>
                            delete
                          </v-icon>
                    </v-btn>
            </td>
            </template>
            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>
            </v-data-table>
        </v-card>
      </v-flex>

      <v-flex xs12 md8 offset-md2 class="mt-3">
        <v-card>
            <v-toolbar color="red" dark dense>
                <v-toolbar-side-icon></v-toolbar-side-icon>
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
        <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="updateUser(dialogUser)">Save</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

  </v-container>

</template>

<script>
import AdminUserService from '@/services/AdminUserService'
import Moment from 'moment'
import UserEdit from './AdminUserEdit'
import AdminGroups from '@/components/user/AdminGroups'

export default {
    components: {UserEdit, AdminGroups},
    data() {
        return {
            search: '',
            dialog: false,
            dialogUser: {},
            users: [],
            groups: [],
            headers: [
                { text: 'Last Name', value: 'lastName' },
                {
                    text: 'First Name',
                    align: 'left',
                    sortable: true,
                    value: 'firstName'
                },
                { text: 'E-Mail', value: 'email', align: 'center'},
                { text: 'Last Login', value: 'lastLogin', align: 'center', hide: 'smAndDown'},
                { text: 'Active?', value: 'active', align: 'center', width: 20},
                { text: 'Actions', value: 'actions', align: 'center'}
            ],
            rowsPerPage: [10,20,25, {"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]
        }
    },
    computed: {
        computedHeaders () {
            return this.headers.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide])  
        }
    },
    methods: {
        formatDate (d) {
            const ndate = new Moment(d, 'MM-DD-YYYY, hh:mm:ss A')
            if (!ndate.isValid()) {
                return '---'
            } else {
                return ndate.format('YYYY-MM-DD')
            }
        },
        async toggleDisableUser (user) {
            const action = user.active?'BLOCK': 'ACTIVATE'
            if (!confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName} (${user.email})`)) {
                return
            }
            const selected = this.users[this.users.indexOf(user)]
            selected.active = !selected.active
            selected.loginAttempts = 0
            try {
                var reply = (await AdminUserService.put(selected)).data
                if (reply.error) {
                    throw new Error("Server Error")
                } else {
                    this.selected = reply
                }
            } catch (err) {
                alert("Error on page: " + err)
                selected.active = !selected.active //change it back
            }
        },
        async updateUser(user) {
            try {

                var reply = (await AdminUserService.put(user)).data
                //alert(JSON.stringify(user))
                if (reply.error) {
                    throw new Error("Server Error")
                } else {
                    this.users.splice(this.users.indexOf(user), 1, reply)
                    this.groups = await AdminUserService.groups({params: {eager: '[users]'}})
                }
            } catch (err) {
                alert("Error on page: " + err)
                this.dialog = false
                await this.loadData()
            }
            this.dialog = false
        },
        async deleteUser(user) {
            if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName} (${user.email})?`)) {
                try {
                    const reply = (await AdminUserService.delete(user)).data
                    if (reply.error) {
                        throw new Error("Server Error: " + reply.error)
                    }
                    this.users.splice(this.users.indexOf(user), 1)
                } catch (err) {
                    alert("Error on page: " + err)
                    await this.loadData()
                }
            }
        },
        editUserDialog(user) {
            this.dialogUser = user
            this.dialog = true
        },
        async loadData() {
            this.users = (await AdminUserService.index({
                params: {
                    eager: `[usergroups]`
                }
                })).data
            this.groups = await AdminUserService.groups({params: {eager: 'users'}})
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
