import vine from '@vinejs/vine'

export const staffValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(255),
    roles: vine.array(vine.number()),
    image: vine.string().optional(),
    phone: vine.string().minLength(10).maxLength(15),
  })
)

export const updateStaffValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    email: vine.string().email(),
    roles: vine.array(vine.number()),
    image: vine.string().optional(),
    phone: vine.string().minLength(10).maxLength(15),
  })
)
