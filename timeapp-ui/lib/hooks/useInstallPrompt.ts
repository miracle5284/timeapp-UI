import {BeforeInstallPromptEvent} from "../../types/dtypes";
import {useEffect, useState} from "react";

export function useInstallPrompt() {
    // we store the event (or null if not yet fired)
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        // handler will only ever see a BeforeInstallPromptEvent
        const onBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();               // stop the auto-prompt
            setDeferredPrompt(e);             // save it for later
        };

        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        };
    }, []);

    /**
     * Call this to show the prompt to the user.
     * Resolves to true if they accepted, false otherwise (or if no prompt available).
     */
    const promptInstall = async (): Promise<boolean> => {
        if (!deferredPrompt) return false;

        await deferredPrompt.prompt();                  // show the browser prompt
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);                        // clear it
        return outcome === 'accepted';
    };

    return {
        promptInstall,
        // ready is true as soon as we’ve intercepted the event
        ready: deferredPrompt !== null,
    };
}