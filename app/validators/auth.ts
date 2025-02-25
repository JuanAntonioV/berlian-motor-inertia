import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().maxLength(30),
    rememberMe: vine.boolean().optional(),
  })
)
