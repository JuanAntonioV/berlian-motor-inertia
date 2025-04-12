import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'role_permissions';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
            table
                .integer('permission_id')
                .unsigned()
                .references('id')
                .inTable('permissions')
                .onDelete('CASCADE');
            table.timestamp('created_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1740469559146_create_role_permissions_table.js.map