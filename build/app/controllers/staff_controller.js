import Role from '#models/role';
import StaffService from '#services/staff_service';
export default class StaffController {
    async show({ inertia }) {
        return inertia.render('staffs/ManageStaffPage');
    }
    async showCreate({ inertia }) {
        const roleList = await Role.query().select('id', 'name').exec();
        return inertia.render('staffs/CreateStaffPage', {
            roleList: inertia.defer(() => roleList),
        });
    }
    async showEdit({ inertia, params }) {
        const id = params.id;
        const roleList = await Role.query().select('id', 'name').exec();
        return inertia.render('staffs/EditStaffPage', {
            roleList: inertia.defer(() => roleList),
            id,
        });
    }
    async list(c) {
        const res = await StaffService.list(c);
        return c.response.status(res.code).json(res);
    }
    async detail(c) {
        const res = await StaffService.detail(c);
        return c.response.status(res.code).json(res);
    }
    async create(c) {
        const res = await StaffService.create(c);
        return c.response.status(res.code).json(res);
    }
    async update(c) {
        const res = await StaffService.update(c);
        return c.response.status(res.code).json(res);
    }
    async delete(c) {
        const res = await StaffService.delete(c);
        return c.response.status(res.code).json(res);
    }
}
//# sourceMappingURL=staff_controller.js.map