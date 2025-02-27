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
const ProfileController = () => import('#controllers/profile_controller')

router
  .group(() => {
    router
      .get('login', [AuthController, 'showLogin'])
      .middleware(middleware.guest())
      .as('login.page')
    router.post('login', [AuthController, 'doLogin']).middleware(middleware.guest()).as('login.do')
    router
      .delete('logout', [AuthController, 'doLogout'])
      .as('logout.do')
      .middleware(middleware.auth())

    router.get('user', [AuthController, 'getUser']).middleware(middleware.auth()).as('user.get')

    router
      .post('generate-admin', [AuthController, 'generateAdmin'])
      .middleware(middleware.guest())
      .as('generate-admin')
  })
  .prefix('auth')

router
  .group(() => {
    router.get('/', ({ response }) => response.redirect().toRoute('dashboard.page')).as('home.page')
    router.get('dashboard', [DashboardController, 'show']).as('dashboard.page')
    router.get('akun-saya', [ProfileController, 'show']).as('profile.page')

    router
      .group(() => {
        router
          .post('reset-password', [ProfileController, 'doResetPassword'])
          .as('profile.password.reset')
      })
      .prefix('profile')
  })
  .middleware(middleware.auth())
