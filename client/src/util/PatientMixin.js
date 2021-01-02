import { dateFns, differenceInCalendarYears } from 'date-fns'

var mixin = {
  methods: {
    age(dob, nowD) {
      if (!nowD) nowD = new Date()
      return differenceInCalendarYears(nowD, dob) - 1
    },
    formatDate(d) {
      if (dateFns.isValid(d)) return dateFns.format(d, 'YYYY-MM-DD')
      else return '---'
    },
  },
}

export default mixin
