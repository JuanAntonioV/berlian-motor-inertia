import Product from '#models/product'
import BrandService from '#services/brand_service'
import CategoryService from '#services/category_service'
import ProductService from '#services/product_service'
import TypeService from '#services/type_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductController {
  async show({ inertia }: HttpContext) {
    return inertia.render('products/ManageProductPage')
  }
  async showCreate({ inertia }: HttpContext) {
    const generatedSKU = await Product.generateSKU()

    const { data: brandList } = await BrandService.list()
    const { data: typeList } = await TypeService.list()
    const { data: categoryList } = await CategoryService.list()

    return inertia.render('products/CreateProductPage', {
      sku: generatedSKU,
      brandList,
      typeList,
      categoryList,
    })
  }
  async showEdit({ inertia, params }: HttpContext) {
    const id = params.id

    const { data: brandList } = await BrandService.list()
    const { data: typeList } = await TypeService.list()
    const { data: categoryList } = await CategoryService.list()

    return inertia.render('products/EditProductPage', {
      brandList,
      typeList,
      categoryList,
      id,
    })
  }

  async list(c: HttpContext) {
    const res = await ProductService.list(c)
    return c.response.status(res.code).json(res)
  }

  async detail(c: HttpContext) {
    const res = await ProductService.detail(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await ProductService.create(c)
    return c.response.status(res.code).json(res)
  }

  async update(c: HttpContext) {
    const res = await ProductService.update(c)
    return c.response.status(res.code).json(res)
  }

  async delete(c: HttpContext) {
    const res = await ProductService.delete(c)
    return c.response.status(res.code).json(res)
  }
  async stock(c: HttpContext) {
    const res = await ProductService.getProductStock(c)
    return c.response.status(res.code).json(res)
  }
  async addStock(c: HttpContext) {
    const res = await ProductService.addProductStock(c)
    return c.response.status(res.code).json(res)
  }
}
