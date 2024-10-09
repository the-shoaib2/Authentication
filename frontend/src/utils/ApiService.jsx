import axiosInstance from './axiosConfig';

export const fetchLoggedInUser = async () => {
    const response = await axiosInstance.get('/Users/me');
    return response.data;
};

export const signupUser = async (formData) => {
    try {
        const response = await axiosInstance.post("/auth/signup", formData, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        if (response.data.success) {
            localStorage.setItem('token', response.data.accessToken);
        }

        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};


export const loginUser = async (emailOrUsername, password) => {
    const response = await axiosInstance.post("/auth/login", {
        emailOrUsername,
        password
    }, {
        withCredentials: true, // Ensure cookies are sent
    });
    if (response.data.success) {
        localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.post("/auth/logout", {}, {
        withCredentials: true,
    });
    if (response.status === 200) {
        clearAuthData();
    }
    return response;
};

export const deleteUser = async (userId) => {
    const response = await axiosInstance.delete(`/auth/delete/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response;
};

export const refreshToken = async () => {
    try {
        const response = await axiosInstance.post('/auth/refresh-token', {}, {
            withCredentials: true, // Ensure cookies are sent
        });
        if (response.status === 200) {
            localStorage.setItem('token', response.data.accessToken);
            return true;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
    }
};

export const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    // Optionally, you can add a token validation logic here
    return true;
};

const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Clear cookies if necessary
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
};

export const uploadAvatar = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/account/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return { url: response.data.url, message: response.data.message }; // Return URL and message
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

export const deleteAvatar = async () => {
    try {
        const response = await axiosInstance.delete('/account/delete/image', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting avatar:', error);
        throw error;
    }
};

