import vine from '@vinejs/vine'

export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().unique({
      table: 'categories',
      column: 'name',
    }),
    description: vine.string().nullable(),
  })
)

export const categoryValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().nullable(),
  })
)
