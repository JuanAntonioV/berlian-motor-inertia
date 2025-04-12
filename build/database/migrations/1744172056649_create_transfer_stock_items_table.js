import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'transfer_stock_items';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .string('transfer_stock_id', 20)
                .unsigned()
                .references('id')
                .inTable('transfer_stocks')
                .onDelete('CASCADE');
            table
                .integer('product_id')
                .unsigned()
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');
            table.integer('quantity').notNullable().defaultTo(0);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1744172056649_create_transfer_stock_items_table.js.map