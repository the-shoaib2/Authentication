import mongoose from "mongoose";

export const FriendSuggestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    suggestedFriendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const FriendSuggestionModel = mongoose.model("FriendSuggestion", FriendSuggestionSchema);

export default FriendSuggestionModel;
