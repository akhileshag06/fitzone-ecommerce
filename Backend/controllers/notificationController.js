const Notification = require('../models/Notification');

// ============ CREATE NOTIFICATION ============
exports.createNotification = async (req, res) => {
  try {
    const { type, title, message, recipient, recipientId, relatedOrder, relatedProduct, priority } = req.body;
    
    const notification = await Notification.create({
      type,
      title,
      message,
      recipient,
      recipientId,
      sender: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      relatedOrder,
      relatedProduct,
      priority: priority || 'medium'
    });
    
    res.status(201).json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET NOTIFICATIONS (for logged in user) ============
exports.getNotifications = async (req, res) => {
  try {
    const { role } = req.user;
    const { unreadOnly } = req.query;
    
    let query = { recipient: role };
    
    // If specific recipient (dealer), filter by recipientId
    if (role === 'dealer') {
      query = {
        $or: [
          { recipient: 'dealer', recipientId: req.user._id },
          { recipient: 'dealer', recipientId: null } // Broadcast to all dealers
        ]
      };
    }
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('sender', 'name email')
      .populate('relatedOrder', 'orderId total status')
      .populate('relatedProduct', 'name image')
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ 
      ...query, 
      isRead: false 
    });
    
    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ MARK AS READ ============
exports.markAsRead = async (req, res) => {
  try {
    console.log('Mark as read - Notification ID:', req.params.id, 'User:', req.user.role, req.user._id);
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { 
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );
    
    if (!notification) {
      console.log('Mark as read - Notification not found');
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    console.log('Mark as read - Success:', notification._id);
    res.json({ success: true, notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ MARK ALL AS READ ============
exports.markAllAsRead = async (req, res) => {
  try {
    const { role } = req.user;
    
    console.log('Mark all as read - User role:', role, 'User ID:', req.user._id);
    
    let query = { recipient: role, isRead: false };
    
    if (role === 'dealer') {
      query = {
        $or: [
          { recipient: 'dealer', recipientId: req.user._id, isRead: false },
          { recipient: 'dealer', recipientId: null, isRead: false }
        ]
      };
    }
    
    console.log('Mark all as read - Query:', JSON.stringify(query));
    
    const result = await Notification.updateMany(query, { 
      isRead: true,
      readAt: new Date()
    });
    
    console.log('Mark all as read - Result:', result);
    
    res.json({ success: true, message: 'All notifications marked as read', modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ DELETE NOTIFICATION ============
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET UNREAD COUNT ============
exports.getUnreadCount = async (req, res) => {
  try {
    const { role } = req.user;
    
    let query = { recipient: role, isRead: false };
    
    if (role === 'dealer') {
      query = {
        $or: [
          { recipient: 'dealer', recipientId: req.user._id, isRead: false },
          { recipient: 'dealer', recipientId: null, isRead: false }
        ]
      };
    }
    
    const count = await Notification.countDocuments(query);
    
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
