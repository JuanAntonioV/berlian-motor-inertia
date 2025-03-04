export interface TFormState<T> {
  successMessage?: string
  errors?: StringMap | null
  message?: string
  data?: T
}

export type StringMap = Record<string, string>

export type StringToBooleanMap = Record<string, boolean>

export interface TQueryParams {
  page: number
  limit: number
  sort: string
  order?: string
  search: string
  skip: number
}

export interface TStatItem {
  id: string
  name: string
  value: number | string
  description: string
  type: 'currency' | 'number' | 'date'
}

export type SortingState = ColumnSort[]

export type TSearchParamsData<VT> = Record<string, VT>

export interface TSubMenus {
  id: number
  label: string
  href: string
  roles?: number[]
}

export interface ProfileMenu {
  icon: React.ReactNode
  title: string
  rightSection?: React.ReactNode
  href?: string
  onClick?: () => void
}

export interface TMenu {
  id: number
  icon?: React.ReactNode
  label: string
  href: string
  subMenus?: TSubMenus[]
  roles?: string[]
}

export interface TRoles {
  id: number
  name: string
  slug: string
  description: string | null
  permissions?: string[]
}

export interface TUser {
  id: number
  fullName: string
  email: string
  image: string
  roles: TRoles[]
  permissions: string[]
  createdAt: Date
}

export interface TCategory {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export type TBrand = TCategory
export type TType = TCategory
