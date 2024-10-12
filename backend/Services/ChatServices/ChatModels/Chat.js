const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users' 
  }],
  messages: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  }],
  type: {
    type: String,
    enum: ['individual', 'group'],
    default: 'individual'
  },
  name: {
    type: String,
    required: function() { return this.type === 'group'; }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

chatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
