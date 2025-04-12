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
import User from './user.js';
import ReductionOfGoodItem from './reduction_of_good_item.js';
export default class ReductionOfGood extends BaseModel {
    static async generateInvoiceNumber() {
        const prefix = 'ROG';
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
                return ReductionOfGood.generateInvoiceNumber();
            }
            return value.toUpperCase();
        },
    }),
    __metadata("design:type", String)
], ReductionOfGood.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ReductionOfGood.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ReductionOfGood.prototype, "totalAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ReductionOfGood.prototype, "totalQuantity", void 0);
__decorate([
    column.date({ autoCreate: true }),
    __metadata("design:type", Object)
], ReductionOfGood.prototype, "reducedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ReductionOfGood.prototype, "reference", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ReductionOfGood.prototype, "attachment", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ReductionOfGood.prototype, "notes", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], ReductionOfGood.prototype, "user", void 0);
__decorate([
    hasMany(() => ReductionOfGoodItem),
    __metadata("design:type", Object)
], ReductionOfGood.prototype, "items", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], ReductionOfGood.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], ReductionOfGood.prototype, "updatedAt", void 0);
//# sourceMappingURL=reduction_of_good.js.map