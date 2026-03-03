const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// All routes require authentication
router.use(protect);

// Create notification
router.post('/', createNotification);

// Get notifications
router.get('/', getNotifications);

// Get unread count (must be before /:id routes)
router.get('/unread-count', getUnreadCount);

// Mark all as read (must be before /:id routes)
router.put('/read-all', markAllAsRead);

// Mark as read
router.put('/:id/read', markAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

module.exports = router;
