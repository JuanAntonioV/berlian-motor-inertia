import Permission from '#models/permission'
import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
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
    ]

    const roles = await Role.createMany(roleData)

    const allPermissions = await Permission.all()

    for (const role of roles) {
      await role.related('permissions').attach(allPermissions.map((permission) => permission.id))
    }
  }
}
