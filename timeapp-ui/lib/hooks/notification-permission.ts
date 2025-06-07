import { useEffect, useState } from "react";

/**
 * Hook return type: tracks permission state and provides a refresh method.
 */
type UseNotificationPermission = {
    permission: NotificationPermission;
    isGranted: boolean;
    refresh: () => void;
};

/**
 * useNotificationPermission
 *
 * Custom React hook to:
 * 1. Read the current browser notification permission (`default`, `granted`, or `denied`).
 * 2. Track updates via `visibilitychange` and `focus` events (in case user changes permission in browser settings).
 * 3. Provide a `refresh()` function to manually update permission state.
 *
 * @returns {UseNotificationPermission}
 */
export const useNotificationPermission = (): UseNotificationPermission => {
    const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);

    /**
     * Refreshes the internal state by re-reading Notification.permission.
     */
    const refresh = () => {
        setPermission(Notification.permission);
    };

    useEffect(() => {
        const handlePermissionChange = () => {
            setPermission(Notification.permission);
        };

        // Update permission when tab becomes visible or gains focus (e.g., after permission change)
        document.addEventListener("visibilitychange", handlePermissionChange);
        window.addEventListener("focus", handlePermissionChange);

        return () => {
            document.removeEventListener("visibilitychange", handlePermissionChange);
            window.removeEventListener("focus", handlePermissionChange);
        };
    }, []);

    return {
        permission,
        isGranted: permission === "granted",
        refresh,
    };
};
