import { goodsReceiptValidator } from '#validators/goods_receipt'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import GoodsReceipt from '#models/goods_receipt'
import { errors as lucidErrors } from '@adonisjs/lucid'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import env from '#start/env'
import Supplier from '#models/supplier'
import db from '@adonisjs/lucid/services/db'

export default class GoodsReceiptService {
  static async list({}: HttpContext) {
    try {
      const goodsReceipt = await GoodsReceipt.query().preload('supplier').exec()

      return ResponseHelper.okResponse(goodsReceipt)
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async create({ request, auth }: HttpContext) {
    const { id, supplierId, items, notes, reference } =
      await request.validateUsing(goodsReceiptValidator)

    const isSupplierExist = await Supplier.find(supplierId)
    if (!isSupplierExist) {
      return ResponseHelper.badRequestResponse('Pemasok tidak ditemukan')
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
        const filename = `${cuid()}.${attachment.extname}`
        const folderPath = 'goodsReceipt/uploads'
        await attachment.move(app.makePath(folderPath), {
          name: filename,
        })

        const filePath = `/${folderPath}/${filename}`
        attachmentPath = filePath
      }

      const totalAmount = items.reduce((acc, item) => {
        return acc + item.quantity * item.price
      }, 0)

      const newGoodsReceipt = trx
        .insertQuery()
        .table('goods_receipts')
        .insert({
          user_id: user.id,
          supplier_id: supplierId,
          invoice_number: invoiceNumber,
          reference: reference || null,
          notes: notes || null,
          attachment: attachmentPath,
          totalAmount,
        })

      const goodsReceiptId = await newGoodsReceipt.returning('id')

      const goodsReceiptItems = items.map((item) => {
        return {
          goods_receipt_id: goodsReceiptId,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        }
      })

      await trx.insertQuery().table('goods_receipt_items').multiInsert(goodsReceiptItems)

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
}
