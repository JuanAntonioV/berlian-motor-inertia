import TypeService from '#services/type_service';
export default class TypeController {
    async show({ inertia }) {
        return inertia.render('types/ManageTypePage');
    }
    async list(c) {
        const res = await TypeService.list(c);
        return c.response.status(res.code).json(res);
    }
    async create(c) {
        const res = await TypeService.create(c);
        return c.response.status(res.code).json(res);
    }
    async update(c) {
        const res = await TypeService.update(c);
        return c.response.status(res.code).json(res);
    }
    async delete(c) {
        const res = await TypeService.delete(c);
        return c.response.status(res.code).json(res);
    }
}
//# sourceMappingURL=type_controller.js.map