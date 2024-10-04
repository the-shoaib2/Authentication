import React from "react";
import "../../../../assets/style/ServicesStyle/ChatServicesStyle/UserList.css";

const UserList = ({
  activeTab,
  loading,
  addUsers,
  addedFriends,
  outgoingRequests,
  incomingRequests,
  handleAddFriend,
  handleCancelFriendRequest,
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
}) => {
  const renderUserList = () => {
    if (activeTab === "all") {
      return (
        <ul className="add-user-list">
          {loading ? (

            <li>Loading users...</li>
            
          ) : addUsers.length > 0 ? (
            addUsers.map((user) => {
              if (!user || !user._id) {
                console.warn("User is null or missing _id:", user);
                return null; // Skip rendering if user is null or doesn't have _id
              }

              const isFriend = addedFriends.includes(user._id);
              const requestSent = outgoingRequests.some(request => request.receiver && request.receiver._id === user._id);
              const requestReceived = incomingRequests.some(request => request.sender && request.sender._id === user._id);

              return (
                <li key={user._id} className="add-user">
                  <img
                    src={user.profile_picture}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="add-user-avatar"
                  />
                  <span className="add-user-name">{`${user.first_name} ${user.last_name}`}</span>
                  <div className="button-container">
                    {isFriend ? (
                      <button className="friend-button">
                        Friend
                      </button>
                    ) : requestSent ? (
                      <button className="add-friend-success-button" disabled>
                        Request Sent
                      </button>
                    ) : requestReceived ? (
                      <button onClick={() => handleAcceptFriendRequest(user._id)} className="accept-button">
                        Accept
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(user._id)}
                        className="add-friend-button"
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <li>No users available.</li>
          )}
        </ul>
      );
    } else if (activeTab === "sent") {
      return (
        <ul className="request-list">
          {outgoingRequests.length > 0 ? (
            outgoingRequests.map((request) => {
              if (!request || !request.receiver) {
                console.warn("Request is null or missing receiver:", request);
                return null; // Skip rendering if request is null or doesn't have receiver
              }

              return (
                <li key={request._id} className="request-item">
                  <img
                    src={request.receiver.profile_picture}
                    alt={`${request.receiver.first_name} ${request.receiver.last_name}`}
                    className="request-user-avatar"
                  />
                  <span className="request-user-name">{`${request.receiver.first_name} ${request.receiver.last_name}`}</span>
                  <span className="request-status">Request Sent</span>
                  <button onClick={() => handleCancelFriendRequest(request._id)} className="cancel-button">
                    Cancel
                  </button>
                </li>
              );
            })
          ) : (
            <li>No sent requests.</li>
          )}
        </ul>
      );
    } else if (activeTab === "received") {
      return (
        <ul className="request-list">
          {incomingRequests.length > 0 ? (
            incomingRequests.map((request) => {
              if (!request || !request.sender) {
                console.warn("Request is null or missing sender:", request);
                return null; // Skip rendering if request is null or doesn't have sender
              }

              return (
                <li key={request._id} className="request-item">
                  <img
                    src={request.sender.profile_picture}
                    alt={`${request.sender.first_name} ${request.sender.last_name}`}
                    className="request-user-avatar"
                  />
                  <span className="request-user-name">{`${request.sender.first_name} ${request.sender.last_name}`}</span>
                  <button onClick={() => handleAcceptFriendRequest(request._id)} className="accept-button">
                    Accept
                  </button>
                  <button onClick={() => handleRejectFriendRequest(request._id)} className="reject-button">
                    Reject
                  </button>
                </li>
              );
            })
          ) : (
            <li>No received requests.</li>
          )}
        </ul>
      );
    }
  };

  return <>{renderUserList()}</>;
};

export default UserList;