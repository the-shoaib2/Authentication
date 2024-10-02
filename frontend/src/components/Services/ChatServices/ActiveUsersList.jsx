import React, { useEffect, useState } from 'react';
import socketService from '../../../utils/socketService'; // Import socket service
import { formatTime } from '../../../utils/formatTime'; // Import the formatTime function
import '../../../assets/style/ServicesStyle/ChatServicesStyle/ActiveUsersList.css';

const ActiveUsersList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/chat-services/friends", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching friends');
            }

            const data = await response.json();
            setFriends(data.friends || []);
        } catch (error) {
            console.error("Error fetching friends:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();

        // Listen for user status updates
        socketService.on('user_status', (data) => {
            setFriends(prevFriends => 
                prevFriends.map(friend => 
                    friend._id === data.userId ? { ...friend, onlineStatus: data.status === 'online' } : friend
                )
            );
        });

        // Listen for friend unfriend notifications
        socketService.onFriendUnfriended((data) => {
            setFriends(prev => prev.filter(friend => friend._id !== data.userId));
        });

        return () => {
            socketService.off('user_status');
            socketService.off('friend_unfriended');
        };
    }, []);

    if (loading) return <div>Loading friends...</div>;

    return (
        <div className="active-users-list">
            <ul>
                {friends.map(user => (
                    <li key={user._id} className="active-user-item">
                        <img 
                            src={user.profile_picture || 'default-avatar.png'} 
                            alt={user.first_name} 
                            className="active-user-avatar" 
                        />
                        <span className="active-user-name">{`${user.first_name} ${user.last_name}`}</span>
                        <span className="active-status-indicator">
                            {user.onlineStatus ? (
                                <span className="status-dot active"></span>
                            ) : (
                                user.lastActive ? formatTime(user.lastActive) : 'Last active'
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActiveUsersList;
