import { useEffect, useState } from "react";

export type UseNotificationPermission = {
    permission: NotificationPermission;
    isGranted: boolean;
    refresh: () => void;
};

/**
 * If you pass in `{ permissionHook: [permission, setPermission] }`,
 * the hook will use that external state. Otherwise it uses internal state.
 *
 * Additionally, on initial mount, if permission is 'default' and Notification is supported,
 * it will automatically prompt the user.
 */
export function useNotificationPermission(
    opts?: {
        permissionHook?: [
            NotificationPermission,
            React.Dispatch<React.SetStateAction<NotificationPermission>>
        ];
    }
): UseNotificationPermission {
    const hasExternal = Array.isArray(opts?.permissionHook);

    // 1) Set up state: external tuple or internal useState
    const [internalPermission, setInternalPermission] = useState<NotificationPermission>(
        () => (typeof Notification !== "undefined" ? Notification.permission : "default")
    );
    const [permission, setPermission] = hasExternal
        ? opts!.permissionHook!
        : [internalPermission, setInternalPermission];

    // 2) refresh() always writes back to whichever setter we have
    const refresh = () => {
        if (typeof Notification !== "undefined") {
            setPermission(Notification.permission);
        }
    };

    // 3) Prompt on initial mount if permission is 'default'
    useEffect(() => {
        if (typeof Notification !== "undefined" && permission === "default") {
            Notification.requestPermission().then((perm) => {
                setPermission(perm);
            });
        }
        // we only want to prompt once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 4) Keep in sync on visibility/focus
    useEffect(() => {
        const handleChange = () => {
            if (typeof Notification !== "undefined") {
                setPermission(Notification.permission);
            }
        };
        document.addEventListener("visibilitychange", handleChange);
        window.addEventListener("focus", handleChange);
        return () => {
            document.removeEventListener("visibilitychange", handleChange);
            window.removeEventListener("focus", handleChange);
        };
    }, [opts?.permissionHook, setPermission]);

    return {
        permission,
        isGranted: permission === "granted",
        refresh,
    };
}
