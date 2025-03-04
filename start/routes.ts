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
const FileController = () => import('#controllers/file_controller')
const CategoryController = () => import('#controllers/category_controller')
const BrandController = () => import('#controllers/brand_controller')

router.get('storage/*', [FileController, 'show']).as('storage')

/** API ROUTES */
router
  .group(() => {
    router
      .group(() => {
        router
          .post('login', [AuthController, 'doLogin'])
          .middleware(middleware.guest())
          .as('login.do')
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
        router
          .post('reset-password', [ProfileController, 'doResetPassword'])
          .as('profile.password.reset')

        router.post('update', [ProfileController, 'update']).as('profile.update')
      })
      .prefix('profile')

    router
      .group(() => {
        router.get('list', [CategoryController, 'list']).as('categories.list')
        router.post('/', [CategoryController, 'create']).as('categories.create')
        router.put(':id', [CategoryController, 'update']).as('categories.update')
        router.delete(':id', [CategoryController, 'delete']).as('categories.delete')
      })
      .prefix('categories')
    router
      .group(() => {
        router.get('list', [BrandController, 'list']).as('brand.list')
        router.post('/', [BrandController, 'create']).as('brand.create')
        router.put(':id', [BrandController, 'update']).as('brand.update')
        router.delete(':id', [BrandController, 'delete']).as('brand.delete')
      })
      .prefix('brands')
  })
  .prefix('api')

/** VIEW ROUTES */
router
  .group(() => {
    router
      .get('login', [AuthController, 'showLogin'])
      .middleware(middleware.guest())
      .as('login.page')
  })
  .prefix('auth')

router
  .group(() => {
    router.get('/', ({ response }) => response.redirect().toRoute('dashboard.page')).as('home.page')
    router.get('dashboard', [DashboardController, 'show']).as('dashboard.page')
    router.get('akun-saya', [ProfileController, 'show']).as('profile.page')
    router.get('kelola-kategori', [CategoryController, 'show']).as('category.page')
    router.get('kelola-merek', [BrandController, 'show']).as('brand.page')
  })
  .middleware(middleware.auth())
