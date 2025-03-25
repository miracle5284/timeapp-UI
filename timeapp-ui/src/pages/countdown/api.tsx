import axios from "axios";
import { BACKEND_URL} from "./dtypes.tsx";

export const getCountdown = async () => {
    const resp = await axios.get(`${BACKEND_URL}v2/countdown/`, {
        withCredentials: true
    })
    return resp.data
}

export const startCountdown = async (duration: number, initialDuration: number) => {
    const resp = await axios.post(`${BACKEND_URL}v2/countdown/`, {duration, initialDuration}, {
        withCredentials: true
    })
    return resp.data
}

export const pauseCountdown = async () => {
    const resp = await axios.put(`${BACKEND_URL}v2/countdown/`, {}, {
        withCredentials: true
    })
    return resp.data
}

export const resetCountdown = async () => {
    const resp = await axios.delete(`${BACKEND_URL}v2/countdown/`, {
        withCredentials: true
    })
    return resp.data
}