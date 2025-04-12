import Permission from '#models/permission';
import Role from '#models/role';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
export default class extends BaseSeeder {
    async run() {
        const roleData = [
            {
                name: 'Super Admin',
                slug: 'super-admin',
                description: 'Role dengan akses penuh ke semua fitur',
            },
            {
                name: 'Admin',
                slug: 'admin',
                description: 'Role dengan akses ke fitur tertentu',
            },
            {
                name: 'Karyawan',
                slug: 'karyawan',
                description: 'Role dengan akses ke fitur tertentu',
            },
        ];
        const roles = await Role.createMany(roleData);
        const allPermissions = await Permission.all();
        const staffPermissions = await Permission.query().whereIn('slug', ['kelola-produk']).exec();
        for (const role of roles) {
            if (role.slug === 'super-admin' || role.slug === 'admin') {
                await role.related('permissions').attach(allPermissions.map((permission) => permission.id));
            }
            else if (role.slug === 'karyawan') {
                await role
                    .related('permissions')
                    .attach(staffPermissions.map((permission) => permission.id));
            }
        }
    }
}
//# sourceMappingURL=role_seeder.js.map