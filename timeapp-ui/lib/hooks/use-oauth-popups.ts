import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { OAUTH_STORAGE_KEY } from "../../constant.ts";

/**
 * Response format for the backend OAuth prompt URL endpoint.
 */
interface OAuthPromptURLResponse {
    loginUrl: string;
}

/**
 * Expected shape of the payload returned from the popup window after login.
 */
interface OAuthPopupPayload {
    success: boolean;
    access?: string;
    refresh?: string;
}

/**
 * Opens a popup window centered on the screen with specified dimensions and features.
 */
function openCenteredPopup(url: string, title: string, width: number, height: number): Window | null {
    const screenX = window.screenX ?? window.screenLeft;
    const screenY = window.screenY ?? window.screenTop;
    const outerWidth = window.outerWidth ?? document.documentElement.clientWidth;
    const outerHeight = window.outerHeight ?? document.documentElement.clientHeight;

    const left = screenX + (outerWidth - width) / 2;
    const top = screenY + (outerHeight - height) / 2;

    const features =
        `width=${width},height=${height},left=${left},top=${top},` +
        `scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no`;

    return window.open(url, title, features);
}

/**
 * useOAuthPopup
 *
 * Custom React hook that initiates an OAuth login flow using a popup window.
 * Handles listening for authentication results via localStorage events.
 *
 * @param onSuccess Callback invoked with access and refresh tokens on successful login.
 * @param onError Callback invoked when any part of the login process fails.
 */
export function useOAuthPopup(
    onSuccess: (access: string, refresh: string) => void,
    onError: (msg: string) => void
) {
    // React Query mutation for fetching the login URL from the backend
    const mutation = useMutation<OAuthPromptURLResponse, Error, string>({
        mutationFn: async (fetchUrl: string) => {
            const { data } = await axios.get<OAuthPromptURLResponse>(fetchUrl, {
                withCredentials: true,
            });
            return data;
        },

        // On success, open popup and listen for token delivery
        onSuccess: ({ loginUrl }) => {
            openCenteredPopup(loginUrl, "OAuth Login", 600, 800);

            const listener = (evt: StorageEvent) => {
                if (evt.key === OAUTH_STORAGE_KEY && evt.newValue !== null) {
                    try {
                        const payload = JSON.parse(evt.newValue || "{}") as OAuthPopupPayload;
                        const { success, access, refresh } = payload;

                        if (success && access && refresh) {
                            onSuccess(access, refresh);
                            localStorage.removeItem(OAUTH_STORAGE_KEY);
                            window.removeEventListener("storage", listener);
                        } else {
                            onError("Authentication failed or missing tokens.");
                            window.removeEventListener("storage", listener);
                        }
                    } catch (err: unknown) {
                        if (err instanceof Error) onError(err.message)
                        else onError("Invalid OAuth payload format.");
                        window.removeEventListener("storage", listener);
                    }
                }
            };

            window.addEventListener("storage", listener);
        },

        // Handle request error from the backend
        onError: (err: Error) => {
            onError(err.message);
        },
    });

    // Return a memoized trigger function to start the login flow
    return useCallback(
        async (fetchUrl: string) => {
            mutation.mutate(fetchUrl);
        },
        [mutation]
    );
}
