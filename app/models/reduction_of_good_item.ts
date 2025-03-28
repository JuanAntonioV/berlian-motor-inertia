import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import ReductionOfGood from './reduction_of_good.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class ReductionOfGoodItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare reductionOfGoodId: string

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @column()
  declare price: number

  @belongsTo(() => ReductionOfGood)
  declare reduReductionOfGood: BelongsTo<typeof ReductionOfGood>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
