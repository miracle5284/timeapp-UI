type NotificationOptions = {
    notificationPermission: boolean;           // Whether the user has granted notification permission
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
     notificationPermission,
     title, body, icon,
     requireInteraction,
     vibrationPattern
    }: NotificationOptions) => {

    // Show desktop notification if permission is granted and supported
    if (notificationPermission && "Notification" in window) {
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