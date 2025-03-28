import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reduction_of_goods'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 20).primary().notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.bigInteger('total_amount').notNullable().defaultTo(0)
      table.integer('total_quantity').notNullable().defaultTo(0)
      table.timestamp('reduced_at').nullable()
      table.string('reference').nullable()
      table.string('attachment').nullable()
      table.text('notes').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
