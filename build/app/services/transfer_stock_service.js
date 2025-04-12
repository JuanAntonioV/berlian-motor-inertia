import { transferStockValidator } from '#validators/transfer_stock';
import ResponseHelper from '../helpers/response_helper.js';
import TransferStock from '#models/transfer_stock';
import { errors as lucidErrors } from '@adonisjs/lucid';
import { cuid } from '@adonisjs/core/helpers';
import app from '@adonisjs/core/services/app';
import env from '#start/env';
import db from '@adonisjs/lucid/services/db';
import Product from '#models/product';
import ProductStock from '#models/product_stock';
import Storage from '#models/storage';
import { DateTime } from 'luxon';
export default class TransferStockService {
    static async list({}) {
        try {
            const transferStock = await TransferStock.query()
                .preload('user')
                .preload('sourceStorage')
                .preload('destinationStorage')
                .exec();
            return ResponseHelper.okResponse(transferStock);
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async stats({}) {
        try {
            const totalTransactionQuery = TransferStock.query().count('id', 'total').firstOrFail();
            const totalAmountQuery = TransferStock.query().sum('totalAmount', 'total').firstOrFail();
            const lastUpdated = new Date().toISOString();
            const [totalTransferStock, totalAmount] = await Promise.all([
                totalTransactionQuery,
                totalAmountQuery,
            ]);
            return ResponseHelper.okResponse({
                totalTransaction: totalTransferStock.$extras.total,
                totalAmount: totalAmount.$extras.total,
                lastUpdated,
            });
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async create({ request, auth }) {
        const { id, items, notes, reference, transferedAt, sourceStorageId, destinationStorageId } = await request.validateUsing(transferStockValidator);
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
        try {
            const sourceStorage = await Storage.findOrFail(sourceStorageId);
            const destinationStorage = await Storage.findOrFail(destinationStorageId);
            if (!sourceStorage || !destinationStorage) {
                return ResponseHelper.badRequestResponse('Terdapat rak yang tidak valid');
            }
            if (sourceStorage.id === destinationStorage.id) {
                return ResponseHelper.badRequestResponse('Rak dan tujuan tidak boleh sama');
            }
        }
        catch (err) {
            if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
                return ResponseHelper.badRequestResponse('Terdapat rak yang tidak valid');
            }
            return ResponseHelper.badRequestResponse('Terdapat rak yang tidak valid');
        }
        const user = auth.user;
        const trx = await db.transaction();
        try {
            let invoiceNumber = id;
            if (!invoiceNumber) {
                invoiceNumber = await TransferStock.generateInvoiceNumber();
            }
            const attachment = request.file('attachment');
            let attachmentPath = null;
            if (attachment) {
                const filename = `${cuid()}.${attachment.extname}`;
                const folderPath = 'storage/uploads/transfer_stock';
                await attachment.move(app.makePath(folderPath), {
                    name: filename,
                });
                const filePath = `/${folderPath}/${filename}`;
                attachmentPath = filePath;
            }
            const totalAmount = items.length;
            const totalQty = items.reduce((acc, item) => {
                return acc + item.quantity;
            }, 0);
            const newTransferStock = await TransferStock.create({
                id: invoiceNumber,
                userId: user.id,
                reference: reference || null,
                notes: notes || null,
                attachment: attachmentPath,
                sourceStorageId: sourceStorageId,
                destinationStorageId: destinationStorageId,
                totalAmount,
                totalQuantity: totalQty,
                transferedAt: DateTime.fromJSDate(transferedAt),
            }, { client: trx });
            const transferStockItems = items.map((item) => {
                return {
                    productId: item.id,
                    quantity: item.quantity,
                };
            });
            newTransferStock.related('items').createMany(transferStockItems, { client: trx });
            const productStocks = await ProductStock.query()
                .whereIn('productId', items.map((item) => item.id))
                .whereIn('storageId', [sourceStorageId, destinationStorageId])
                .exec();
            for (const item of items) {
                const productStock = productStocks.find((stock) => {
                    return stock.productId === item.id && stock.storageId === sourceStorageId;
                });
                if (!productStock) {
                    return ResponseHelper.badRequestResponse('Stok tidak mencukupi');
                }
                if (productStock.quantity < item.quantity) {
                    return ResponseHelper.badRequestResponse('Stok tidak mencukupi');
                }
                const reducedQty = productStock.quantity - item.quantity;
                if (reducedQty <= 0) {
                    await ProductStock.query({ client: trx })
                        .where('productId', item.id)
                        .where('storageId', sourceStorageId)
                        .delete();
                }
                else {
                    await ProductStock.query({ client: trx })
                        .where('productId', item.id)
                        .where('storageId', sourceStorageId)
                        .update({ quantity: reducedQty });
                }
                const destinationProductStock = await ProductStock.query()
                    .where('productId', item.id)
                    .where('storageId', destinationStorageId)
                    .first();
                if (destinationProductStock) {
                    await ProductStock.query({ client: trx })
                        .where('productId', item.id)
                        .where('storageId', destinationStorageId)
                        .update({ quantity: destinationProductStock.quantity + item.quantity });
                }
                else {
                    await ProductStock.create({
                        productId: item.id,
                        storageId: destinationStorageId,
                        quantity: item.quantity,
                    });
                }
            }
            trx.commit();
            return ResponseHelper.okResponse(newTransferStock, 'Pengurangan barang berhasil dibuat');
        }
        catch (err) {
            trx.rollback();
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async detail({ params }) {
        try {
            const transferStock = await TransferStock.query()
                .preload('sourceStorage')
                .preload('destinationStorage')
                .preload('items', (query) => {
                query.preload('product');
            })
                .preload('user')
                .where('id', params.id)
                .firstOrFail();
            if (transferStock.attachment) {
                const absolutePath = `${env.get('APP_URL')}${transferStock.attachment}`;
                transferStock.attachment = absolutePath;
            }
            return ResponseHelper.okResponse(transferStock, 'Pengurangan barang berhasil dapatkan');
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
            const transferStock = await TransferStock.query().where('id', id).firstOrFail();
            if (!transferStock.attachment) {
                return ResponseHelper.badRequestResponse('Tidak ada lampiran yang ditemukan');
            }
            const filePath = app.makePath(transferStock.attachment.replace(/^\//, ''));
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
//# sourceMappingURL=transfer_stock_service.js.map