import '@tanstack/react-query'

interface ValidationError {
  message: string
  rule: string
  field: string
}

interface ApiError {
  code: number
  status: boolean
  message: string
  erorr: Record<string, unknown> | null
  errors?: ValidationError[] | null
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}
