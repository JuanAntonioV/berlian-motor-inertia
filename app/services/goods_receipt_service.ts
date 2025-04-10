import { goodsReceiptValidator } from '#validators/goods_receipt'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import GoodsReceipt from '#models/goods_receipt'
import { errors as lucidErrors } from '@adonisjs/lucid'
import app from '@adonisjs/core/services/app'
import env from '#start/env'
import Supplier from '#models/supplier'
import db from '@adonisjs/lucid/services/db'
import Product from '#models/product'
import ProductStock from '#models/product_stock'
import Storage from '#models/storage'
import { DateTime } from 'luxon'

export default class GoodsReceiptService {
  static async list({}: HttpContext) {
    try {
      const goodsReceipt = await GoodsReceipt.query().preload('supplier').preload('user').exec()

      return ResponseHelper.okResponse(goodsReceipt)
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async stats({}: HttpContext) {
    try {
      const totalTransactionQuery = GoodsReceipt.query().count('id', 'total').firstOrFail()
      const totalAmountQuery = GoodsReceipt.query().sum('totalAmount', 'total').firstOrFail()
      const lastUpdated = new Date().toISOString()

      const [totalGoodsReceipt, totalAmount] = await Promise.all([
        totalTransactionQuery,
        totalAmountQuery,
      ])

      return ResponseHelper.okResponse({
        totalGoodsReceipt: totalGoodsReceipt.$extras.total,
        totalAmount: totalAmount.$extras.total,
        lastUpdated,
      })
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async create({ request, auth }: HttpContext) {
    const { id, supplierName, items, notes, reference, storageId, receivedAt } =
      await request.validateUsing(goodsReceiptValidator)

    let supplier = await Supplier.query().where('name', supplierName).first()
    if (!supplier) {
      // create new supplier
      const newSupplier = await Supplier.create({ name: supplierName })
      supplier = newSupplier
    }

    const storageValid = await Storage.query().where('id', storageId).first()

    if (!storageValid) {
      return ResponseHelper.badRequestResponse('Gudang tidak valid')
    }

    try {
      const totalValidProduct = await Product.query()
        .whereIn(
          'id',
          items.map((item) => item.id)
        )
        .count('id', 'total')
        .firstOrFail()

      if (Number(totalValidProduct.$extras.total) !== items.length) {
        return ResponseHelper.badRequestResponse('Terdapat produk yang tidak valid')
      }
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.badRequestResponse('Produk tidak valid')
      }

      return ResponseHelper.badRequestResponse('Produk tidak valid')
    }

    const user = auth.user!

    const trx = await db.transaction()
    try {
      let invoiceNumber = id

      if (!invoiceNumber) {
        invoiceNumber = await GoodsReceipt.generateInvoiceNumber()
      }

      const attachment = request.file('attachment')
      let attachmentPath = null

      if (attachment) {
        const filename = `${invoiceNumber}_Penerimaan_Barang.${attachment.extname}`
        const folderPath = 'storage/uploads/goods_receipt'
        await attachment.move(app.makePath(folderPath), {
          name: filename,
        })

        const filePath = `/${folderPath}/${filename}`
        attachmentPath = filePath
      }

      const totalAmount = items.reduce((acc, item) => {
        return acc + item.price
      }, 0)

      const totalQty = items.reduce((acc, item) => {
        return acc + item.quantity
      }, 0)

      const newGoodsReceipt = await GoodsReceipt.create(
        {
          id: invoiceNumber,
          userId: user.id,
          supplierId: supplier.id,
          reference: reference || null,
          notes: notes || null,
          attachment: attachmentPath,
          totalAmount,
          totalQuantity: totalQty,
          receivedAt: DateTime.fromJSDate(receivedAt),
        },
        { client: trx }
      )

      const goodsReceiptItems = items.map((item) => {
        return {
          goods_receipt_id: newGoodsReceipt.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }
      })

      newGoodsReceipt.related('items').createMany(goodsReceiptItems, { client: trx })

      const currProductStock = await ProductStock.query({ client: trx })
        .whereIn(
          'productId',
          items.map((item) => item.id)
        )
        .where('storageId', storageId)
        .select('productId', 'quantity')
        .exec()

      const newProductStock = items.map((item) => {
        const stock = currProductStock.find(
          (productStock) => productStock.productId === Number(item.id)
        )
        const quantity = stock ? stock.quantity + item.quantity : item.quantity

        return {
          productId: item.id,
          storageId: storageId,
          quantity: quantity,
        }
      })
      await ProductStock.updateOrCreateMany(['productId', 'storageId'], newProductStock, {
        client: trx,
      })

      trx.commit()
      return ResponseHelper.okResponse(newGoodsReceipt, 'Penerimaan barang berhasil dibuat')
    } catch (err) {
      trx.rollback()
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async detail({ params }: HttpContext) {
    try {
      const goodsReceipt = await GoodsReceipt.query()
        .preload('items', (query) => {
          query.preload('product')
        })
        .preload('user')
        .preload('supplier')
        .where('id', params.id)
        .firstOrFail()

      if (goodsReceipt.attachment) {
        const absolutePath = `${env.get('APP_URL')}${goodsReceipt.attachment}`
        goodsReceipt.attachment = absolutePath
      }

      return ResponseHelper.okResponse(goodsReceipt, 'Penerimaan barang berhasil dapatkan')
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async downloadAttachment({ request, response }: HttpContext) {
    const id = request.param('id')

    try {
      const goodsReceipt = await GoodsReceipt.query().where('id', id).firstOrFail()

      if (!goodsReceipt.attachment) {
        return ResponseHelper.badRequestResponse('Tidak ada lampiran yang ditemukan')
      }

      const filePath = app.makePath(goodsReceipt.attachment.replace(/^\//, ''))
      const generateEtag = true

      return response.download(filePath, generateEtag, (error) => {
        if (error.code === 'ENOENT') {
          return ['File tidak ditemukan', 404]
        }

        return ['Terjadi kesalahan saat mengunduh file', 500]
      })
    } catch (e) {
      return ResponseHelper.serverErrorResponse(e.message)
    }
  }
}
