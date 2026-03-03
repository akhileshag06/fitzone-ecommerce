const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createChatRequest,
  getUserSessions,
  getAdminSessions,
  acceptChatRequest,
  sendMessage,
  getMessages,
  closeSession,
  getChatStats
} = require('../controllers/chatController');

// User routes
router.post('/request', protect, createChatRequest);
router.get('/my-sessions', protect, getUserSessions);

// Admin/Dealer routes
router.get('/sessions', protect, getAdminSessions);
router.get('/stats', protect, getChatStats);
router.put('/sessions/:sessionId/accept', protect, acceptChatRequest);
router.put('/sessions/:sessionId/close', protect, closeSession);

// Message routes
router.post('/sessions/:sessionId/messages', protect, sendMessage);
router.get('/sessions/:sessionId/messages', protect, getMessages);

module.exports = router;
