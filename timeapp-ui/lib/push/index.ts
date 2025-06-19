import { subscribeToPush } from "./subscribe";
import { sendSubscriptionToServer } from "../system";

/**
 * setupPush
 *
 * Initializes push notifications by:
 * 1. Requesting push subscription from the browser.
 * 2. Sending the subscription object to the backend.
 *
 * This should be triggered after service worker registration and permission grant.
 */
export const setupPush = async (): Promise<void> => {
    try {

        const subscription = await subscribeToPush();

        if (subscription) {
            await sendSubscriptionToServer(subscription);
        } else {
            console.warn("[Push] No subscription was returned.");
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            // TODO: Use Sentry to track the errors
            console.error("[Push] Failed to set up push notifications:", err.message);
        } else {
            console.error("[Push] Unexpected error during setup.");
        }
    }
};
