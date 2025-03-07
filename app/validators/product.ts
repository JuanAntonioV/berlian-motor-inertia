import vine from '@vinejs/vine'

export const productValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1),
    description: vine.string().nullable().optional(),
    brandId: vine.number(),
    typeId: vine.number(),
    categoryIds: vine.array(vine.number()).nullable().optional(),
    sku: vine.string().nullable().optional(),
    salePrice: vine.number(),
    supplierPrice: vine.number(),
    wholesalePrice: vine.number(),
    retailPrice: vine.number(),
    workshopPrice: vine.number().nullable().optional(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
      })
      .nullable()
      .optional(),
  })
)
