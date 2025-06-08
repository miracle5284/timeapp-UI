self.addEventListener("install", function (_event) {
    console.log("[SW] Installing...");
    self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", function (event) {
    console.log("[SW] Activated.");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (event) {
    console.log("[SW] Push received:", event);

    let payload = {
        title: "Chrona",
        body: "Timer complete!",
        url: "/"
    };

    try {
        if (event.data) {
            payload = event.data.json();
            console.log("[SW] Parsed payload:", payload);
        } else {
            console.warn("[SW] No data attached to push event.");
        }
    } catch (err) {
        console.error("[SW] Failed to parse push payload:", err);
    }

    const options = {
        body: payload.body,
        icon: "/assets/img/clock_192x192.svg",
        badge: "/assets/img/clock_192x192.svg",
        data: { url: payload.url || "/" }
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, options)
    );
});

self.addEventListener("notificationclick", function (event) {
    console.log("[SW] Notification clicked:", event.notification);

    const targetUrl = (event.notification.data && event.notification.data.url) || "/";
    event.notification.close();

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && "focus" in client) {
                    return client.focus();
                }
            }
            return self.clients.openWindow(targetUrl);
        })
    );
});
