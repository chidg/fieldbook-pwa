/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MG_DOMAIN: string
  readonly VITE_APP_PUBLIC_URL: string
  readonly VITE_APP_GA_TRACKING_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
