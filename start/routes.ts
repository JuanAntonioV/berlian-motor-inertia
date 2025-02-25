/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

router
  .group(() => {
    router.get('login', [AuthController, 'showLogin']).as('login.page')
    router.post('login', [AuthController, 'doLogin']).as('login.do')
    router
      .delete('logout', [AuthController, 'doLogout'])
      .as('logout.do')
      .middleware(middleware.auth())

    router.get('user', [AuthController, 'getUser']).as('user.get')
  })
  .prefix('auth')

router.get('/', [DashboardController, 'show']).as('dashboard.page')
