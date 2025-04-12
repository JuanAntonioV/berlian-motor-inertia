import vine from '@vinejs/vine';
export const reductionOfGoodValidator = vine.compile(vine.object({
    id: vine.string().maxLength(20).optional().nullable(),
    storageId: vine.number(),
    items: vine.array(vine.object({
        id: vine.number(),
        quantity: vine.number(),
        price: vine.number(),
    })),
    reducedAt: vine.date(),
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
//# sourceMappingURL=reduction_of_good.js.map