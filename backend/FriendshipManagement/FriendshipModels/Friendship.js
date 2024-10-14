import mongoose from "mongoose";

export const FriendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'blocked'],
        default: 'pending',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const FriendshipModel = mongoose.model("Friendship", FriendshipSchema);

export default FriendshipModel;
