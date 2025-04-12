import User from '#models/user';
export default class CheckPermissionMiddleware {
    async handle(ctx, next) {
        const userId = ctx.auth.user?.id;
        if (userId) {
            const user = await User.query().where('id', userId).first();
            if (!user) {
                return ctx.response.status(403).json({
                    message: 'Forbidden',
                });
            }
            const userRoles = await User.getRoles(user);
            const userPermissions = await User.getPermissions(user);
            const path = ctx.request.url().split('/')[1];
            const canAccess = userPermissions.some((permission) => {
                if (userRoles.some((role) => role.slug === 'super-admin' || role.slug === 'admin')) {
                    return true;
                }
                return permission.startsWith(path);
            });
            if (!canAccess) {
                return ctx.response.redirect('/403');
            }
        }
        const output = await next();
        return output;
    }
}
//# sourceMappingURL=check_permission_middleware.js.map