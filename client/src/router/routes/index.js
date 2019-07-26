import publicRoutes from '@/router/routes/public.js'
import privateRoutes from '@/router/routes/private.js'
import adminRoutes from '@/router/routes/admin.js'

export default publicRoutes.concat(privateRoutes).concat(adminRoutes)