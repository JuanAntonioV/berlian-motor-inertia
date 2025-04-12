import CategoryService from '#services/category_service';
export default class CategoryController {
    async show({ inertia }) {
        return inertia.render('categories/ManageCategoryPage');
    }
    async list(c) {
        const res = await CategoryService.list(c);
        return c.response.status(res.code).json(res);
    }
    async create(c) {
        const res = await CategoryService.create(c);
        return c.response.status(res.code).json(res);
    }
    async update(c) {
        const res = await CategoryService.update(c);
        return c.response.status(res.code).json(res);
    }
    async delete(c) {
        const res = await CategoryService.delete(c);
        return c.response.status(res.code).json(res);
    }
}
//# sourceMappingURL=category_controller.js.map