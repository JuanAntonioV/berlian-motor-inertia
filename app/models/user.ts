import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Role from './role.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare image: string | null

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare roles: ManyToMany<typeof Role>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static async getRoles(user: User) {
    return await user.related('roles').query()
  }

  static async hasRole(user: User, roleSlug: string[]) {
    const roles = await this.getRoles(user)
    return roles.some((role) => roleSlug.includes(role.slug))
  }

  static async getPermissions(user: User) {
    const roles = await user.related('roles').query().preload('permissions')
    return roles.map((role) => role.permissions.map((permission) => permission.slug)).flat()
  }

  static async hasPermission(user: User, permissionSlug: string[]) {
    const permissions = await this.getPermissions(user)
    return permissions.some((permission) => permissionSlug.includes(permission))
  }
}
