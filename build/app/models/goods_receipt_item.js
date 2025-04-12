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
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import GoodsReceipt from './goods_receipt.js';
import Product from './product.js';
export default class GoodsReceiptItem extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], GoodsReceiptItem.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], GoodsReceiptItem.prototype, "goodsReceiptId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], GoodsReceiptItem.prototype, "productId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], GoodsReceiptItem.prototype, "quantity", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], GoodsReceiptItem.prototype, "price", void 0);
__decorate([
    belongsTo(() => GoodsReceipt),
    __metadata("design:type", Object)
], GoodsReceiptItem.prototype, "goodsReceipt", void 0);
__decorate([
    belongsTo(() => Product),
    __metadata("design:type", Object)
], GoodsReceiptItem.prototype, "product", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], GoodsReceiptItem.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], GoodsReceiptItem.prototype, "updatedAt", void 0);
//# sourceMappingURL=goods_receipt_item.js.map