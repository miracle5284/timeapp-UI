/**
 * Converts a URL-safe Base64 string into a Uint8Array.
 * Commonly used for decoding VAPID public keys in Web Push API.
 *
 * @param base64String - The Base64 URL-safe encoded string
 * @returns Uint8Array - The decoded byte array
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
    // Add required '=' padding if missing
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

    // Replace URL-safe characters with standard Base64 characters
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    // Decode Base64 string into binary string
    const rawData = atob(base64);

    // Convert each character to its byte value
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
