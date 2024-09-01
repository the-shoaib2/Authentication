// src/store/useAuthStore.js
import { create } from 'zustand';
import api from './api';

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    loggedInUser: null,

    login: async (emailOrUsername, password) => {
        try {
            const response = await api.post('/auth/login', { emailOrUsername, password });
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            set({ isAuthenticated: true, loggedInUser: response.data.user });
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    },

    signup: async (name, email, password) => {
        try {
            const response = await api.post('/auth/signup', { name, email, password });
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            set({ isAuthenticated: true, loggedInUser: response.data.user });
        } catch (error) {
            throw error.response?.data?.message || 'Signup failed';
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') });
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            set({ isAuthenticated: false, loggedInUser: null });
        } catch (error) {
            throw error.response?.data?.message || 'Logout failed';
        }
    },

    fetchLoggedInUser: async () => {
        try {
            const response = await api.get('/users/me');
            set({ loggedInUser: response.data });
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch user data';
        }
    },

    autoLogin: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const response = await api.post('/auth/refresh-token', { refreshToken });
                localStorage.setItem('token', response.data.accessToken);
                set({ isAuthenticated: true, loggedInUser: response.data.user });
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                set({ isAuthenticated: false, loggedInUser: null });
            }
        }
    },
}));

export default useAuthStore;
