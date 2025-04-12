import User from '#models/user';
import AuthService from '#services/auth_service';
export default class AuthController {
    async showLogin({ inertia }) {
        const isAdminExist = await User.isAdminExist();
        return inertia.render('auth/LoginPage', {
            isAdminExist: !!isAdminExist,
        });
    }
    async doLogin(ctx) {
        const res = await AuthService.doLogin(ctx);
        return ctx.response.status(res.code).json(res);
    }
    async doLogout(ctx) {
        const res = await AuthService.doLogout(ctx);
        return ctx.response.status(res.code).json(res);
    }
    async generateAdmin(ctx) {
        const res = await AuthService.generateAdmin(ctx);
        return ctx.response.status(res.code).json(res);
    }
    async getUser(ctx) {
        const res = await AuthService.getUser(ctx);
        return ctx.response.status(res.code).json(res);
    }
}
//# sourceMappingURL=auth_controller.js.map