import { storageValidator, createStorageValidator } from '#validators/storage';
import ResponseHelper from '../helpers/response_helper.js';
import Storage from '#models/storage';
import { errors as lucidErrors } from '@adonisjs/lucid';
import { cuid } from '@adonisjs/core/helpers';
import app from '@adonisjs/core/services/app';
import { unlink } from 'node:fs/promises';
import logger from '@adonisjs/core/services/logger';
import env from '#start/env';
export default class StorageService {
    static async list({}) {
        try {
            const storages = await Storage.all();
            storages.forEach((category) => {
                if (category.image) {
                    const absolutePath = `${env.get('APP_URL')}${category.image}`;
                    category.image = absolutePath;
                }
            });
            return ResponseHelper.okResponse(storages);
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async create({ request }) {
        const { name, description } = await request.validateUsing(createStorageValidator);
        try {
            const newStorage = new Storage();
            newStorage.name = name;
            newStorage.description = description ?? null;
            const image = request.file('image');
            if (image) {
                const filename = `${cuid()}.${image.extname}`;
                const folderPath = 'storage/uploads';
                await image.move(app.makePath(folderPath), {
                    name: filename,
                });
                const filePath = `/${folderPath}/${filename}`;
                newStorage.image = filePath;
            }
            await newStorage.save();
            return ResponseHelper.okResponse(newStorage, 'Rak berhasil dibuat');
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async update({ request, params }) {
        const { name, description } = await request.validateUsing(storageValidator);
        try {
            const storage = await Storage.findOrFail(params.id);
            if (storage.name !== name) {
                const existingStorage = await Storage.findBy('name', name);
                if (existingStorage) {
                    return ResponseHelper.badRequestResponse('Nama rak sudah ada');
                }
                storage.name = name;
            }
            storage.description = description ?? null;
            const image = request.file('image');
            if (image) {
                const oldImage = storage.image;
                if (oldImage) {
                    const path = `storage/uploads/${oldImage}`;
                    await unlink(app.makePath(path)).catch((e) => {
                        logger.info(`Failed to delete old profile image: ${e.message}`);
                    });
                }
                const filename = `${cuid()}.${image.extname}`;
                const folderPath = 'storage/uploads';
                await image.move(app.makePath(folderPath), {
                    name: filename,
                });
                const filePath = `/${folderPath}/${filename}`;
                storage.image = filePath;
            }
            await storage.save();
            return ResponseHelper.okResponse(storage, 'Rak berhasil diupdate');
        }
        catch (err) {
            if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
                return ResponseHelper.notFoundResponse(err.message);
            }
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async delete({ params }) {
        try {
            const storage = await Storage.findOrFail(params.id);
            if (storage.image) {
                const path = `storage/uploads/${storage.image}`;
                await unlink(app.makePath(path)).catch((e) => {
                    logger.info(`Failed to delete old profile image: ${e.message}`);
                });
            }
            await storage.delete();
            return ResponseHelper.okResponse(storage, 'Rak berhasil dihapus');
        }
        catch (err) {
            if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
                return ResponseHelper.notFoundResponse(err.message);
            }
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
}
//# sourceMappingURL=storage_service.js.map