import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/use-auth.ts";
import {
    BACKEND_URL,
    OAUTH_POPUP_TOKENS_ENDPOINT,
    OAUTH_STORAGE_KEY,
} from "../../../constant.ts";

/**
 * Interface for the response payload returned from the OAuth token exchange endpoint.
 */
interface PopupTokens {
    success: boolean;
    access?: string;
    refresh?: string;
}

/**
 * OAuthPopup Component
 *
 * This component runs inside the popup window triggered during OAuth login.
 * It fetches access/refresh tokens from the backend, stores them in localStorage,
 * and notifies the main app via a `storage` event before auto-closing the popup.
 */
export default function OAuthPopup() {
    const { login } = useAuth();

    // Query to retrieve OAuth tokens after successful provider login
    const { data, error, isLoading } = useQuery<PopupTokens, Error>({
        queryKey: ["oauthPopupTokens"],
        queryFn: () =>
            axios
                .get<PopupTokens>(`${BACKEND_URL}${OAUTH_POPUP_TOKENS_ENDPOINT}`, {
                    withCredentials: true,
                })
                .then((res) => res.data),
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const payload: PopupTokens = data ?? { success: false };

        // Store tokens or failure status in localStorage to be picked up by parent window
        localStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(payload));

        // Add listener for localStorage `removeItem` event from parent window
        const listeners = (evt: StorageEvent) => {
            if (evt.key === OAUTH_STORAGE_KEY && evt.newValue === null) {
                window.removeEventListener("storage", listeners);
                window.close(); // Close popup when parent clears the storage key
            }
        };

        window.addEventListener("storage", listeners);

        // Optional cleanup (in case component unmounts manually)
        return () => {
            window.removeEventListener("storage", listeners);
        };
    }, [data, error, isLoading, login]);

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            {isLoading && <p>Signing you in...</p>}
            {error && <p style={{ color: "red" }}>Authentication Failed</p>}
        </div>
    );
}
