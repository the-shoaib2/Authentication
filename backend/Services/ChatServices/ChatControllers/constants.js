const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';

const FRIEND_REQUEST_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
};

const USER_PROFILE_SUCCESS_MESSAGE = 'User profile fetched successfully.';
const ACCOUNT_STATUS_SUCCESS_MESSAGE = 'Account status fetched successfully.';

module.exports = {
    API_URL,
    SOCKET_URL,
    FRIEND_REQUEST_STATUS,
    USER_PROFILE_SUCCESS_MESSAGE,
    ACCOUNT_STATUS_SUCCESS_MESSAGE,
};