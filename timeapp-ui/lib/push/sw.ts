/// <reference lib="webworker" />

// TODO: Implement later to replace sw.js

// Declares the service worker global context
declare const self: ServiceWorkerGlobalScope;

/**
 * Service Worker Install Event
 * Skips waiting to immediately activate the new service worker.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
self.addEventListener("install", (_event) => {
    console.log("[SW] Installing...");
    self.skipWaiting();
});

/**
 * Service Worker Activate Event
 * Claims control of uncontrolled clients immediately.
 */
self.addEventListener("activate", (event) => {
    console.log("[SW] Activated.");
    event.waitUntil(self.clients.claim());
});

/**
 * Push Event Listener
 * Handles incoming push events and displays a notification.
 */
self.addEventListener("push", (event: PushEvent) => {
    console.log("[SW] Push received:", event);

    // Default fallback payload
    let payload: { title: string; body: string; url?: string } = {
        title: "Chrona",
        body: "Timer complete!",
        url: "/",
    };

    try {
        if (event.data) {
            payload = event.data.json();
            console.log("[SW] Parsed push payload:", payload);
        } else {
            console.warn("[SW] Push event has no data.");
        }
    } catch (err) {
        console.error("[SW] Error parsing push payload:", err);
    }

    const options: NotificationOptions = {
        body: payload.body,
        icon: "/assets/img/clock_192x192.svg",
        badge: "/assets/img/clock_192x192.svg",
        data: {
            url: payload.url || "/",
        },
    };

    event.waitUntil(self.registration.showNotification(payload.title, options));
});

/**
 * Notification Click Listener
 * Focuses an existing client window or opens a new one to the payload URL.
 */
self.addEventListener("notificationclick", (event: NotificationEvent) => {
    console.log("[SW] Notification clicked:", event.notification);

    const targetUrl = event.notification.data?.url || "/";
    event.notification.close();

    event.waitUntil(
        self.clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if ("focus" in client && client.url.includes(targetUrl)) {
                        return client.focus();
                    }
                }
                return self.clients.openWindow(targetUrl);
            })
    );
});
