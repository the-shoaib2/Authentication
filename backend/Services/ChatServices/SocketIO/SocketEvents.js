import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { AvailableChatEvents, ChatEventEnum } from "../constants.js";
import { User } from "../models/auth/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { encrypt, decrypt } from "../E2E_Encryption.js"; // Import encryption functions

/**
 * @description This function allows a user to join the chat represented by chatId. This event occurs when the user switches between chats.
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket - The socket instance for the connection.).DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} io - The Socket.IO server instance.
 */
const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. Chat ID: `, chatId);
    // Joining the room with the chatId allows specific events to be fired without bothering about the users, like typing events.
    socket.join(chatId);
  });
};

/**
 * @description This function emits the typing event to other participants of the chat.
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket - The socket instance for the connection.
 */
const mountParticipantTypingEvent = (socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

/**
 * @description This function emits the stopped typing event to other participants of the chat.
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket - The socket instance for the connection.
 */
const mountParticipantStoppedTypingEvent = (socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};
/**
 * @description Initializes the Socket.IO server and handles user connections.
 * @param {Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} io - The Socket.IO server instance.
 */
const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      // Parse cookies from the handshake headers (This is only possible if the client has `withCredentials: true`)
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      let accessToken = cookies?.accessToken || socket.handshake.auth?.token;

      if (!accessToken) {
        // If there is no access token in cookies, check inside the handshake auth
        throw new ApiError(401, "Unauthorized handshake. Token is missing.");
      }

      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); // Decode the token

      // Retrieve the user
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

      // Retrieve the user
      socket.user = user; // Mount the user object to the socket
      socket.user = user; // Mount the user object to the socket
      // Create a room with the user ID to emit socket events to the user even if they have no active chat.
      // Create a room with the user ID to emit socket events to the user even if they have no active chat.
      socket.emit(ChatEventEnum.CONNECTED_EVENT); // Emit the connected event to notify the client
      console.log("User connected 🗼. User ID: ", user._id.toString());
      console.log("User connected 🗼. User ID: ", user._id.toString(), "Name: ", user.first_name, user.last_name);
      // Common events that need to be mounted on initialization
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("User has disconnected 🚫. User ID: " + socket.user?._id);
        if (socket.user?._id) {
          socket.leave(socket.user._id);
        }
      });
    } catch (error) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
};

/**
 * @description Utility function responsible for abstracting the logic of socket emission via the io instance.
 * @param {import("express").Request} req - Request object to access the `io` instance set at the entry point.
 * @param {string} roomId - Room where the event should be emitted.
 * @param {AvailableChatEvents[0]} event - Event that should be emitted.
 * @param {any} payload - Data that should be sent when emitting the event.
 */
const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

const mountSendMessageEvent = (socket) => {
  socket.on(ChatEventEnum.SEND_MESSAGE_EVENT, (messageData) => {
    const encryptedMessage = encrypt(messageData.text); // Encrypt the message
    socket.to(messageData.chatId).emit(ChatEventEnum.RECEIVE_MESSAGE_EVENT, {
      ...messageData,
      text: encryptedMessage // Send the encrypted message
    });
  });
};

export { initializeSocketIO, emitSocketEvent };
export { initializeSocketIO, emitSocketEvent };

