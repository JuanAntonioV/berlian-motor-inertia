import vine from '@vinejs/vine'

export const resetPasswordValidator = vine.compile(
  vine.object({
    oldPassword: vine.string().maxLength(30),
    password: vine.string().maxLength(30).minLength(6),
    confirmPassword: vine.string().maxLength(30).minLength(6).sameAs('password'),
  })
)
