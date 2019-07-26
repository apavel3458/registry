import Api from '@/services/Api'

export default {
  index (params) {
    return Api().get('admin/users', params)
  },
  put (user) {
      return Api().put(`admin/users/${user.id}`, user)
  },
  delete (user) {
    return Api().post(`admin/users/${user.id}/delete`, user)
  },
  async groups (params) {
    return (await Api().get(`admin/groups`, params)).data
  },
  async addGroup (group) {
    return (await Api().post(`admin/groups`, group)).data
  },
  async updateGroup (group) {
    return (await Api().put(`admin/groups/${group.id}`, group)).data
  },
  async deleteGroup (id) {
    return (await Api().delete(`admin/groups/${id}`)).data
  }
}

// AuthenticationService.register({
//   email: 'testing@gmail.com',
//   password: '123456'
// })
