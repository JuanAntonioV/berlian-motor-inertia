import { TRoles } from '~/types'

export function getFormatedAvatarName(fullname: string) {
  const names = fullname?.split(' ').filter(Boolean) ?? []
  const [first = '', second = ''] = names
  return [first, second].filter(Boolean).join(' ')
}

export function getInitials(name: string) {
  const nameParts = name.trim().split(' ')
  return nameParts.length > 1
    ? `${nameParts[0][0].toUpperCase()}${nameParts[1][0].toUpperCase()}`
    : `${nameParts[0][0].toUpperCase()}B`
}

export function getInitialRoleName(roles: TRoles[]) {
  return roles[0]?.name ?? ''
}

export function parseFormatedPhoneNumber(phone: string | null): string {
  if (!phone) return ''
  // remove +62 if exists and replace with 0
  return phone.replace(/^\+62/, '0')
}
