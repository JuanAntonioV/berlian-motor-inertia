import vine from '@vinejs/vine'

export const createTypeValidator = vine.compile(
  vine.object({
    name: vine.string().unique({
      table: 'types',
      column: 'name',
    }),
    description: vine.string().optional(),
  })
)

export const typeValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().optional(),
  })
)
