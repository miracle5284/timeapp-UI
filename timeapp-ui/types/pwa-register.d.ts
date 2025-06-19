// Type declarations for virtual:pwa-register (vite-plugin-pwa)
declare module 'virtual:pwa-register' {
    /**
     * Options for service worker registration behavior.
     */
    export interface RegisterSWOptions {
        /**
         * Immediately register the SW without waiting for `window.load`.
         * @default false
         */
        immediate?: boolean;

        /**
         * Called when a new service worker is waiting to activate.
         * Ideal for prompting the user to reload the page.
         */
        onNeedRefresh?: () => void;

        /**
         * Called when the service worker is ready and offline functionality is available.
         */
        onOfflineReady?: () => void;

        /**
         * Called if the registration fails.
         */
        onRegisterError?: (error: Error) => void;

        /**
         * Called when the service worker has been successfully registered.
         */
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    }

    /**
     * Registers the service worker using options provided by the Vite PWA plugin.
     * Typically used in client entrypoint like `main.tsx` or `index.tsx`.
     *
     * @param options Optional registration callbacks
     */
    export function registerSW(options?: RegisterSWOptions): void;
}
