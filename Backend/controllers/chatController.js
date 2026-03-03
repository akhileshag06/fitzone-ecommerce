const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const Notification = require('../models/Notification');

// ============ CREATE CHAT REQUEST ============
exports.createChatRequest = async (req, res) => {
  try {
    const { requestType, subject } = req.body; // 'admin' or 'dealer'
    
    // Check if user already has an active session
    const existingSession = await ChatSession.findOne({
      user: req.user._id,
      status: { $in: ['pending', 'active'] },
      requestType
    });
    
    if (existingSession) {
      return res.json({
        success: true,
        session: existingSession,
        message: 'You already have an active chat session'
      });
    }
    
    // Generate unique session ID
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new chat session
    const session = await ChatSession.create({
      sessionId,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      requestType,
      subject: subject || `Contact ${requestType === 'admin' ? 'Admin' : 'Dealer'}`,
      status: 'pending',
      lastMessageAt: new Date()
    });
    
    // Create notification for admin/dealer
    await Notification.create({
      type: 'support_request',
      title: `💬 New Chat Request`,
      message: `${req.user.name} wants to start a chat session`,
      recipient: requestType,
      sender: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      priority: 'high'
    });
    
    res.status(201).json({
      success: true,
      session,
      message: 'Chat request sent successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET USER CHAT SESSIONS ============
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.user._id })
      .populate('assignedTo', 'name email')
      .sort({ lastMessageAt: -1 });
    
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET ADMIN/DEALER CHAT SESSIONS ============
exports.getAdminSessions = async (req, res) => {
  try {
    const { role } = req.user;
    const { status } = req.query; // 'pending', 'active', 'closed', or 'all'
    
    let query = {};
    
    if (role === 'admin') {
      query.requestType = 'admin';
    } else if (role === 'dealer') {
      query = {
        $or: [
          { requestType: 'dealer' },
          { assignedTo: req.user._id }
        ]
      };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const sessions = await ChatSession.find(query)
      .populate('user', 'name email phoneNumber')
      .populate('assignedTo', 'name email')
      .sort({ status: 1, lastMessageAt: -1 });
    
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ACCEPT CHAT REQUEST ============
exports.acceptChatRequest = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await ChatSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    if (session.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Session already accepted or closed' });
    }
    
    // Update session
    session.status = 'active';
    session.assignedTo = req.user._id;
    session.assignedToRole = req.user.role;
    session.assignedToName = req.user.name;
    await session.save();
    
    // Create system message
    await ChatMessage.create({
      sessionId,
      sender: req.user._id,
      senderRole: req.user.role,
      senderName: req.user.name,
      recipient: session.user,
      recipientRole: 'user',
      message: `${req.user.name} has joined the chat. How can I help you today?`
    });
    
    // Notify user that chat is accepted
    await Notification.create({
      type: 'support_request',
      title: '✅ Chat Request Accepted',
      message: `${req.user.name} has accepted your chat request`,
      recipient: 'user',
      recipientId: session.user,
      sender: req.user._id,
      senderName: req.user.name,
      priority: 'high'
    });
    
    res.json({ success: true, session, message: 'Chat session started' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ SEND MESSAGE ============
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    
    const session = await ChatSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    if (session.status === 'closed') {
      return res.status(400).json({ success: false, message: 'Session is closed' });
    }
    
    // Determine recipient
    let recipient, recipientRole;
    if (req.user._id.toString() === session.user.toString()) {
      // User sending to admin/dealer
      recipient = session.assignedTo;
      recipientRole = session.assignedToRole;
    } else {
      // Admin/dealer sending to user
      recipient = session.user;
      recipientRole = 'user';
    }
    
    // Create message
    const chatMessage = await ChatMessage.create({
      sessionId,
      sender: req.user._id,
      senderRole: req.user.role,
      senderName: req.user.name,
      recipient,
      recipientRole,
      message
    });
    
    // Update session
    session.lastMessage = message;
    session.lastMessageAt = new Date();
    
    // Update unread count
    if (recipientRole === 'user') {
      session.unreadCount.user += 1;
    } else {
      session.unreadCount.admin += 1;
    }
    
    await session.save();
    
    // Create notification for recipient
    if (recipient) {
      await Notification.create({
        type: 'support_request',
        title: `💬 New Message from ${req.user.name}`,
        message: message.substring(0, 100),
        recipient: recipientRole,
        recipientId: recipient,
        sender: req.user._id,
        senderName: req.user.name,
        priority: 'medium'
      });
    }
    
    res.json({ success: true, message: chatMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET MESSAGES ============
exports.getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await ChatSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    // Check if user has access to this session
    const hasAccess = 
      session.user.toString() === req.user._id.toString() ||
      (session.assignedTo && session.assignedTo.toString() === req.user._id.toString()) ||
      req.user.role === 'admin';
    
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 });
    
    // Mark messages as read
    const recipientRole = req.user.role;
    await ChatMessage.updateMany(
      { sessionId, recipientRole, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    // Reset unread count
    if (recipientRole === 'user') {
      session.unreadCount.user = 0;
    } else {
      session.unreadCount.admin = 0;
    }
    await session.save();
    
    res.json({ success: true, messages, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ CLOSE CHAT SESSION ============
exports.closeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await ChatSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    session.status = 'closed';
    session.closedAt = new Date();
    session.closedBy = req.user._id;
    await session.save();
    
    // Notify other party
    const otherParty = session.user.toString() === req.user._id.toString() 
      ? session.assignedTo 
      : session.user;
    
    const otherPartyRole = session.user.toString() === req.user._id.toString()
      ? session.assignedToRole
      : 'user';
    
    if (otherParty) {
      await Notification.create({
        type: 'support_request',
        title: '🔒 Chat Session Closed',
        message: `${req.user.name} has closed the chat session`,
        recipient: otherPartyRole,
        recipientId: otherParty,
        sender: req.user._id,
        senderName: req.user.name,
        priority: 'low'
      });
    }
    
    res.json({ success: true, message: 'Chat session closed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET CHAT STATS ============
exports.getChatStats = async (req, res) => {
  try {
    const { role } = req.user;
    
    let query = {};
    if (role === 'admin') {
      query.requestType = 'admin';
    } else if (role === 'dealer') {
      query = {
        $or: [
          { requestType: 'dealer' },
          { assignedTo: req.user._id }
        ]
      };
    }
    
    const [pending, active, closed] = await Promise.all([
      ChatSession.countDocuments({ ...query, status: 'pending' }),
      ChatSession.countDocuments({ ...query, status: 'active' }),
      ChatSession.countDocuments({ ...query, status: 'closed' })
    ]);
    
    res.json({
      success: true,
      stats: { pending, active, closed, total: pending + active + closed }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
