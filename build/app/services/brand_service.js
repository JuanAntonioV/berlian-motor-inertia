import { brandValidator, createBrandValidator } from '#validators/brand';
import ResponseHelper from '../helpers/response_helper.js';
import Brand from '#models/brand';
import { errors as lucidErrors } from '@adonisjs/lucid';
export default class BrandService {
    static async list({} = {}) {
        try {
            const categories = await Brand.all();
            return ResponseHelper.okResponse(categories);
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async create({ request }) {
        const { name, description } = await request.validateUsing(createBrandValidator);
        try {
            const newBrand = new Brand();
            newBrand.name = name;
            newBrand.description = description ?? null;
            await newBrand.save();
            return ResponseHelper.okResponse(newBrand, 'Kategori berhasil dibuat');
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async update({ request, params }) {
        const { name, description } = await request.validateUsing(brandValidator);
        try {
            const brand = await Brand.findOrFail(params.id);
            if (brand.name !== name) {
                const existingBrand = await Brand.findBy('name', name);
                if (existingBrand) {
                    return ResponseHelper.badRequestResponse('Nama kategori sudah ada');
                }
                brand.name = name;
            }
            brand.description = description ?? null;
            await brand.save();
            return ResponseHelper.okResponse(brand, 'Kategori berhasil diupdate');
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
            const brand = await Brand.findOrFail(params.id);
            await brand.delete();
            return ResponseHelper.okResponse(brand, 'Kategori berhasil dihapus');
        }
        catch (err) {
            if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
                return ResponseHelper.notFoundResponse(err.message);
            }
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
}
//# sourceMappingURL=brand_service.js.map