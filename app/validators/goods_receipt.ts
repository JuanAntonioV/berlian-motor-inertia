import vine from '@vinejs/vine'

export const goodsReceiptValidator = vine.compile(
  vine.object({
    id: vine.string().maxLength(20).optional().nullable(),
    supplierId: vine.number(),
    items: vine.array(
      vine.object({
        productId: vine.number(),
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
