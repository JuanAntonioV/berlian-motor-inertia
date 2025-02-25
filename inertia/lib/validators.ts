import { z } from './zod'

export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6, 'Password minimal 6 karakter').trim(),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6, 'Password minimal 6 karakter').trim(),
  name: z.string().min(3, 'Nama minimal 3 karakter').trim(),
})

export const forgetPasswordSchema = z.object({
  email: z.string().email(),
})

export const deleteByIdSchema = z.object({
  id: z.coerce.number(),
})

export const paramsValidator = z.object({
  id: z.coerce.number().nullish(),
  page: z.coerce.number().default(1).nullable(),
  limit: z.coerce.number().default(10).nullable(),
  sort: z.string().default('id').nullable(),
  order: z.string().default('asc').nullable(),
  search: z.string().default('').nullable(),
  skip: z.coerce.number().default(0).nullable(),
})

export const categorySchema = z.object({
  name: z
    .string({
      required_error: 'Nama wajib diisi',
      invalid_type_error: 'Nama tidak valid',
      message: 'Nama tidak valid',
    })
    .min(1, 'Nama tidak boleh kosong')
    .max(255, 'Nama maksimal 255 karakter'),
})
