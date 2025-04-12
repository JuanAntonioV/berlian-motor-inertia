import User from '#models/user';
import env from '#start/env';
import { defineConfig } from '@adonisjs/inertia';
const inertiaConfig = defineConfig({
    rootView: 'inertia_layout',
    sharedData: {
        user: async (ctx) => {
            const user = ctx?.auth?.user;
            if (!user) {
                return ctx.inertia.always(() => null);
            }
            const userSerialized = user.serialize();
            let imageUrl = null;
            if (user?.image) {
                const absolutePath = `${env.get('APP_URL')}${user.image}`;
                imageUrl = absolutePath;
            }
            const userWithRoleAndPermissions = {
                ...userSerialized,
                image: imageUrl,
                roles: await User.getRoles(user),
                permissions: await User.getPermissions(user),
            };
            return ctx.inertia.always(() => userWithRoleAndPermissions);
        },
    },
    ssr: {
        enabled: false,
        entrypoint: 'inertia/app/ssr.tsx',
    },
});
export default inertiaConfig;
//# sourceMappingURL=inertia.js.map