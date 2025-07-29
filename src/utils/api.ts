import axios from 'axios';
import { MyPluginData } from './constant';

export const axiosInstance = axios.create({
    baseURL: `${MyPluginData.apiUrl}my-plugin/v1`,
    headers: {
        'X-WP-Nonce': MyPluginData.nonce,
        'Content-Type': 'application/json',
    },
});

export const get = async (url: string) => {
    return await axiosInstance.get(url)
}
export const post = async (url: string, payload: any) => {
    return await axiosInstance.post(url, payload)
}
export const remove = async (url: string) => {
    return await axiosInstance.delete(url)
}