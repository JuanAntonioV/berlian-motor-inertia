import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ProductStock from './product_stock.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Storage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare image: string | null

  @hasMany(() => ProductStock)
  declare productStocks: HasMany<typeof ProductStock>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
