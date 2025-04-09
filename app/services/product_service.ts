import { addStockValidator, productValidator } from '#validators/product'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import Product from '#models/product'
import { errors as lucidErrors } from '@adonisjs/lucid'
import Brand from '#models/brand'
import Type from '#models/type'
import Category from '#models/category'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { unlink } from 'node:fs/promises'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import GoodsReceiptItem from '#models/goods_receipt_item'

export default class ProductService {
  static async list({ request }: HttpContext) {
    const queryParams = request.qs()
    const { storageId } = queryParams

    try {
      const products = await Product.query()
        .preload('brand')
        .preload('type')
        .preload('categories')
        .withCount('stocks', (query) => {
          query.sum('quantity').as('totalStock')
        })
        .if(storageId, (query) => {
          query.preload('stocks', (q) => {
            q.where('storageId', storageId)
          })
        })
        .exec()

      return ResponseHelper.okResponse(products)
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async create({ request }: HttpContext) {
    const {
      name,
      description,
      brandId,
      typeId,
      categoryIds,
      retailPrice,
      salePrice,
      supplierPrice,
      wholesalePrice,
      sku,
      workshopPrice,
    } = await request.validateUsing(productValidator)

    const brandExist = await Brand.find(brandId)
    if (!brandExist) {
      return ResponseHelper.badRequestResponse('Brand tidak ditemukan')
    }

    const typeExist = await Type.find(typeId)
    if (!typeExist) {
      return ResponseHelper.badRequestResponse('Tipe tidak ditemukan')
    }

    if (categoryIds && categoryIds?.length > 0) {
      const categories = await Category.query().whereIn('id', categoryIds!)
      if (categories.length !== categoryIds!.length) {
        return ResponseHelper.badRequestResponse('Produk tidak ditemukan')
      }
    }

    try {
      const newProduct = new Product()
      let skuCode = sku

      if (!skuCode) {
        skuCode = await Product.generateSKU()
      }

      newProduct.sku = skuCode
      newProduct.brandId = brandId
      newProduct.typeId = typeId
      newProduct.salePrice = salePrice
      newProduct.retailPrice = retailPrice
      newProduct.supplierPrice = supplierPrice
      newProduct.wholesalePrice = wholesalePrice
      newProduct.workshopPrice = workshopPrice ?? retailPrice
      newProduct.name = name
      newProduct.description = description ?? null

      const image = request.file('image')

      if (image) {
        const filename = `${cuid()}.${image.extname}`
        const folderPath = 'storage/uploads'
        await image.move(app.makePath(folderPath), {
          name: filename,
        })

        const filePath = `/${folderPath}/${filename}`
        newProduct.image = filePath
      }

      await newProduct.save()

      if (categoryIds && categoryIds?.length > 0) {
        newProduct.related('categories').sync(categoryIds)
      }

      return ResponseHelper.okResponse(newProduct, 'Produk berhasil dibuat')
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async update({ request, params }: HttpContext) {
    const {
      name,
      description,
      brandId,
      typeId,
      categoryIds,
      retailPrice,
      salePrice,
      supplierPrice,
      wholesalePrice,
      sku,
      workshopPrice,
    } = await request.validateUsing(productValidator)

    const brandExist = await Brand.find(brandId)
    if (!brandExist) {
      return ResponseHelper.badRequestResponse('Brand tidak ditemukan')
    }

    const typeExist = await Type.find(typeId)
    if (!typeExist) {
      return ResponseHelper.badRequestResponse('Tipe tidak ditemukan')
    }

    if (categoryIds && categoryIds?.length > 0) {
      const categories = await Category.query().whereIn('id', categoryIds!)
      if (categories.length !== categoryIds!.length) {
        return ResponseHelper.badRequestResponse('Produk tidak ditemukan')
      }
    }

    try {
      const product = await Product.findOrFail(params.id)

      let skuCode = sku

      if (!skuCode) {
        skuCode = await Product.generateSKU()
      }

      product.sku = skuCode
      product.brandId = brandId
      product.typeId = typeId
      product.salePrice = salePrice
      product.retailPrice = retailPrice
      product.supplierPrice = supplierPrice
      product.wholesalePrice = wholesalePrice
      product.workshopPrice = workshopPrice ?? retailPrice
      product.name = name
      product.description = description ?? null

      const image = request.file('image')

      if (image) {
        const oldImage = product.image

        if (oldImage) {
          const path = `storage/uploads/${oldImage}`
          await unlink(app.makePath(path)).catch((e) => {
            logger.info(`Failed to delete old profile image: ${e.message}`)
          })
        }

        const filename = `${cuid()}.${image.extname}`
        const folderPath = 'storage/uploads'
        await image.move(app.makePath(folderPath), {
          name: filename,
        })

        const filePath = `/${folderPath}/${filename}`
        product.image = filePath
      }

      await product.save()

      if (categoryIds && categoryIds?.length > 0) {
        product.related('categories').sync(categoryIds)
      }

      return ResponseHelper.okResponse(product, 'Produk berhasil diupdate')
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async delete({ params }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)

      // check if product still have stock
      const stock = await product.related('stocks').query().sum('quantity', 'total').first()

      if (stock && stock.$extras.total > 0) {
        return ResponseHelper.badRequestResponse('Produk masih memiliki stok')
      }

      const goodsReceipt = await GoodsReceiptItem.query().where('productId', product.id).first()

      if (goodsReceipt) {
        return ResponseHelper.badRequestResponse('Produk sudah digunakan di penerimaan barang')
      }

      if (product.image) {
        const path = `storage/uploads/${product.image}`
        await unlink(app.makePath(path)).catch((e) => {
          logger.info(`Failed to delete old profile image: ${e.message}`)
        })
      }

      await product.delete()

      return ResponseHelper.okResponse(product, 'Produk berhasil dihapus')
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse('Produk tidak ditemukan')
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async detail({ params }: HttpContext) {
    const id = params.id

    try {
      const product = await Product.query()
        .where('id', id)
        .preload('brand')
        .preload('type')
        .preload('categories')
        .firstOrFail()

      return ResponseHelper.okResponse(product)
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse('Produk tidak ditemukan')
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async getDetailById(id: number) {
    try {
      const product = await Product.query()
        .where('id', id)
        .preload('brand')
        .preload('type')
        .preload('categories')
        .first()

      if (!product) {
        return ResponseHelper.notFoundResponse('Produk tidak ditemukan')
      }

      if (product.image) {
        const absolutePath = `${env.get('APP_URL')}${product.image}`
        product.image = absolutePath
      }

      return product
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return null
      }

      throw err
    }
  }

  static async getProductStock({ params }: HttpContext) {
    const id = params.id

    try {
      const product = await Product.findOrFail(id)

      const stock = await product.related('stocks').query().preload('storage').exec()

      return ResponseHelper.okResponse(stock)
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }
  static async addProductStock({ params, request }: HttpContext) {
    const id = params.id

    const { storageId, quantity } = await request.validateUsing(addStockValidator)

    try {
      const product = await Product.findOrFail(id)

      const isStockAlreadyExist = await product
        .related('stocks')
        .query()
        .where('storageId', storageId)
        .first()

      if (isStockAlreadyExist) {
        return ResponseHelper.badRequestResponse(
          'Maaf, anda hanya bisa menambahkan stok awal sekali!'
        )
      }

      const stock = await product.related('stocks').create({
        storageId,
        quantity,
      })

      return ResponseHelper.okResponse(stock, 'Stok berhasil ditambahkan')
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }
}
