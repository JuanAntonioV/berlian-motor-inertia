import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'users';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable();
            table.string('full_name').nullable();
            table.string('email', 254).notNullable().unique();
            table.string('password').notNullable();
            table.string('image').nullable();
            table.string('phone').nullable();
            table.date('join_date').nullable();
            table.timestamp('created_at').notNullable().defaultTo(this.now());
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1740467372025_create_users_table.js.map