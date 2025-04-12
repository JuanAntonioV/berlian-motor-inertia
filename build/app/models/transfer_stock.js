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
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import TransferStockItem from './transfer_stock_item.js';
import User from './user.js';
import Storage from './storage.js';
export default class TransferStock extends BaseModel {
    static async generateInvoiceNumber() {
        const prefix = 'TS';
        const date = DateTime.now().toFormat('ddMMyy');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${date}-${random}`;
    }
}
__decorate([
    column({
        isPrimary: true,
        prepare: (value) => {
            if (!value) {
                return TransferStock.generateInvoiceNumber();
            }
            return value.toUpperCase();
        },
    }),
    __metadata("design:type", String)
], TransferStock.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], TransferStock.prototype, "sourceStorageId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], TransferStock.prototype, "destinationStorageId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], TransferStock.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], TransferStock.prototype, "totalAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], TransferStock.prototype, "totalQuantity", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], TransferStock.prototype, "attachment", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], TransferStock.prototype, "reference", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], TransferStock.prototype, "notes", void 0);
__decorate([
    column.date({ autoCreate: false }),
    __metadata("design:type", Object)
], TransferStock.prototype, "transferedAt", void 0);
__decorate([
    belongsTo(() => Storage, {
        foreignKey: 'sourceStorageId',
        localKey: 'id',
    }),
    __metadata("design:type", Object)
], TransferStock.prototype, "sourceStorage", void 0);
__decorate([
    belongsTo(() => Storage, {
        foreignKey: 'destinationStorageId',
        localKey: 'id',
    }),
    __metadata("design:type", Object)
], TransferStock.prototype, "destinationStorage", void 0);
__decorate([
    hasMany(() => TransferStockItem),
    __metadata("design:type", Object)
], TransferStock.prototype, "items", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], TransferStock.prototype, "user", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], TransferStock.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], TransferStock.prototype, "updatedAt", void 0);
//# sourceMappingURL=transfer_stock.js.map