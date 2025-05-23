/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API_URL: string;
  readonly VITE_HTTPS_CERT: string;
  readonly VITE_HTTPS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
