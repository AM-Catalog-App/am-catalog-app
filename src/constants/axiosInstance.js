
// import axios from 'axios';
// export const backendApi = import.meta.env.AM_APP_API_BASE_URL;

// const axiosInstance = axios.create({
//     baseURL: backendApi, // Replace with your API base URL
//     timeout: 10000, // Set timeout as needed
// });

// // Request interceptor
// axiosInstance.interceptors.request.use(
//     (config) => {
//         // Add any request headers or modifications here
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//     (response) => {
//         // Add any response handling here
//         return response;
//     },
//     (error) => {
//         // Add any error handling here
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;


import axios from 'axios';
export const backendApi = import.meta.env.VITE_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: backendApi, // Replace with your API base URL
    timeout: 100000, // Set timeout as needed
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add any request headers or modifications here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Return the response
        return response;
    },
    (error) => {
        // Customize error handling
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request error:', error.request);
            return Promise.reject('No response received');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
            return Promise.reject(error.message);
        }
    }
);

export default axiosInstance;