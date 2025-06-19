import {useEffect, useState} from "react";

/**
 * Detect Safari on macOS (pre-17) and iOS home-screen state, and
 * return `true` if we should show an “install” banner.
 */
export function useSafariInstallBanner(): boolean {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent;

        // macOS Safari (up through v16.x) userAgent includes “Macintosh” and “Safari”
        // but never “Chrome”, “Chromium” or “Edg/…”
        const isSafariMac16 =
            ua.includes('Macintosh') &&
            ua.includes('Safari') &&
            !/(Chrome|Chromium|Edg\/)/.test(ua);

        // On iOS, `navigator.standalone === true` means launched from home-screen
        // On macOS Safari 17+ (Sonoma), standalone also becomes true when “Add to Dock”
        const isStandalonePWA = navigator.standalone === true;

        // Show banner if it’s a Safari that doesn’t auto-prompt, and not yet standalone
        if (isSafariMac16 && !isStandalonePWA) {
            setShow(true);
        }
    }, []);

    return show;
}