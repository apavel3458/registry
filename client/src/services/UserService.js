import Api from '@/services/Api'

export default {
  async put (userData) {
    return (await Api().put(`user/changepw`, userData)).data
  }
}
