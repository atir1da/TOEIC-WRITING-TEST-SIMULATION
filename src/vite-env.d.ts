/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
