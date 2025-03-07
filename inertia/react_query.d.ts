import '@tanstack/react-query'

interface ApiError {
  code: number
  status: boolean
  message: string
  erorr: Record<string, unknown> | null
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}
