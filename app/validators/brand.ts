import vine from '@vinejs/vine'

export const createBrandValidator = vine.compile(
  vine.object({
    name: vine.string().unique({
      table: 'brands',
      column: 'name',
    }),
    description: vine.string().nullable(),
  })
)

export const brandValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().nullable(),
  })
)
