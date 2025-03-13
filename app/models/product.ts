import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Brand from './brand.js'
import Type from './type.js'
import ProductStock from './product_stock.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare brandId: number

  @column()
  declare typeId: number | null

  @column()
  declare name: string

  @column({
    prepare: (value) => {
      // if sku is not provided, generate a new one
      if (!value) {
        return Product.generateSKU()
      }

      return value.toUpperCase()
    },
  })
  declare sku: string

  @column()
  declare description: string | null

  @column()
  declare image: string | null

  @column()
  declare salePrice: number

  @column()
  declare supplierPrice: number

  @column()
  declare wholesalePrice: number

  @column()
  declare retailPrice: number

  @column()
  declare workshopPrice: number

  @manyToMany(() => Category, {
    pivotTable: 'product_categories',
  })
  declare categories: ManyToMany<typeof Category>

  @belongsTo(() => Brand)
  declare brand: BelongsTo<typeof Brand>

  @belongsTo(() => Type)
  declare type: BelongsTo<typeof Type>

  @hasMany(() => ProductStock)
  declare stocks: HasMany<typeof ProductStock>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async generateSKU() {
    const prefix = 'SK'
    const lastId = await this.query().orderBy('id', 'desc').first()

    if (!lastId) {
      return `${prefix}-0001`
    }

    // get the last 0001 from sku
    const lastSKU = lastId.sku.split('-')[1]
    // increment the last 0001
    const number = ('000' + (Number(lastSKU) + 1)).slice(-4)

    // check if sku already exist
    const sku = await this.findBy('sku', `${prefix}-${number}`)

    if (sku) {
      await this.generateSKU()
    }

    return `${prefix}-${number}`
  }
}
