import vine from '@vinejs/vine';
export const transferStockValidator = vine.compile(vine.object({
    id: vine.string().maxLength(20).optional().nullable(),
    sourceStorageId: vine.number(),
    destinationStorageId: vine.number(),
    items: vine.array(vine.object({
        id: vine.number(),
        quantity: vine.number(),
    })),
    transferedAt: vine.date(),
    notes: vine.string().optional(),
    reference: vine.string().optional(),
    attachment: vine
        .file({
        size: '20mb',
        extnames: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    })
        .nullable()
        .optional(),
}));
//# sourceMappingURL=transfer_stock.js.map