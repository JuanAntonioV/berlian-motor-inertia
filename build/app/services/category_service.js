import { categoryValidator, createCategoryValidator } from '#validators/category';
import ResponseHelper from '../helpers/response_helper.js';
import Category from '#models/category';
import { errors as lucidErrors } from '@adonisjs/lucid';
export default class CategoryService {
    static async list({} = {}) {
        try {
            const categories = await Category.all();
            return ResponseHelper.okResponse(categories);
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async create({ request }) {
        const { name, description } = await request.validateUsing(createCategoryValidator);
        try {
            const newCategory = new Category();
            newCategory.name = name;
            newCategory.description = description ?? null;
            await newCategory.save();
            return ResponseHelper.okResponse(newCategory, 'Kategori berhasil dibuat');
        }
        catch (err) {
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
    static async update({ request, params }) {
        const { name, description } = await request.validateUsing(categoryValidator);
        try {
            const category = await Category.findOrFail(params.id);
            if (category.name !== name) {
                const existingCategory = await Category.findBy('name', name);
                if (existingCategory) {
                    return ResponseHelper.badRequestResponse('Nama kategori sudah ada');
                }
                category.name = name;
            }
            category.description = description ?? null;
            await category.save();
            return ResponseHelper.okResponse(category, 'Kategori berhasil diupdate');
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
            const category = await Category.findOrFail(params.id);
            await category.delete();
            return ResponseHelper.okResponse(category, 'Kategori berhasil dihapus');
        }
        catch (err) {
            if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
                return ResponseHelper.notFoundResponse(err.message);
            }
            return ResponseHelper.serverErrorResponse(err.message);
        }
    }
}
//# sourceMappingURL=category_service.js.map