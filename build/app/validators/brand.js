import vine from '@vinejs/vine';
export const createBrandValidator = vine.compile(vine.object({
    name: vine.string().unique({
        table: 'brands',
        column: 'name',
    }),
    description: vine.string().optional(),
}));
export const brandValidator = vine.compile(vine.object({
    name: vine.string(),
    description: vine.string().optional(),
}));
//# sourceMappingURL=brand.js.map