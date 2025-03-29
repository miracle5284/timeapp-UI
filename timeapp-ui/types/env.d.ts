/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    // add more VITE_ variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
