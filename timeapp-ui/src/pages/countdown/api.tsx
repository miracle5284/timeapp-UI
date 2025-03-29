import axios from "axios";
import { BACKEND_URL } from "../../../constant.ts";

/**
 * Fetches the current countdown state from the backend
 * Includes session credentials for user-specific session data
 * @returns {Promise<Object>} Countdown state including duration, active flag, etc.
 */
export const getCountdown = async () => {
    const resp = await axios.get(`${BACKEND_URL}/v2/countdown/`, {
        withCredentials: true
    });
    return resp.data;
};

/**
 * Starts or resumes a countdown with a specified duration
 * @param {number} duration - Current duration (e.g., resumed or modified)
 * @param {number} setDuration - Initial duration originally set by user
 * @returns {Promise<Object>} Server confirmation response
 */
export const startCountdown = async (duration: number, setDuration: number) => {
    const resp = await axios.post(`${BACKEND_URL}/v2/countdown/`, { duration, setDuration }, {
        withCredentials: true
    });
    return resp.data;
};

/**
 * Pauses the currently active countdown timer
 * @returns {Promise<Object>} Server confirmation response
 */
export const pauseCountdown = async () => {
    const resp = await axios.put(`${BACKEND_URL}/v2/countdown/`, {}, {
        withCredentials: true
    });
    return resp.data;
};

/**
 * Resets the countdown timer to the originally set duration
 * @returns {Promise<Object>} Server confirmation response
 */
export const resetCountdown = async () => {
    const resp = await axios.delete(`${BACKEND_URL}/v2/countdown/`, {
        withCredentials: true
    });
    return resp.data;
};
