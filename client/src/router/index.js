import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store.js'
import routes from '@/router/routes/index.js'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'root',
            redirect: '/login'
        }
    ].concat(routes)
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated
    const isAdmin = store.getters.isAdmin
    const adminRequired = to.matched.some(record => record.meta.admin)
    const authenticatedRequired = to.matched.some(record => record.meta.authenticated)
    if (authenticatedRequired && !isAuthenticated) {
        //this route requires auth, checked if logged in
        return next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }
    if (adminRequired && !isAdmin) {
        return next('/dashboard')
    }
    next()
})

export default router