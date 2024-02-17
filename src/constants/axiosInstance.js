
import axios from 'axios';
export const backendApi = import.meta.env.AM_APP_API_BASE_URL;

const instance = axios.create({
    baseURL: backendApi, // Replace with your API base URL
    timeout: 10000, // Set timeout as needed
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        // Add any request headers or modifications here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        // Add any response handling here
        return response;
    },
    (error) => {
        // Add any error handling here
        return Promise.reject(error);
    }
);

export default instance;
