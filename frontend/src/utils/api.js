// src/utils/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken });
                if (response.status === 200) {
                    localStorage.setItem('token', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    return axios(originalRequest);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
