// types/dtypes.d.ts

export interface ChromeRuntime {
    runtime?: {
        sendMessage: (
            extensionId: string,
            message: Record<string, unknown>,
            callback?: (response: Record<string, unknown> | undefined) => void
        ) => void;
        lastError?: Error;
    };
}

export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    prompt(): Promise<void>;
}

declare global {

    interface WindowEventMap {
        // Tell TS about the beforeinstallprompt event
        beforeinstallprompt: BeforeInstallPromptEvent;
    }

    interface PongResponse {
        type: 'PONG_FROM_EXTENSION';
    }

    namespace Chrome {
        interface Runtime {
            /**
             * Send a message to an extension.
             * @param extensionId – the ID of your extension
             * @param message     – payload you send (any serializable value)
             * @param callback    – receives the extension’s response, typed as R
             */
            sendMessage<R = unknown>(
                extensionId: string,
                message: unknown,
                callback?: (response: R) => void
            ): void;

            lastError?: Error;
        }
    }

    interface Window {
        chrome?: {
            runtime?: Chrome.Runtime;
        };
    }

    interface Window {
        chrome?: {
            runtime?: Chrome.Runtime;
        };
    }

    interface WindowEventMap {
        // In case you ever use window.env updates via events
        envchange: CustomEvent<Record<string,string>>;
    }

    interface Navigator {
        /**
         * True if the app is running as a standalone PWA (home-screen launched) on iOS.
         * Also used in Safari 17+ on macOS when launched from the Dock.
         */
        standalone?: boolean;
    }

    /**
     * A strongly‐typed setTimeout for the browser.
     * @param handler – function that receives the supplied args
     * @param ms – delay in milliseconds
     * @param args – arguments passed to your handler, typed as Args
     * @returns a numeric timeout ID
     */
    function setTimeout<Args extends unknown[]>(
        handler: (...args: Args) => void,
        ms?: number,
        ...args: Args
    ): number;

    /**
     * Clears a timeout created with setTimeout.
     * @param handle – the timeout ID returned from setTimeout
     */
    function clearTimeout(handle?: number): void;
}


