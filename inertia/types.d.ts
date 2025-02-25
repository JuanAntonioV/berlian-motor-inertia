export type TFormState<T = any> = {
  successMessage?: string
  errors?: StringMap | null
  message?: string
  data?: T
}

export type StringMap = Record<string, string>

export type StringToBooleanMap = Record<string, boolean>

export type TQueryParams = {
  page: number
  limit: number
  sort: string
  order?: string
  search: string
  skip: number
}

export type TStatItem = {
  id: string
  name: string
  value: number | string
  description: string
  type: 'currency' | 'number' | 'date'
}

export type SortingState = ColumnSort[]

export type TSearchParamsData<VT> = {
  [key: string]: VT
}

export type TSubMenus = {
  id: number
  label: string
  href: string
  roles?: number[]
}

export type TMenu = {
  id: number
  icon?: React.ReactNode
  label: string
  href: string
  subMenus?: TSubMenus[]
  roles?: string[]
}
