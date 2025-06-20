import  API  from './api'
import { PUSH_SERVICE_NOTIFICATION_ENDPOINT, BACKEND_URL} from "../constant.ts";
import {PushSubscriptionPayload} from "../types/push.ts";

type NotificationOptions = {
    notificationPermissionGranted: boolean;           // Whether the user has granted notification permission
    title: string;                             // Notification title
    icon: string;                              // URL/path to the notification icon
    body: string;                              // Body message of the notification
    requireInteraction?: boolean;              // Whether the notification stays until user interacts
    vibrationPattern?: number[];               // Optional vibration pattern for supported devices
};

/**
 * Sends a browser notification and triggers device vibration if supported.
 *
 * @param {NotificationOptions} options - Configuration object for the notification.
 */
export const sendNotification = ({
     notificationPermissionGranted,
     title, body, icon,
     requireInteraction,
     vibrationPattern
    }: NotificationOptions) => {

    // Show desktop notification if permission is granted and supported
    if (notificationPermissionGranted && "Notification" in window) {
        try {
            new Notification(title, {
                body,
                icon,
                requireInteraction
            });
        } catch (e) {
            console.warn("Notification failed:", e);
        }
    }

    // Trigger vibration if supported by the device
    if ("vibrate" in navigator) {
        navigator.vibrate(vibrationPattern || [200, 100, 200]);
    }
};

export async function sendSubscriptionToServer(payload: PushSubscriptionPayload) {
    return API.post(`${BACKEND_URL}${PUSH_SERVICE_NOTIFICATION_ENDPOINT}`, payload)
}