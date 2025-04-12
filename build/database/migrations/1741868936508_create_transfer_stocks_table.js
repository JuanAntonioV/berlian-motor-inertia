import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'transfer_stocks';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string('id').primary();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
            table
                .integer('source_storage_id')
                .unsigned()
                .references('id')
                .inTable('storages')
                .onDelete('SET NULL');
            table
                .integer('destination_storage_id')
                .unsigned()
                .references('id')
                .inTable('storages')
                .onDelete('SET NULL');
            table.bigInteger('total_amount').notNullable().defaultTo(0);
            table.integer('total_quantity').notNullable().defaultTo(0);
            table.timestamp('transfered_at').nullable();
            table.string('attachment').nullable();
            table.string('reference').nullable();
            table.text('notes').nullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1741868936508_create_transfer_stocks_table.js.map