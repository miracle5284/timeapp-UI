import React, { useEffect } from "react";

// Defines the permission hook type used for state tracking
type NotificationPermissionOptions = {
    permissionHook: [permission: boolean, React.Dispatch<React.SetStateAction<boolean>>]
};

/**
 * Custom React hook that checks and requests browser notification permissions.
 * Updates the calling component's state via the provided permissionHook.
 *
 * @param {NotificationPermissionOptions} param0 - permissionHook containing [state, setter]
 * @returns {boolean} - Current permission state (true if granted)
 */
export const useNotificationPermission = ({ permissionHook }: NotificationPermissionOptions) => {
    const [permission, setPermission] = permissionHook;

    useEffect(() => {
        // Check if browser supports notifications and permission is not already granted
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission().then((perm: NotificationPermission) => {
                setPermission(perm === "granted");
            });
        } else {
            // Permission already set, update local state
            setPermission(Notification.permission === "granted");
        }
    }, [setPermission]);

    return permission;
};
