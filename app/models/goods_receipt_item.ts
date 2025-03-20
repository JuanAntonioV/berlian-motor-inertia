import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import GoodsReceipt from './goods_receipt.js'
import Product from './product.js'

export default class GoodsReceiptItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare goodsReceiptId: string

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @column()
  declare price: number

  @belongsTo(() => GoodsReceipt)
  declare goodsReceipt: BelongsTo<typeof GoodsReceipt>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
