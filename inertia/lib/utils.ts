import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TSearchParamsData } from '~/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSearchParams(searchParams: TSearchParamsData<string>) {
  const page: number = Number(searchParams?.page) || 1
  const count: number = Number(searchParams?.count) || 10
  const sort: string = searchParams?.sort || ''
  const order: string = searchParams?.order || ''
  const search: string = searchParams?.search || ''
  const from: string = searchParams?.from || ''
  const to: string = searchParams?.to || ''
  const skip: number = (page - 1) * count

  return { page, count, sort, order, search, from, to, skip }
}
