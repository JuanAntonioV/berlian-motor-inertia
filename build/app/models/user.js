var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import Role from './role.js';
import parsePhoneNumber from 'libphonenumber-js';
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
});
export default class User extends compose(BaseModel, AuthFinder) {
    static async isAdminExist() {
        const adminRole = await Role.query()
            .where('slug', 'admin')
            .orWhere('slug', 'super-admin')
            .first();
        return await adminRole?.related('users').query().first();
    }
    static async getRoles(user) {
        return await user.related('roles').query();
    }
    static async hasRole(user, roleSlug) {
        const roles = await this.getRoles(user);
        return roles.some((role) => roleSlug.includes(role.slug));
    }
    static async getPermissions(user) {
        const roles = await user.related('roles').query().preload('permissions');
        return roles.map((role) => role.permissions.map((permission) => permission.slug)).flat();
    }
    static async hasPermission(user, permissionSlug) {
        const permissions = await this.getPermissions(user);
        return permissions.some((permission) => permissionSlug.includes(permission));
    }
    static async isEmailExist(email) {
        const q = await User.query().where('email', email).first();
        return !!q;
    }
    static async isPhoneExist(phone) {
        const formatedPhone = await this.formatPhoneNumber(phone);
        if (!formatedPhone)
            return false;
        const q = await User.query().where('phone', formatedPhone).first();
        return !!q;
    }
    static async formatPhoneNumber(phone) {
        const number = parsePhoneNumber(phone, 'ID');
        if (number) {
            const formatedNumber = number.formatInternational();
            return formatedNumber.split(' ').join('');
        }
        return null;
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "fullName", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "phone", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    column.date({ autoCreate: true }),
    __metadata("design:type", DateTime)
], User.prototype, "joinDate", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "image", void 0);
__decorate([
    manyToMany(() => Role, {
        pivotTable: 'user_roles',
    }),
    __metadata("design:type", Object)
], User.prototype, "roles", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], User.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
//# sourceMappingURL=user.js.map