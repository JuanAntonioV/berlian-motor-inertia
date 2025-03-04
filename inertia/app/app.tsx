/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import '@mantine/core/styles.css'
import '@mantine/spotlight/styles.css'
import '@mantine/dates/styles.css'
import 'mantine-react-table/styles.css'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { appTheme } from '~/themes/app_theme'
import { ModalsProvider } from '@mantine/modals'
import AppProvider from '~/providers/AppProvider'
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
})

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={appTheme} stylesTransform={emotionTransform}>
          <MantineEmotionProvider>
            <ModalsProvider>
              <AppProvider>
                <App {...props} />
              </AppProvider>
            </ModalsProvider>
          </MantineEmotionProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </MantineProvider>
      </QueryClientProvider>
    )
  },
})
