import vine from '@vinejs/vine'

export const goodsReceiptValidator = vine.compile(
  vine.object({
    id: vine.string().maxLength(20).optional().nullable(),
    supplierName: vine.string().maxLength(255),
    storageId: vine.number(),
    items: vine.array(
      vine.object({
        id: vine.number(),
        quantity: vine.number(),
        price: vine.number(),
      })
    ),
    notes: vine.string().optional(),
    reference: vine.string().optional(),
    attachment: vine
      .file({
        size: '20mb',
        extnames: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      })
      .nullable()
      .optional(),
  })
)
