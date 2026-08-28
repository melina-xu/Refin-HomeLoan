/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAS_SORA_API?: string;
  readonly VITE_MAS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
