import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_SERVER_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error instanceof Error ? error : new Error(error)),
);
