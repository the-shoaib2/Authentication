import React, { useState, useEffect, Suspense, lazy } from "react";
import "../../../assets/style/ServicesStyle/ChatServicesStyle/AddFriend.css";
import { handleSuccess, handleError } from "../../../utils/ReactToastify";
import socketService from "../../../utils/socketService";
import {
    fetchUsers,
    fetchFriendRequests,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    fetchFriends 
} from './API/FriendsAPI';

const UserList = lazy(() => import("./UserList"));

const AddFriend = () => {
    const [addedFriends, setAddedFriends] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [addUsers, setAddUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const usersData = await fetchUsers(token);
                setAddUsers(usersData.users);
                const requestsData = await fetchFriendRequests(token);
                setIncomingRequests(requestsData.incomingRequests);
                setOutgoingRequests(requestsData.outgoingRequests);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Listen for real-time notifications
        socketService.onFriendRequestSent((data) => {
            setIncomingRequests((prev) => [...prev, data]);
        });

        socketService.onFriendRequestAccepted((data) => {
            handleSuccess(`${data.receiverId} accepted your friend request.`);
        });

        socketService.onFriendRequestRejected((data) => {
            handleError(`Friend request to ${data.senderId} was rejected.`);
        });

        return () => {
            socketService.off('friend_request_sent');
            socketService.off('friend_request_accepted');
            socketService.off('friend_request_rejected');
        };
    }, []);

    const handleAddFriend = async (userId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            handleError("You need to be logged in to send friend requests.");
            return;
        }
        try {
            await sendFriendRequest(token, userId);
            setAddedFriends((prev) => [...prev, userId]);
            handleSuccess("Friend request sent successfully!");
        } catch (error) {
            console.error("Error sending friend request:", error);
            handleError(error.message);
        }
    };

    const handleCancelFriendRequest = async (requestId) => {
        const token = localStorage.getItem("token");
        try {
            await cancelFriendRequest(token, requestId);
            socketService.emit('friend_request_canceled', { requestId, userId: localStorage.getItem("userId") });
            setOutgoingRequests((prev) => prev.filter(request => request._id !== requestId));
            handleSuccess("Friend request canceled successfully!");
        } catch (error) {
            console.error("Error canceling friend request:", error);
            handleError(error.message);
        }
    };

    const handleAcceptFriendRequest = async (requestId) => {
        const token = localStorage.getItem("token");
        try {
            const data = await acceptFriendRequest(token, requestId);
            handleSuccess(data.message);
            setAddedFriends((prev) => [...prev, data.senderId]);
        } catch (error) {
            console.error("Error accepting friend request:", error);
            handleError(error.message);
        }
    };


    const handleRejectFriendRequest = async (requestId) => {
        const token = localStorage.getItem("token");
        try {
            const data = await rejectFriendRequest(token, requestId);
            handleSuccess("Friend request rejected successfully!");
            setIncomingRequests((prev) => prev.filter(request => request._id !== requestId));
        } catch (error) {
            console.error("Error rejecting friend request:", error);
            handleError(error.message);
        }
    };

    return (
        <div className="add-friend-container">
            <div className="button-group">
                <button onClick={() => setActiveTab("all")} className={`tab-button ${activeTab === "all" ? "active" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                    </svg>
                    Users
                </button>
                <button onClick={() => setActiveTab("sent")} className={`tab-button ${activeTab === "sent" ? "active" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-up" viewBox="0 0 16 16">
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                    </svg>
                    Sent
                </button>
                <button onClick={() => setActiveTab("received")} className={`tab-button ${activeTab === "received" ? "active" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-down" viewBox="0 0 16 16" style={{ marginLeft: '5px' }}>
                        <path d="M12.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m.354 5.854 1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V10.5a.5.5 0 0 0-1 0v2.793l-.646-.647a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                    </svg>
                    Received
                </button>
            </div>

            <Suspense fallback={<div>Loading user list...</div>}>
                <UserList
                    activeTab={activeTab}
                    loading={loading}
                    addUsers={addUsers}
                    addedFriends={addedFriends}
                    outgoingRequests={outgoingRequests}
                    incomingRequests={incomingRequests}
                    handleAddFriend={handleAddFriend}
                    handleCancelFriendRequest={handleCancelFriendRequest}
                    handleAcceptFriendRequest={handleAcceptFriendRequest}
                    handleRejectFriendRequest={handleRejectFriendRequest}
                />
            </Suspense>
        </div>
    );
};

export default AddFriend;
