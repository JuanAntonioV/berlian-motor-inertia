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
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm';
import Category from './category.js';
import Brand from './brand.js';
import Type from './type.js';
import ProductStock from './product_stock.js';
import env from '#start/env';
export default class Product extends BaseModel {
    static async generateSKU() {
        const prefix = 'SK';
        const lastId = await this.query().orderBy('id', 'desc').first();
        if (!lastId) {
            return `${prefix}-0001`;
        }
        const lastSKU = lastId.sku.split('-')[1];
        const number = ('000' + (Number(lastSKU) + 1)).slice(-4);
        const sku = await this.findBy('sku', `${prefix}-${number}`);
        if (sku) {
            await this.generateSKU();
        }
        return `${prefix}-${number}`;
    }
    serializeExtras = true;
    serialize(cherryPick) {
        const serialized = super.serialize(cherryPick);
        if (this.image) {
            const absolutePath = `${env.get('APP_URL')}${this.image}`;
            serialized.image = absolutePath;
        }
        return serialized;
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Product.prototype, "brandId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Product.prototype, "typeId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    column({
        prepare: (value) => {
            if (!value) {
                return Product.generateSKU();
            }
            return value.toUpperCase();
        },
    }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Product.prototype, "description", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Product.prototype, "image", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Product.prototype, "salePrice", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Product.prototype, "supplierPrice", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Product.prototype, "wholesalePrice", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Product.prototype, "retailPrice", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Product.prototype, "workshopPrice", void 0);
__decorate([
    manyToMany(() => Category, {
        pivotTable: 'product_categories',
    }),
    __metadata("design:type", Object)
], Product.prototype, "categories", void 0);
__decorate([
    belongsTo(() => Brand),
    __metadata("design:type", Object)
], Product.prototype, "brand", void 0);
__decorate([
    belongsTo(() => Type),
    __metadata("design:type", Object)
], Product.prototype, "type", void 0);
__decorate([
    hasMany(() => ProductStock),
    __metadata("design:type", Object)
], Product.prototype, "stocks", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Product.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Product.prototype, "updatedAt", void 0);
//# sourceMappingURL=product.js.map