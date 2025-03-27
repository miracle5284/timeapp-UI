import React, { useEffect } from "react";


type NotificationPermissionOptions = {
    permissionHook: [permission: boolean, React.Dispatch<React.SetStateAction<boolean>>]
};


export const useNotificationPermission = ({permissionHook}: NotificationPermissionOptions)=> {

    const [permission, setPermission] = permissionHook

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission().then((perm: NotificationPermission) => {
                setPermission(perm === "granted");
            })
        } else {
            setPermission(Notification.permission === "granted");
        }
    }, [setPermission])
    return permission
};