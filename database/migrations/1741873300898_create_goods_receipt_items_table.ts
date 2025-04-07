import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'goods_receipt_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .string('goods_receipt_id', 20)
        .unsigned()
        .references('id')
        .inTable('goods_receipts')
        .onDelete('CASCADE')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('SET NULL')
      table
        .integer('storage_id')
        .unsigned()
        .references('id')
        .inTable('storages')
        .onDelete('SET NULL')
      table.integer('quantity').notNullable().defaultTo(0)
      table.integer('price').notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
