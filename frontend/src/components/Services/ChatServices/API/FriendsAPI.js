import axiosInstance from '../../../../utils/axiosConfig';

const API_URL = 'http://localhost:8080/chat-services';

const createAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const fetchUsers = async (token) => {
    const response = await axiosInstance.get(`${API_URL}/all-users`, createAuthHeaders(token));
    return response.data;
};

export const fetchFriendRequests = async (token) => {
    const response = await axiosInstance.get(`${API_URL}/friend-requests`, createAuthHeaders(token));
    return response.data;
};

export const sendFriendRequest = async (token, userId) => {
    const response = await axiosInstance.post(`${API_URL}/friend-requests`, { receiverId: userId }, createAuthHeaders(token));
    return response.data;
};

export const cancelFriendRequest = async (token, requestId) => {
    const response = await axiosInstance.post(`${API_URL}/friend-requests/cancel`, { requestId }, createAuthHeaders(token));
    return response.data;
};

export const acceptFriendRequest = async (token, requestId) => {
    const response = await axiosInstance.post(`${API_URL}/friend-requests/accept`, { requestId }, createAuthHeaders(token));
    return response.data;
};

export const rejectFriendRequest = async (token, requestId) => {
    const response = await axiosInstance.post(`${API_URL}/friend-requests/reject`, { requestId }, createAuthHeaders(token));
    return response.data;
};

export const fetchFriends = async (token) => {
    const response = await axiosInstance.get(`${API_URL}/friends`, createAuthHeaders(token));
    return response.data;
};
