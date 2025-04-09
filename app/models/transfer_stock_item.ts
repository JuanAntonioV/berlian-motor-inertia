import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import TransferStock from './transfer_stock.js'
import Product from './product.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class TransferStockItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transferStockId: string

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @belongsTo(() => TransferStock)
  declare transferStock: BelongsTo<typeof TransferStock>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
