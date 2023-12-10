/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MG_DOMAIN: string
  readonly VITE_APP_GA_TRACKING_ID: string
  readonly VITE_APP_MAPBOX_ACCESS_TOKEN_SECRET: string
  readonly VITE_APP_MAPBOX_ACCESS_TOKEN: string
  readonly VITE_APP_FROM_EMAIL: string
  readonly VITE_APP_MG_API_KEY: string
  readonly VITE_APP_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
