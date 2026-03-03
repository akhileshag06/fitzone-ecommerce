const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['user', 'admin', 'dealer'],
    required: true
  },
  senderName: String,
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipientRole: {
    type: String,
    enum: ['user', 'admin', 'dealer']
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

// Index for faster queries
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });
chatMessageSchema.index({ sender: 1, recipient: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
