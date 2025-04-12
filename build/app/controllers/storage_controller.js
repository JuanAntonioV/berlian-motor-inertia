import StorageService from '#services/storage_service';
export default class StorageController {
    async show({ inertia }) {
        return inertia.render('storages/ManageStoragePage');
    }
    async list(c) {
        const res = await StorageService.list(c);
        return c.response.status(res.code).json(res);
    }
    async create(c) {
        const res = await StorageService.create(c);
        return c.response.status(res.code).json(res);
    }
    async update(c) {
        const res = await StorageService.update(c);
        return c.response.status(res.code).json(res);
    }
    async delete(c) {
        const res = await StorageService.delete(c);
        return c.response.status(res.code).json(res);
    }
}
//# sourceMappingURL=storage_controller.js.map