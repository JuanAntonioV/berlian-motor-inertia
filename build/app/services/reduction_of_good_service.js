import { reductionOfGoodValidator } from '#validators/reduction_of_good';
import ResponseHelper from '../helpers/response_helper.js';
import ReductionOfGood from '#models/reduction_of_good';
import { errors as lucidErrors } from '@adonisjs/lucid';
import { cuid } from '@adonisjs/core/helpers';
import app from '@adonisjs/core/services/app';
import env from '#start/env';
import db from '@adonisjs/lucid/services/db';
import Product from '#models/product';
import ProductStock from '#models/product_stock';
import Storage from '#models/storage';
import { DateTime } from 'luxon';
export default class ReductionOfGoodService {
    static async list({}) {
        try {
            const reductionOfGood = await ReductionOfGood.query().preload('user').exec();
            return ResponseHelper.okResponse(reductionOfGood);
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async stats({}) {
        try {
            const totalTransactionQuery = ReductionOfGood.query().count('id', 'total').firstOrFail();
            const totalAmountQuery = ReductionOfGood.query().sum('totalAmount', 'total').firstOrFail();
            const lastUpdated = new Date().toISOString();
            const [totalReductionOfGood, totalAmount] = await Promise.all([
                totalTransactionQuery,
                totalAmountQuery,
            ]);
            return ResponseHelper.okResponse({
                totalTransaction: totalReductionOfGood.$extras.total,
                totalAmount: totalAmount.$extras.total,
                lastUpdated,
            });
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async create({ request, auth }) {
        const { id, items, notes, reference, storageId, reducedAt } = await request.validateUsing(reductionOfGoodValidator);
        const storageValid = await Storage.query().where('id', storageId).first();
        if (!storageValid) {
            return ResponseHelper.badRequestResponse('Gudang tidak valid');
        }
        try {
            const totalValidProduct = await Product.query()
                .whereIn('id', items.map((item) => item.id))
                .count('id', 'total')
                .firstOrFail();
            if (Number(totalValidProduct.$extras.total) !== items.length) {
                return ResponseHelper.badRequestResponse('Terdapat produk yang tidak valid');
            }
        }
        catch (err) {
            if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
                return ResponseHelper.badRequestResponse('Produk tidak valid');
            }
            return ResponseHelper.badRequestResponse('Produk tidak valid');
        }
        const user = auth.user;
        const trx = await db.transaction();
        try {
            let invoiceNumber = id;
            if (!invoiceNumber) {
                invoiceNumber = await ReductionOfGood.generateInvoiceNumber();
            }
            const attachment = request.file('attachment');
            let attachmentPath = null;
            if (attachment) {
                const filename = `${cuid()}.${attachment.extname}`;
                const folderPath = 'storage/uploads/reduction_of_good';
                await attachment.move(app.makePath(folderPath), {
                    name: filename,
                });
                const filePath = `/${folderPath}/${filename}`;
                attachmentPath = filePath;
            }
            const totalAmount = items.reduce((acc, item) => {
                return acc + item.price;
            }, 0);
            const totalQty = items.reduce((acc, item) => {
                return acc + item.quantity;
            }, 0);
            const newReductionOfGood = await ReductionOfGood.create({
                id: invoiceNumber,
                userId: user.id,
                reference: reference || null,
                notes: notes || null,
                attachment: attachmentPath,
                totalAmount,
                totalQuantity: totalQty,
                reducedAt: DateTime.fromJSDate(reducedAt),
            }, { client: trx });
            const reductionOfGoodItems = items.map((item) => {
                return {
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                };
            });
            newReductionOfGood.related('items').createMany(reductionOfGoodItems, { client: trx });
            const currProductStock = await ProductStock.query({ client: trx })
                .whereIn('productId', items.map((item) => item.id))
                .where('storageId', storageId)
                .select('productId', 'quantity')
                .exec();
            const newProductStock = items.map((item) => {
                const stock = currProductStock.find((productStock) => productStock.productId === Number(item.id));
                if (stock) {
                    const quantity = stock.quantity - item.quantity;
                    return {
                        productId: item.id,
                        storageId: storageId,
                        quantity: quantity,
                    };
                }
                else {
                    return {
                        productId: item.id,
                        storageId: storageId,
                        quantity: item.quantity * -1,
                    };
                }
            });
            const isValidStock = newProductStock.every((item) => {
                return item.quantity >= 0;
            });
            if (!isValidStock) {
                trx.rollback();
                return ResponseHelper.badRequestResponse('Stok tidak cukup');
            }
            for (const item of newProductStock) {
                const productStock = await ProductStock.query({ client: trx })
                    .where('productId', item.productId)
                    .where('storageId', item.storageId)
                    .first();
                if (!productStock) {
                    await ProductStock.create({
                        productId: item.productId,
                        storageId: item.storageId,
                        quantity: item.quantity,
                    }, { client: trx });
                }
                else {
                    if (item.quantity <= 0) {
                        await ProductStock.query({ client: trx })
                            .where('productId', item.productId)
                            .where('storageId', item.storageId)
                            .delete();
                    }
                    else {
                        await ProductStock.query({ client: trx })
                            .where('productId', item.productId)
                            .where('storageId', item.storageId)
                            .update({ quantity: item.quantity });
                    }
                }
            }
            trx.commit();
            return ResponseHelper.okResponse(newReductionOfGood, 'Pengurangan barang berhasil dibuat');
        }
        catch (err) {
            trx.rollback();
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async detail({ params }) {
        try {
            const reductionOfGood = await ReductionOfGood.query()
                .preload('items', (query) => {
                query.preload('product');
            })
                .preload('user')
                .where('id', params.id)
                .firstOrFail();
            if (reductionOfGood.attachment) {
                const absolutePath = `${env.get('APP_URL')}${reductionOfGood.attachment}`;
                reductionOfGood.attachment = absolutePath;
            }
            return ResponseHelper.okResponse(reductionOfGood, 'Pengurangan barang berhasil dapatkan');
        }
        catch (err) {
            if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
                return ResponseHelper.notFoundResponse(err.message);
            }
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async downloadAttachment({ request, response }) {
        const id = request.param('id');
        try {
            const reductionOfGood = await ReductionOfGood.query().where('id', id).firstOrFail();
            if (!reductionOfGood.attachment) {
                return ResponseHelper.badRequestResponse('Tidak ada lampiran yang ditemukan');
            }
            const filePath = app.makePath(reductionOfGood.attachment.replace(/^\//, ''));
            const generateEtag = true;
            return response.download(filePath, generateEtag, (error) => {
                if (error.code === 'ENOENT') {
                    return ['File tidak ditemukan', 404];
                }
                return ['Terjadi kesalahan saat mengunduh file', 500];
            });
        }
        catch (e) {
            return ResponseHelper.serverErrorResponse(e.message);
        }
    }
}
//# sourceMappingURL=reduction_of_good_service.js.map