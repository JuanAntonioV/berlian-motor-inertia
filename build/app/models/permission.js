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
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm';
import Role from './role.js';
export default class Permission extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Permission.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Permission.prototype, "description", void 0);
__decorate([
    manyToMany(() => Role, {
        pivotTable: 'role_permissions',
    }),
    __metadata("design:type", Object)
], Permission.prototype, "roles", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Permission.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Permission.prototype, "updatedAt", void 0);
//# sourceMappingURL=permission.js.map