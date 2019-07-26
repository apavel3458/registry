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
        path: '/patient',
        name: 'home',
        component: Patient
      },
      {
        path: '/patient/:id',
        name: 'patient',
        component: Patient
      },
      {
        path: '/patient/:id/data/:component',
        name: 'patientData',
        component: Patient
      },
      {
        path: '/referrals/create',
        name: 'CreateReferral',
        component: CreateReferral
      },
      {
        path: '/referrals/:referralId',
        name: 'referral',
        component: ViewReferral
      },
      {
        path: '/referrals/:referralId/edit',
        name: 'edit-referral',
        component: EditReferral
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