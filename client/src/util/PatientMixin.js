import Moment from 'moment'

var mixin = {
   methods: {
      age(dob, nowD) {
         if (nowD) {
            return Moment(nowD).diff(dob, 'years')
         } else {
            return Moment().diff(dob, 'years');
         }
      },
      formatDate (d) {
         const ndate = new Moment(d)
         if (!ndate.isValid()) {
             return '---'
         } else {
             return ndate.format('YYYY-MM-DD')
         }
     }
   }

}

export default mixin

