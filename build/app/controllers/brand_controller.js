import BrandService from '#services/brand_service';
export default class BrandController {
    async show({ inertia }) {
        return inertia.render('brands/ManageBrandPage');
    }
    async list(c) {
        const res = await BrandService.list(c);
        return c.response.status(res.code).json(res);
    }
    async create(c) {
        const res = await BrandService.create(c);
        return c.response.status(res.code).json(res);
    }
    async update(c) {
        const res = await BrandService.update(c);
        return c.response.status(res.code).json(res);
    }
    async delete(c) {
        const res = await BrandService.delete(c);
        return c.response.status(res.code).json(res);
    }
}
//# sourceMappingURL=brand_controller.js.map