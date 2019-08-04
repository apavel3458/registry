import Patient from '@/components/patient/Patient'
import CreateReferral from '@/components/referral/CreateReferral'
import ViewReferral from '@/components/referral/ViewReferral'
import EditReferral from '@/components/referral/EditReferral'
import UserOptions from '@/components/user/UserOptions'
import Reports from '@/components/report/Reports'

const routes = [
    // {
    //     path: '/accounts',
    //     name: 'accounts',
    //     component: Accounts
    // }
      {
        path: '/registry',
        redirect: '/registry/1',
        name: 'home',
        component: Patient
      },
      {
        path: '/registry/:registryId',
        name: 'registry',
        component: Patient
      },
      {
        path: '/patient/:patientId',
        name: 'patient',
        component: Patient
      },
      {
        path: '/patient/:patientId/data/:component',
        name: 'patientData',
        component: Patient
      },
      {
        path: '/useroptions',
        name: 'useroptions',
        component: UserOptions
      },
      {
        path: '/report',
        name: 'reports',
        component: Reports
      }
]

export default routes.map(route => {
    return {...route, meta: 
        {
            private: true,
            admin: false
        }}
})