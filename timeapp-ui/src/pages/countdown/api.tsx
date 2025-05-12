import API from "../../../lib/api.ts";
import {ICountdownResponse} from "./dtypes.tsx";

/**
 * Fetches the current countdown state from the backend
 * Includes session credentials for user-specific session data
 * @returns {Promise<Object>} Countdown state including duration, active flag, etc.
 */
export const getCountdown = async () => {
    const resp = await API.get(`/v2/countdown/`);
    return resp.data;
};

/**
 * Starts or resumes a countdown with a specified duration
 * @returns {Promise<Object>} Server confirmation response
 * @param id
 * @param name
 * @param durationSeconds
 * @param timestamp
 */
export const startCountdown = async (
    id: string, name: string, durationSeconds: number, timestamp: string): Promise<ICountdownResponse> => {
    const payload = { name: name || "Test 1", durationSeconds, timestamp}
    const resp = await (id ? API.patch(`/v2/countdown/${id}/start/`, payload) :
        API.post(`/v2/countdown/`, payload))
    return resp.data;
};

/**
 * Pauses the currently active countdown timer
 * @returns {Promise<Object>} Server confirmation response
 * @param id
 * @param remainingDurationSeconds
 * @param timestamp
 */
export const pauseCountdown = async (id: string | null, remainingDurationSeconds: number,
                                     timestamp: string): Promise<ICountdownResponse> => {
    const resp = await API.patch(`/v2/countdown/${id}/pause/`, {
        remainingDurationSeconds, timestamp
    });
    return resp.data;
};

/**
 * Resets the countdown timer to the originally set duration
 * @returns {Promise<Object>} Server confirmation response
 * @param id
 */
export const resetCountdown = async (id : string): Promise<ICountdownResponse> => {
    const resp = await API.patch(`v2/countdown/${id}/reset/`, {timestamp: new Date().toISOString()});
    return resp.data;
};

/**
 * Mark the countdown timer as complete
 * @returns {Promise<Object>} Server confirmation response
 * @param id
 * @param timestamp
 */
export const completeCountdown = async (id : string, timestamp: string): Promise<ICountdownResponse> => {
    const resp = await API.patch(`v2/countdown/${id}/completed/`, { timestamp });
    return resp.data;
};
