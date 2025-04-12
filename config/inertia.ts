import User from '#models/user'
import env from '#start/env'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: async (ctx) => {
      const user = ctx?.auth?.user

      if (!user) {
        return ctx.inertia.always(() => null)
      }

      const userSerialized = user.serialize()

      let imageUrl = null

      if (user?.image) {
        const absolutePath = `${env.get('APP_URL')}${user.image}`
        imageUrl = absolutePath
      }

      const userWithRoleAndPermissions = {
        ...userSerialized,
        image: imageUrl,
        roles: await User.getRoles(user),
        permissions: await User.getPermissions(user),
      }

      return ctx.inertia.always(() => userWithRoleAndPermissions)
    },
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
