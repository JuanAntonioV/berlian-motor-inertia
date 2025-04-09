import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import TransferStockItem from './transfer_stock_item.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Storage from './storage.js'

export default class TransferStock extends BaseModel {
  @column({
    isPrimary: true,
    prepare: (value) => {
      // if sku is not provided, generate a new one
      if (!value) {
        return TransferStock.generateInvoiceNumber()
      }

      return value.toUpperCase()
    },
  })
  declare id: string

  @column()
  declare sourceStorageId: number

  @column()
  declare destinationStorageId: number

  @column()
  declare userId: number

  @column()
  declare totalAmount: number

  @column()
  declare totalQuantity: number

  @column()
  declare attachment: string | null

  @column()
  declare reference: string | null

  @column()
  declare notes: string | null

  @column.date({ autoCreate: false })
  declare transferedAt: DateTime | null

  @belongsTo(() => Storage, {
    foreignKey: 'sourceStorageId',
    localKey: 'id',
  })
  declare sourceStorage: BelongsTo<typeof Storage>

  @belongsTo(() => Storage, {
    foreignKey: 'destinationStorageId',
    localKey: 'id',
  })
  declare destinationStorage: BelongsTo<typeof Storage>

  @hasMany(() => TransferStockItem)
  declare items: HasMany<typeof TransferStockItem>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async generateInvoiceNumber() {
    const prefix = 'TS'
    // make format like this INV-ddmmyy-xxxx with random 4 digit letter at the end
    const date = DateTime.now().toFormat('ddMMyy')
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${date}-${random}`
  }
}
