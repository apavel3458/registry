import AdminUsers from '@/components/user/AdminUsers'


const routes = [
    // {
    //     path: '/accounts',
    //     name: 'accounts',
    //     component: Accounts
    // }
    {
        path: '/admin/users',
        name: 'admin-users',
        component: AdminUsers
      },
]

export default routes.map(route => {
    return {...route, 
        meta: 
        {
            authenticated: true,
            admin: true
        }}
})