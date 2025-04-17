import axios from "axios";
import { BACKEND_URL } from "../constant";

/**
 * Fetches extension metadata (like ID and name) from the backend.
 * Used to identify and connect with the Chrome extension.
 *
 * @returns {Promise<Object>} - Contains EXTENSION_ID and EXTENSION_NAME.
 */
export const getExtensionInfo = async () => {
    const resp = await axios.get(`${BACKEND_URL}/extension-info`, {
        withCredentials: true // Ensure session-based request
    });
    return resp.data;
};


const API = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    //const refreshToken = localStorage.getItem("refresh");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default API;