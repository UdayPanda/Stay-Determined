import axios from "axios";
import { HOST } from "../utils/constants.js";

export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true
})

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  