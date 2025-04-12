import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'permissions';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name').notNullable().unique();
            table.string('slug').notNullable().unique();
            table.text('description').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1740469544956_create_permissions_table.js.map