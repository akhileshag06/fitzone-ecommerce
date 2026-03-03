const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userEmail: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedToRole: {
    type: String,
    enum: ['admin', 'dealer']
  },
  assignedToName: String,
  status: {
    type: String,
    enum: ['pending', 'active', 'closed'],
    default: 'pending'
  },
  requestType: {
    type: String,
    enum: ['admin', 'dealer'],
    required: true
  },
  subject: {
    type: String,
    default: 'Support Request'
  },
  lastMessage: String,
  lastMessageAt: Date,
  unreadCount: {
    user: { type: Number, default: 0 },
    admin: { type: Number, default: 0 }
  },
  closedAt: Date,
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
chatSessionSchema.index({ user: 1, status: 1 });
chatSessionSchema.index({ assignedTo: 1, status: 1 });
chatSessionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
