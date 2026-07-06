/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXPLAIN_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
