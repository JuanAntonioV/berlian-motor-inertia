import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'suppliers';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name', 100).notNullable();
            table.string('address').nullable();
            table.string('phone', 20).nullable();
            table.string('email', 100).nullable();
            table.string('contact_person', 100).nullable();
            table.text('notes').nullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1741853111552_create_suppliers_table.js.map