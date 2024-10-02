// frontend/src/contexts/AuthContext.js
// AuthContext.js
import React, { createContext, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({
		isAuthenticated: false,
		user: null,
	});

	const login = async (emailOrUsername, password) => {
		const response = await axiosInstance.post("/auth/login", {
			emailOrUsername,
			password
		});
		if (response.data.success) {
			localStorage.setItem('token', response.data.accessToken);
			setAuth({ isAuthenticated: true, user: response.data.user });
		}
		return response.data;
	};

	const logout = async () => {
		const response = await axiosInstance.post("/auth/logout", {}, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			withCredentials: true,
		});
		if (response.status === 200) {
			clearAuthData();
			setAuth({ isAuthenticated: false, user: null });
		}
		return response;
	};

	const fetchLoggedInUser = async () => {
		const response = await axiosInstance.get('/Users/me');
		return response.data;
	};

	const checkAuthentication = async () => {
		const token = localStorage.getItem('token');
		if (!token) return false;
		// Optionally, you can add a token validation logic here
		return true;
	};

	const clearAuthData = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('refreshToken');
		const cookies = document.cookie.split("; ");
		for (let cookie of cookies) {
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		}
	};

	return (
		<AuthContext.Provider value={{ auth, login, logout, fetchLoggedInUser, checkAuthentication }}>
			{children}
		</AuthContext.Provider>
	);
};
