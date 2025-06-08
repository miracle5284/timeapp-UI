import {urlBase64ToUint8Array} from "./base64.ts";
import {PushSubscriptionPayload} from "../../types/push";

// Replace this with an injected environment variable or global constant
const VPUBLIC_KEY = VAPID_PUBLIC_KEY;

/**
 * Subscribes the browser to push notifications using the Web Push API.
 *
 * @returns A PushSubscriptionPayload if successful, or null if unsupported or denied.
 */
export async function subscribeToPush(): Promise<PushSubscriptionPayload | null> {
    const unsupported =
        !('serviceWorker' in navigator) || !('PushManager' in window);

    if (unsupported) {
        // TODO: Handle unsupported environments
        console.warn('[Push] Push notifications are not supported in this environment.');
        return null;
    }

   try {
        // Ensure the service worker is ready
        const registration = await navigator.serviceWorker.ready;

        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            return null;
        }

        // Subscribe to push service
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VPUBLIC_KEY),
        });

        // Convert the subscription into a backend-friendly payload
       return {
            endpoint: subscription.endpoint,
            expirationTime: subscription.expirationTime,
            keys: subscription.toJSON().keys as {
                p256dh: string;
                auth: string;
            },
        };
    } catch (err: unknown) {
        if (err instanceof Error) {
            // TODO: track and handle errors
            console.error('[Push] Subscription failed:', err.message);
        } else {
            console.error('[Push] Unknown error during push setup.');
        }
        return null;
    }
}
