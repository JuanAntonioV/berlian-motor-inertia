import { defineConfig } from '@adonisjs/shield';
const shieldConfig = defineConfig({
    csp: {
        enabled: false,
        directives: {},
        reportOnly: false,
    },
    csrf: {
        enabled: true,
        exceptRoutes: [],
        enableXsrfCookie: true,
        methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
        cookieOptions: {
            httpOnly: true,
            sameSite: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        },
    },
    xFrame: {
        enabled: true,
        action: 'DENY',
    },
    hsts: {
        enabled: true,
        maxAge: '180 days',
    },
    contentTypeSniffing: {
        enabled: true,
    },
});
export default shieldConfig;
//# sourceMappingURL=shield.js.map