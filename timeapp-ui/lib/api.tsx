import axios from "axios";
import {BACKEND_URL} from "../constant";


export const getExtensionInfo = async () => {
    const resp = await axios.get(`${BACKEND_URL}/extension-info`, {
        withCredentials: true
    })
    return resp.data
}
