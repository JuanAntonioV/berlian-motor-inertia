import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'reduction_of_good_items';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table
                .string('reduction_of_good_id', 20)
                .unsigned()
                .references('id')
                .inTable('reduction_of_goods')
                .onDelete('CASCADE');
            table
                .integer('product_id')
                .unsigned()
                .references('id')
                .inTable('products')
                .onDelete('SET NULL');
            table.integer('quantity').notNullable().defaultTo(0);
            table.integer('price').notNullable().defaultTo(0);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1742525944968_create_reduction_of_good_items_table.js.map