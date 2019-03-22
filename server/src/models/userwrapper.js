
'user strict'
const User = require('./user')

class UserWrapper extends User{
    constructor () {
        super()
        delete this.password
    }
    get password() {
        return ''
    }

}

module.exports = UserWrapper