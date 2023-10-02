/// <reference types="vite/client" />
//
interface ImportMetaEnv {
  readonly VITE_POLOTNO_KEY: string;
  readonly VITE_PARTYKIT_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
