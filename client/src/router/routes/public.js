// import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Login from '@/components/Login'



const routes = [
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]

export default routes.map(route => {
  const meta = {
    authenticated: false,
    admin: false
  }
  return {...route, meta}
})