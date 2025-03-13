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

export const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Password minimal 6 karakter').trim(),
    password: z.string().min(6, 'Password minimal 6 karakter').trim(),
    confirmPassword: z.string().min(6, 'Password minimal 6 karakter').trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: 'Password baru tidak boleh sama dengan password lama',
    path: ['password'],
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
  description: z.string().nullish(),
})

export const brandSchema = categorySchema
export const typeSchema = categorySchema

export const profileSchema = z.object({
  fullName: z
    .string({
      required_error: 'Nama lengkap wajib diisi',
      invalid_type_error: 'Nama lengkap tidak valid',
      message: 'Nama lengkap tidak valid',
    })
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(255, 'Nama lengkap maksimal 255 karakter'),
  phone: z.string().nullable(),
  email: z
    .string({
      required_error: 'Email wajib diisi',
      invalid_type_error: 'Email tidak valid',
      message: 'Email tidak valid',
    })
    .email('Email tidak valid'),
  image: z.instanceof(File).nullish(),
})

export const storageSchema = z.object({
  name: z
    .string({
      required_error: 'Nama wajib diisi',
      invalid_type_error: 'Nama tidak valid',
      message: 'Nama tidak valid',
    })
    .min(1, 'Nama tidak boleh kosong')
    .max(255, 'Nama maksimal 255 karakter'),
  description: z.string().nullish(),
  image: z.instanceof(File).nullish(),
})

export const productSchema = z.object({
  name: z
    .string({
      required_error: 'Nama wajib diisi',
      invalid_type_error: 'Nama tidak valid',
      message: 'Nama tidak valid',
    })
    .min(1, 'Nama tidak boleh kosong')
    .max(255, 'Nama maksimal 255 karakter'),
  brandId: z.coerce.number(),
  typeId: z.coerce.number().nullish(),
  categoryIds: z.array(z.coerce.number()).default([]),
  sku: z.string().nullish(),
  description: z.string().nullish(),
  image: z.instanceof(File).nullish(),
  salePrice: z.coerce.number().default(0),
  supplierPrice: z.coerce.number().default(0),
  wholesalePrice: z.coerce.number().default(0),
  retailPrice: z.coerce.number().default(0),
  workshopPrice: z.coerce.number().default(0),
})

export const staffSchema = z
  .object({
    fullName: z
      .string({
        required_error: 'Nama wajib diisi',
        invalid_type_error: 'Nama tidak valid',
        message: 'Nama tidak valid',
      })
      .min(1, 'Nama tidak boleh kosong')
      .max(255, 'Nama maksimal 255 karakter'),
    email: z
      .string({
        required_error: 'Email wajib diisi',
        invalid_type_error: 'Email tidak valid',
        message: 'Email tidak valid',
      })
      .email('Email tidak valid'),
    joinDate: z.date().nullable(),
    phone: z.string().nullable(),
    password: z.string().min(6, 'Password minimal 6 karakter').trim(),
    confirmPassword: z.string().min(6, 'Password minimal 6 karakter').trim(),
    roles: z.coerce.number(),
    image: z.instanceof(File).nullish(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  })

export const updateStaffSchema = z.object({
  fullName: z
    .string({
      required_error: 'Nama wajib diisi',
      invalid_type_error: 'Nama tidak valid',
      message: 'Nama tidak valid',
    })
    .min(1, 'Nama tidak boleh kosong')
    .max(255, 'Nama maksimal 255 karakter'),
  email: z
    .string({
      required_error: 'Email wajib diisi',
      invalid_type_error: 'Email tidak valid',
      message: 'Email tidak valid',
    })
    .email('Email tidak valid'),
  joinDate: z.date().nullable(),
  phone: z.string().nullable(),
  password: z.string().nullish(),
  confirmPassword: z.string().nullish(),
  roles: z.coerce.number(),
  image: z.instanceof(File).nullish(),
})

export const stockSchema = z.object({
  quantity: z.coerce.number(),
  storageId: z.coerce.number(),
})
