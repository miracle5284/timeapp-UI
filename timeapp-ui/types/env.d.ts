/// <reference types="vite/client" />

declare const BACKEND_APP_URL: string;
declare const VAPID_PUBLIC_KEY: string;

interface ImportMetaEnv {
    readonly VITE_BACKEND_API_URL: string;
    readonly VITE_VPUBLIC_KEY: string;
    // add more VITE_ variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
