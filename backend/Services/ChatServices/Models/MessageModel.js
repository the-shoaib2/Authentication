import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users',
    required: true
  },
  chat: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat',
    required: true
  },
  content: { 
    type: String, 
    required: true
  },
  iv: { 
    type: String,
    required: true
  },
  type: [{ 
    type: String, 
    enum: ['text', 'image', 'video', 'file', 'audio'],
    default: ['text'] // Default to text
  }],
  fileUrls: [{ 
    type: String 
  }],
  reactions: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users' 
    },
    reaction: String
  }],
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'seen'], 
    default: 'sent' 
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: Date
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

MessageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Message', MessageSchema);
