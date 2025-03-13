import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('brand_id').references('id').inTable('brands').onDelete('CASCADE')
      table
        .integer('type_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('types')
        .onDelete('SET NULL')
      table.string('name').notNullable()
      table.string('sku').notNullable().unique()
      table.string('description').nullable()
      table.string('image').nullable()
      table.float('sale_price', 0, 20).notNullable().defaultTo(0).comment('Harga jual')
      table
        .float('supplier_price', 0, 20)
        .notNullable()
        .defaultTo(0)
        .comment('Harga beli dari supplier')
      table.float('wholesale_price', 0, 20).notNullable().defaultTo(0).comment('Harga grosir')
      table.float('retail_price', 0, 20).notNullable().defaultTo(0).comment('Harga eceran')
      table.float('workshop_price', 0, 20).notNullable().defaultTo(0).comment('Harga bengkel')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
