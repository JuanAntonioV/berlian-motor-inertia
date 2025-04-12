import ProfileService from '#services/profile_service';
export default class ProfileController {
    async show({ inertia }) {
        return inertia.render('profiles/ProfilePage');
    }
    async update(ctx) {
        const res = await ProfileService.update(ctx);
        return ctx.response.status(res.code).json(res);
    }
    async doResetPassword(ctx) {
        const res = await ProfileService.doResetPassword(ctx);
        return ctx.response.status(res.code).json(res);
    }
}
//# sourceMappingURL=profile_controller.js.map