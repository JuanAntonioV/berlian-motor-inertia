import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ReductionOfGoodItem from './reduction_of_good_item.js'

export default class ReductionOfGood extends BaseModel {
  @column({
    isPrimary: true,
    prepare: (value) => {
      // if sku is not provided, generate a new one
      if (!value) {
        return ReductionOfGood.generateInvoiceNumber()
      }

      return value.toUpperCase()
    },
  })
  declare id: string

  @column()
  declare userId: number

  @column()
  declare totalAmount: number

  @column()
  declare totalQuantity: number

  @column.date({ autoCreate: true })
  declare reducedAt: DateTime | null

  @column()
  declare reference: string | null

  @column()
  declare attachment: string | null

  @column()
  declare notes: string | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => ReductionOfGoodItem)
  declare items: HasMany<typeof ReductionOfGoodItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async generateInvoiceNumber() {
    const prefix = 'ROG'
    // make format like this INV-ddmmyy-xxxx with random 4 digit letter at the end
    const date = DateTime.now().toFormat('ddMMyy')
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${date}-${random}`
  }
}
