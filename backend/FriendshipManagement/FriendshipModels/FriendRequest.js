import mongoose from "mongoose";

export const FriendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const FriendRequestModel = mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequestModel;
