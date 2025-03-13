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
const StaffController = () => import('#controllers/staff_controller')
const ProductController = () => import('#controllers/product_controller')
const StorageController = () => import('#controllers/storage_controller')
const TypeController = () => import('#controllers/type_controller')
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
          .group(() => {
            router
              .post('reset-password', [ProfileController, 'doResetPassword'])
              .as('profile.password.reset')

            router.put('update', [ProfileController, 'update']).as('profile.update')
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
        router
          .group(() => {
            router.get('list', [TypeController, 'list']).as('type.list')
            router.post('/', [TypeController, 'create']).as('type.create')
            router.put(':id', [TypeController, 'update']).as('type.update')
            router.delete(':id', [TypeController, 'delete']).as('type.delete')
          })
          .prefix('types')
        router
          .group(() => {
            router.get('list', [StorageController, 'list']).as('storage.list')
            router.post('/', [StorageController, 'create']).as('storage.create')
            router.put(':id', [StorageController, 'update']).as('storage.update')
            router.delete(':id', [StorageController, 'delete']).as('storage.delete')
          })
          .prefix('storages')
        router
          .group(() => {
            router.get('list', [ProductController, 'list']).as('product.list')
            router.get(':id', [ProductController, 'detail']).as('product.detail')
            router.get(':id/stock', [ProductController, 'stock']).as('product.stock')
            router.post(':id/stock', [ProductController, 'addStock']).as('product.stock.create')
            router.post('/', [ProductController, 'create']).as('product.create')
            router.put(':id', [ProductController, 'update']).as('product.update')
            router.delete(':id', [ProductController, 'delete']).as('product.delete')
          })
          .prefix('products')
        router
          .group(() => {
            router.get('list', [StaffController, 'list']).as('staff.list')
            router.get(':id', [StaffController, 'detail']).as('staff.detail')
            router.post('/', [StaffController, 'create']).as('staff.create')
            router.put(':id', [StaffController, 'update']).as('staff.update')
            router.delete(':id', [StaffController, 'delete']).as('staff.delete')
          })
          .prefix('staffs')
      })
      .middleware(middleware.auth())
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
    router.get('kelola-tipe', [TypeController, 'show']).as('type.page')
    router.get('kelola-rak', [StorageController, 'show']).as('storage.page')
    router
      .group(() => {
        router.get('/', [ProductController, 'show']).as('product.page')
        router.get('/tambah', [ProductController, 'showCreate']).as('product.create.page')
        router.get('/:id/edit', [ProductController, 'showEdit']).as('product.edit.page')
      })
      .prefix('kelola-produk')
    router
      .group(() => {
        router.get('/', [StaffController, 'show']).as('staff.page')
        router.get('/tambah', [StaffController, 'showCreate']).as('staff.create.page')
        router.get('/:id/edit', [StaffController, 'showEdit']).as('staff.edit.page')
      })
      .prefix('kelola-karyawan')
  })
  .middleware(middleware.auth())
