import Api from '@/services/Api'

export default {
  async register (credentials) {
    return (await Api().post('register', credentials)).data
  },
  async login (credentials) {
    return (await Api().post('login', credentials)).data
  }
}

// AuthenticationService.register({
//   email: 'testing@gmail.com',
//   password: '123456'
// })
