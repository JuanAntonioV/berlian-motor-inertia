import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import GoodsReceipt from './goods_receipt.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare phone: string | null

  @column()
  declare email: string | null

  @column()
  declare address: string | null

  @column()
  declare contact_person: string | null

  @column()
  declare notes: string | null

  @hasMany(() => GoodsReceipt)
  declare goodsReceipts: HasMany<typeof GoodsReceipt>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
