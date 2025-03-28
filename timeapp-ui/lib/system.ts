type NotificationOptions = {
    notificationPermission: boolean;
    title: string;
    icon: string;
    body: string;
    requireInteraction?: boolean;
    vibrationPattern?: number[]
}

export const sendNotification = ({
                                    notificationPermission,
                                    title,
                                    body, icon, requireInteraction, vibrationPattern
                                }: NotificationOptions) => {
        console.log(12344)
        if (notificationPermission && "Notification" in window) {
            try {
                new Notification(title, {
                    body,
                    icon, requireInteraction
                })
            } catch (e) {
                console.warn("Notification failed:", e)
            }
        }

        if ("vibrate" in navigator) {
            navigator.vibrate(vibrationPattern || [200, 100, 200])
        }
    };
