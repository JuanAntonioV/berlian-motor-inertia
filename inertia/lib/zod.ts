import i18next from 'i18next'
import { z, ZodError } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
// Import your language translation files
import translation from 'zod-i18n-map/locales/id/zod.json'
import { StringMap } from '~/types'

// lng and resources key depend on your locale.
i18next.init({
  lng: 'id',
  resources: {
    id: { zod: translation },
  },
})
z.setErrorMap(zodI18nMap)

export function convertZodErrors(error: ZodError): StringMap {
  return error.issues.reduce((acc: { [key: string]: string }, issue) => {
    acc[issue.path[0]] = issue.message
    return acc
  }, {})
}

// export configured zod instance
export { z }
