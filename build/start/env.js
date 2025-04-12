import { Env } from '@adonisjs/core/env';
export default await Env.create(new URL('../', import.meta.url), {
    NODE_ENV: Env.schema.enum(['development', 'production', 'test']),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    HOST: Env.schema.string({ format: 'host' }),
    LOG_LEVEL: Env.schema.string(),
    SESSION_DRIVER: Env.schema.enum(['cookie', 'memory']),
    DB_HOST: Env.schema.string({ format: 'host' }),
    DB_PORT: Env.schema.number(),
    DB_USER: Env.schema.string(),
    DB_PASSWORD: Env.schema.string.optional(),
    DB_DATABASE: Env.schema.string(),
    APP_URL: Env.schema.string({ format: 'url', tld: false }),
    ADMIN_EMAIL: Env.schema.string(),
    ADMIN_PASSWORD: Env.schema.string(),
    VITE_API_URL: Env.schema.string({ format: 'url', tld: false }),
});
//# sourceMappingURL=env.js.map