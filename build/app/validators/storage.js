import vine from '@vinejs/vine';
export const createStorageValidator = vine.compile(vine.object({
    name: vine.string().unique({
        table: 'storages',
        column: 'name',
    }),
    description: vine.string().optional(),
    image: vine
        .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
    })
        .nullable()
        .optional(),
}));
export const storageValidator = vine.compile(vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    image: vine
        .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
    })
        .nullable()
        .optional(),
}));
//# sourceMappingURL=storage.js.map