<template>
    <div>
        <v-list>
          <v-list-group
            v-for="group in groups"
            :key="group.id"
            v-model="group.active"
            :prepend-icon="group.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{ group.groupName }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn outline small fab color="red lighten-1" @click="deleteGroup(group)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-list-tile-action>
              </v-list-tile>

            </template>

            <v-list-tile
              v-for="user in group.users"
              :key="user.id"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ user.firstName }}, {{ user.lastName }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                    <v-btn fab outline small color="primary" @click="removeFromGroup(group, user)">
                        <v-icon dark>remove</v-icon>
                    </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
        <v-btn
              color="pink"
              dark
              small
              absolute
              bottom
              fab
              @click="addGroupDialog=true"
            >
              <v-icon>add</v-icon>
        </v-btn>


         <v-dialog
            v-model="addGroupDialog"
            max-width="290"
            >
            <v-card>
                <v-card-title class="headline">New Group</v-card-title>

                <v-card-text>
                    <v-text-field
                        v-model="newGroup.groupName"
                        label="Group Name">
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="green darken-1"
                    flat="flat"
                    @click="addGroupDialog = false"
                >
                    Cancel
                </v-btn>

                <v-btn
                    color="green darken-1"
                    flat="flat"
                    @click="addGroup()"
                >
                    Add
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>




    </div>

</template>

<script>
import AdminUserService from '@/services/AdminUserService'
export default {
    props: {
        groupsParent: {
            type: Array,
            required: false,
            defaultValue: []
        }
    },
    data() {
        return {
            groups: [],
            loading: false,
            newGroup: {
                groupName: ''
            },
            addGroupDialog: false
        }
    },
    watch: {
        groupsParent (newVal) {
            this.groups = newVal
        }
    },
    methods: {
        async addGroup() {
            this.loading= true;
            const newGroupReturn = await AdminUserService.addGroup(this.newGroup)
            if (newGroupReturn.error) {
                //alert(newGroupReturn.error)
            } else {
                this.groups.push(newGroupReturn)
                this.newGroup = {groupName: ''}
                this.$emit('updateGroup', this.groups)
            }
            this.loading=false;
            this.addGroupDialog = false
        },
        async removeFromGroup(group, user) {
            group.users.splice(group.users.indexOf(user), 1)
            const reply = this.updateGroup(group)
            if (reply.error) {
                group.users.push(user)
            }
        },
        async updateGroup(group) {
            return await AdminUserService.updateGroup(group)
        },
        async deleteGroup(group) {
            if (!confirm(`Are you sure you want to delete the group titled '${group.groupName}'. This action cannot be undone.`)) return false;
            const newGroupReturn = await AdminUserService.deleteGroup(group.id)
            if (!newGroupReturn.error) {
                this.groups.splice(this.groups.indexOf(group), 1)
            }
        }
    },
    
    async mounted() {
        if (this.groups.length == 0) {
            this.groups = await AdminUserService.groups({
                params: {
                    eager: '[users]'
                }
            })
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
