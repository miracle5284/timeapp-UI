import axios from "axios";
import { BACKEND_URL } from "../constant";

/**
 * Fetches metadata for identifying and connecting the browser extension.
 * Typically includes EXTENSION_ID and EXTENSION_NAME.
 *
 * @returns {Promise<Object>} - Extension information from the backend.
 */
export const getExtensionInfo = async () => {
    const resp = await axios.get(`${BACKEND_URL}/misc/extension-info`, {
        withCredentials: true, // Include cookies for session-based auth
    });
    return resp.data;
};

// A local refetch hook for user data after token refresh
let _refetchUser: (() => void) | null = null;

/**
 * Sets a function to be called when user data should be refetched.
 * Used internally after token refresh to ensure fresh auth state.
 *
 * @param refetch - A function that triggers user refetch.
 */
export const setRefetch = (refetch: () => void) => {
    _refetchUser = refetch;
};

/**
 * Triggers the user refetch function if available.
 */
export const triggerRefetchUser = () => {
    if (_refetchUser) _refetchUser();
};

// Create Axios instance with default headers
const API = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Queue to handle failed requests during token refresh
interface FailedQueueRequest {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueRequest[] = [];

/**
 * Resolves or rejects all queued requests after token refresh is complete.
 *
 * @param error - Error to reject with (if any).
 * @param token - New access token (if available).
 */
const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

/**
 * Requests a new access token using the stored refresh token.
 *
 * @throws Will throw if no refresh token exists or refresh fails.
 * @returns A new access token string.
 */
const refreshToken = async (): Promise<{access: string, refresh: string}> => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) throw new Error("No refresh token found");

    const resp = await axios.post(`${BACKEND_URL}/users/auth/token/refresh`, { refresh });
    return resp.data;
};

// Request interceptor: attach access token to outgoing requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 token expiry and queue requests
API.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // Check if error is due to expired token
        const isTokenExpired =
            error.response?.status === 401 &&
            error.response?.data?.code === "token_not_valid" &&
            error.response?.data?.messages?.[0]?.message === "Token is expired";

        if (isTokenExpired && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite retry loop

            if (isRefreshing) {
                // If already refreshing, queue the request until refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                            resolve(API(originalRequest));
                        },
                        reject: (err: unknown) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                // Perform token refresh and reissue original request
                const { access: newAccessToken, refresh: newRefreshToken } = await refreshToken();
                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
                API.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
                triggerRefetchUser(); // Update user state in context

                processQueue(null, newAccessToken); // Retry queued requests
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return API(originalRequest);
            } catch (err) {
                processQueue(err, null); // Fail all queued requests
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        // For non-token-related errors, just propagate the original error
        return Promise.reject(error);
    }
);

export default API;
