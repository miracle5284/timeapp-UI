import { useNotificationPermission } from '../../lib/hooks/notification-permission';
import { useState } from "react";

/**
 * NotificationPermissionPrompt
 *
 * UI component that non-obtrusively prompts the user to allow browser notifications.
 * Appears only if permission is in "default" state and can be dismissed.
 */
export const NotificationPermissionPrompt = () => {
    const { permission, refresh } = useNotificationPermission();
    const [dismissed, setDismissed] = useState(false);

    /**
     * Triggers the browser's native notification permission prompt.
     * Refreshes state after user's response.
     */
    const requestPermission = () => {
        if ('Notification' in window) {
            console.log('[Notifications] Requesting permission...');
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('[Notifications] Permission granted.');
                    refresh();
                } else if (permission === 'denied') {
                    // TODO: Handle permission denial
                    console.log('[Notifications] Permission denied.');
                } else {
                    console.log('[Notifications] Permission dismissed.');
                }
            }).catch(err => {
                // TODO: Use sentry to track errors
                console.error('[Notifications] Error requesting permission:', err);
            });
        } else {
            console.warn('[Notifications] Browser does not support notifications.');
        }
    };

    // Hide prompt if permission already handled or user dismissed
    if (dismissed || permission !== 'default') return null;

    return (
        <div
            role="dialog"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-yellow-900 text-sm shadow-lg z-50 bg-yellow-100 flex items-center justify-between"
        >
            <p>
                For the best experience, please{" "}
                <button
                    onClick={requestPermission}
                    className="underline font-semibold text-yellow-950 cursor-pointer"
                >
                    allow notifications
                </button>
                .
            </p>
            <button
                onClick={() => setDismissed(true)}
                className="ml-4 text-xs text-gray-600 hover:underline"
                aria-label="Dismiss notification permission prompt"
            >
                Dismiss
            </button>
        </div>
    );
};
