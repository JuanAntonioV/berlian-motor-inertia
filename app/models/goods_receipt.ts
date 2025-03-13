import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import GoodsReceiptItem from './goods_receipt_item.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Supplier from './supplier.js'
import User from './user.js'

export default class GoodsReceipt extends BaseModel {
  @column({
    isPrimary: true,
    prepare: (value) => {
      // if sku is not provided, generate a new one
      if (!value) {
        return GoodsReceipt.generateInvoiceNumber()
      }

      return value.toUpperCase()
    },
  })
  declare id: string

  @column()
  declare userId: number

  @column()
  declare supplierId: number

  @column()
  declare totalAmount: number

  @column()
  declare attachment: string | null

  @column()
  declare reference: string | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: false })
  declare receivedAt: DateTime | null

  @hasMany(() => GoodsReceiptItem)
  declare items: HasMany<typeof GoodsReceiptItem>

  @belongsTo(() => Supplier)
  declare supplier: BelongsTo<typeof Supplier>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async generateInvoiceNumber() {
    const prefix = 'GR'
    // make format like this INV-ddmmyy-xxxx with random 4 digit letter at the end
    const date = DateTime.now().toFormat('ddMMyy')
    const random = Math.random().toString(36).substring(7).toUpperCase()
    return `${prefix}-${date}-${random}`
  }
}
