import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('astro_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Normalize error responses
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err.response?.data?.message ||
            err.response?.data?.errors?.[0]?.detail ||
            'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default api;
