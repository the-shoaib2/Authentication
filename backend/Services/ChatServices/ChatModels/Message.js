const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
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
  type: { 
    type: String, 
    enum: ['text', 'image', 'file', 'audio'],
    default: 'text' 
  },
  fileUrl: { 
    type: String 
  },
  reactions: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
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

messageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Message', messageSchema);
