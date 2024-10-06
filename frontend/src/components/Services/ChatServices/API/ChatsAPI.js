import axiosInstance from '../../../../utils/axiosConfig';

const API_URL = 'http://localhost:8080/chat-services';

const createAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

// Send a message
export const sendMessage = async (token, messageData) => {
    const response = await axiosInstance.post(`${API_URL}/send-message`, messageData, createAuthHeaders(token));
    return response.data;
};

// Get chat messages by chat ID
export const getChatMessages = async (token, chatId) => {
    const response = await axiosInstance.get(`${API_URL}/chat/${chatId}/messages`, createAuthHeaders(token));
    return response.data;
};

// Add a reaction to a message
export const addReaction = async (token, messageId, reactionData) => {
    const response = await axiosInstance.post(`${API_URL}/message/reaction`, { messageId, ...reactionData }, createAuthHeaders(token));
    return response.data;
};

// Delete a message
export const deleteMessage = async (token, messageId) => {
    const response = await axiosInstance.delete(`${API_URL}/message/${messageId}`, createAuthHeaders(token));
    return response.data;
};

// Edit a message
export const editMessage = async (token, messageId, updatedData) => {
    const response = await axiosInstance.put(`${API_URL}/message/${messageId}/edit`, updatedData, createAuthHeaders(token));
    return response.data;
};

// Pin a message
export const pinMessage = async (token, messageId) => {
    const response = await axiosInstance.post(`${API_URL}/message/${messageId}/pin`, {}, createAuthHeaders(token));
    return response.data;
};

// Forward a message
export const forwardMessage = async (token, messageId, forwardData) => {
    const response = await axiosInstance.post(`${API_URL}/message/forward`, { messageId, ...forwardData }, createAuthHeaders(token));
    return response.data;
};

// Bump a message
export const bumpMessage = async (token, messageId) => {
    const response = await axiosInstance.post(`${API_URL}/message/${messageId}/bump`, {}, createAuthHeaders(token));
    return response.data;
};

// Search messages
export const searchMessages = async (token, searchQuery) => {
    const response = await axiosInstance.get(`${API_URL}/message/search`, { 
        headers: createAuthHeaders(token),
        params: { query: searchQuery }
    });
    return response.data;
};

// Vanish a message
export const vanishMessage = async (token, messageId) => {
    const response = await axiosInstance.post(`${API_URL}/message/${messageId}/vanish`, {}, createAuthHeaders(token));
    return response.data;
};
