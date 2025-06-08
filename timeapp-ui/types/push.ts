/**
 * PushSubscriptionPayload
 *
 * Represents the structure of a PushSubscription as expected by the backend.
 * This is typically extracted from `PushSubscription.toJSON()`.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription
 */
export interface PushSubscriptionPayload {
    /** The endpoint URL for the push service (unique to each browser/device) */
    endpoint: string;

    /** Expiration time of the subscription, or null if not set */
    expirationTime: number | null;

    /** Encryption keys required for secure push communication */
    keys: {
        /** Public key (base64 encoded) used by the push service */
        p256dh: string;

        /** Auth secret (base64 encoded) used to authenticate the message */
        auth: string;
    };
}
