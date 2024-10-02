import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../../../../utils/ReactToastify";
import CryptoJS from "crypto-js";
import { fetchFriends } from '../API/FriendsAPI';
import '../../../../assets/style/ServicesStyle/ChatServicesStyle/FriendsList.css';
import socketService from '../../../../utils/socketService';

const FriendsList = () => {
	const [friends, setFriends] = useState(() => {
		const savedFriends = localStorage.getItem('friendsList');
		return savedFriends ? JSON.parse(CryptoJS.AES.decrypt(savedFriends, 'your-secret-key').toString(CryptoJS.enc.Utf8)) : [];
	});
	const [loading, setLoading] = useState(true);

	const fetchFriendsData = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const data = await fetchFriends(token);
			console.log("Fetched friends data:", data);
			setFriends(data.friends || []);
			

			const encryptedFriends = CryptoJS.AES.encrypt(JSON.stringify(data.friends), 'your-secret-key').toString();
			localStorage.setItem('friendsList', encryptedFriends);
		} catch (error) {
			console.error("Error fetching friends:", error);
			handleError("Error fetching friends.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFriendsData();

		// Listen for real-time updates
		socketService.onFriendRequestAccepted(fetchFriendsData);
		socketService.onFriendUnfriended(fetchFriendsData);

		return () => {
			socketService.off('friend_request_accepted');
			socketService.off('friend_unfriended');
		};
	}, []);

	if (loading) return <div>Loading...</div>;

	return (
		<div className="friends-list">
			<ul>
				{friends.length > 0 ? (
					friends.map(friend => (
						<li key={friend._id} className="friend-item">
							<img src={friend.profile_picture} alt={`${friend.first_name} ${friend.last_name}`} className="friend-avatar" />
							<div className="friend-info">
								<span className="friend-name">{`${friend.first_name} ${friend.last_name}`}</span>
								<span className="friend-username">{friend.username}</span>
							</div>
						</li>
					))
				) : (
					<li>No friends found.</li>
				)}
			</ul>
		</div>
	);
};

export default FriendsList;
