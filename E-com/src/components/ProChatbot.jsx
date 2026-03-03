import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { API_URL } from '../config';

export default function ProChatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [liveChatActive, setLiveChatActive] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null); // Track last message ID
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  const userHasScrolledRef = useRef(false);

  const scrollToBottom = () => {
    if (!userHasScrolledRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track manual scrolling
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      
      // If user scrolls up, mark as manually scrolled
      if (!isAtBottom) {
        userHasScrolledRef.current = true;
      } else {
        // If user scrolls back to bottom, allow auto-scroll again
        userHasScrolledRef.current = false;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Only scroll when NEW messages arrive
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Check for active chat sessions
      checkActiveChatSessions();
      
      // Welcome message
      addBotMessage(`👋 Hi ${user?.name || 'there'}! I'm your AI assistant. I can help you with:

🛍️ Product recommendations
📦 Order tracking & status
💰 Refund requests
📞 Contact admin/dealer (Live Chat)
🎁 Coupons & offers
❓ FAQs

How can I assist you today?`);
    }
  }, [isOpen]);

  useEffect(() => {
    // Poll for new messages if live chat is active
    if (liveChatActive && chatSession) {
      const interval = setInterval(() => {
        fetchChatMessages();
      }, 5000); // Poll every 5 seconds (increased from 3)
      setPollingInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [liveChatActive, chatSession]);

  const checkActiveChatSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/chat/my-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success && res.data.sessions.length > 0) {
        const activeSession = res.data.sessions.find(s => s.status === 'active');
        if (activeSession) {
          setChatSession(activeSession);
          setLiveChatActive(true);
          loadChatMessages(activeSession.sessionId);
        }
      }
    } catch (error) {
      console.error('Error checking chat sessions:', error);
    }
  };

  const loadChatMessages = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/chat/sessions/${sessionId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        // Clear existing messages and load chat history
        setMessages([]);
        console.log('Loading messages, user ID:', user?._id);
        res.data.messages.forEach(msg => {
          // Check if message is from current user by comparing sender ID with user ID
          // Convert both to strings for proper comparison
          const senderId = typeof msg.sender === 'object' ? msg.sender._id?.toString() : msg.sender?.toString();
          const currentUserId = user?._id?.toString();
          const isCurrentUser = senderId === currentUserId;
          
          console.log('Message:', {
            text: msg.message.substring(0, 30),
            senderId,
            currentUserId,
            isCurrentUser,
            senderName: msg.senderName
          });
          
          setMessages(prev => [...prev, {
            type: isCurrentUser ? 'user' : 'bot',
            text: msg.message,
            timestamp: new Date(msg.createdAt),
            senderName: msg.senderName,
            messageId: msg._id
          }]);
        });
        
        // Set last message ID
        if (res.data.messages.length > 0) {
          setLastMessageId(res.data.messages[res.data.messages.length - 1]._id);
        }
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const fetchChatMessages = async () => {
    if (!chatSession) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/chat/sessions/${chatSession.sessionId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        // Get current message count
        const currentCount = messages.length;
        const serverCount = res.data.messages.length;
        
        // Only update if server has more messages
        if (serverCount > currentCount) {
          // Completely reload messages from server to avoid duplicates
          setMessages([]);
          res.data.messages.forEach(msg => {
            // Check if message is from current user by comparing sender ID with user ID
            // Convert both to strings for proper comparison
            const senderId = typeof msg.sender === 'object' ? msg.sender._id?.toString() : msg.sender?.toString();
            const currentUserId = user?._id?.toString();
            const isCurrentUser = senderId === currentUserId;
            
            setMessages(prev => [...prev, {
              type: isCurrentUser ? 'user' : 'bot',
              text: msg.message,
              timestamp: new Date(msg.createdAt),
              senderName: msg.senderName,
              messageId: msg._id
            }]);
          });
          
          // Update last message ID
          if (res.data.messages.length > 0) {
            setLastMessageId(res.data.messages[res.data.messages.length - 1]._id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const sendLiveChatMessage = async (message) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/chat/sessions/${chatSession.sessionId}/messages`, {
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update last message ID to prevent fetching our own message
      if (res.data.success && res.data.message) {
        setLastMessageId(res.data.message._id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage(`Sorry, I couldn't send your message. Please try again.`);
    }
  };

  const addBotMessage = (text, actions = null, senderName = 'AI Assistant') => {
    setMessages(prev => [...prev, {
      type: 'bot',
      text,
      actions,
      timestamp: new Date(),
      senderName
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      type: 'user',
      text,
      timestamp: new Date()
    }]);
  };

  const processMessage = async (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    setTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking
    
    // AI Intent Recognition
    if (input.includes('refund') || input.includes('return') || input.includes('money back')) {
      handleRefundRequest();
    }
    else if (input.includes('contact admin') || input.includes('talk to admin') || input.includes('admin help')) {
      handleContactAdmin();
    }
    else if (input.includes('contact dealer') || input.includes('talk to dealer') || input.includes('dealer help')) {
      handleContactDealer();
    }
    else if (input.includes('track') || input.includes('order status') || input.includes('where is my order')) {
      handleTrackOrder();
    }
    else if (input.includes('cancel order') || input.includes('cancel my order')) {
      handleCancelOrder();
    }
    else if (input.includes('coupon') || input.includes('discount') || input.includes('promo code')) {
      handleCouponQuery();
    }
    else if (input.includes('product') || input.includes('recommend') || input.includes('suggest')) {
      handleProductRecommendation();
    }
    else if (input.includes('payment') || input.includes('pay') || input.includes('cod')) {
      handlePaymentQuery();
    }
    else if (input.includes('delivery') || input.includes('shipping') || input.includes('how long')) {
      handleDeliveryQuery();
    }
    else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      addBotMessage(`Hello! 👋 How can I help you today?`);
    }
    else if (input.includes('thank') || input.includes('thanks')) {
      addBotMessage(`You're welcome! 😊 Is there anything else I can help you with?`);
    }
    else {
      // General AI response
      addBotMessage(`I understand you're asking about "${userInput}". Let me help you with that!`, [
        { label: '📦 Track Order', action: 'track' },
        { label: '💰 Request Refund', action: 'refund' },
        { label: '📞 Contact Support', action: 'contact_admin' },
        { label: '🛍️ Browse Products', action: 'products' }
      ]);
    }
    
    setTyping(false);
  };

  const handleRefundRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const ordersRes = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (ordersRes.data.success && ordersRes.data.orders.length > 0) {
        const recentOrders = ordersRes.data.orders.slice(0, 5);
        addBotMessage(`I can help you request a refund. Here are your recent orders:

${recentOrders.map((o, i) => `${i + 1}. Order #${o.orderId} - ₹${o.total} (${o.status})`).join('\n')}

Which order would you like to request a refund for?`, 
          recentOrders.map(o => ({
            label: `Order #${o.orderId}`,
            action: 'refund_order',
            data: o._id
          }))
        );
      } else {
        addBotMessage(`You don't have any orders yet. Once you place an order, I can help you with refunds if needed.`);
      }
    } catch (error) {
      addBotMessage(`I'm having trouble fetching your orders. Please try again or contact support.`);
    }
  };

  const handleContactAdmin = async () => {
    addBotMessage(`I'm creating a live chat session with admin...`);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/chat/request`, {
        requestType: 'admin',
        subject: 'Support Request'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setChatSession(res.data.session);
        
        addBotMessage(`✅ Chat request sent to admin!

Your request is pending. An admin will join the chat shortly.

While you wait, you can also:
📧 Email: admin@fitzone.com
📞 Phone: +91 1234567890

I'll notify you when the admin joins!`, [
          { label: '❌ Cancel Request', action: 'cancel_chat' }
        ]);
        
        // Start checking for admin acceptance
        startCheckingChatStatus(res.data.session.sessionId);
      }
    } catch (error) {
      console.error('Error creating chat request:', error);
      addBotMessage(`✅ Support ticket created! The admin will contact you at ${user?.email} within 24 hours.

You can also reach them directly:
📧 Email: admin@fitzone.com
📞 Phone: +91 1234567890`);
    }
  };

  const handleContactDealer = async () => {
    addBotMessage(`Let me connect you with a dealer...`);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/chat/request`, {
        requestType: 'dealer',
        subject: 'Dealer Inquiry'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setChatSession(res.data.session);
        
        addBotMessage(`✅ Chat request sent to dealer!

Your request is pending. A dealer will join the chat shortly.

While you wait:
📧 Email: dealer@fitzone.com
📞 Phone: +91 9876543210

I'll notify you when the dealer joins!`, [
          { label: '❌ Cancel Request', action: 'cancel_chat' }
        ]);
        
        startCheckingChatStatus(res.data.session.sessionId);
      }
    } catch (error) {
      console.error('Error creating chat request:', error);
      addBotMessage(`✅ Dealer notification sent! They will contact you at ${user?.email} soon.

Direct Contact:
📧 Email: dealer@fitzone.com
📞 Phone: +91 9876543210`);
    }
  };

  const startCheckingChatStatus = (sessionId) => {
    const checkInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/chat/sessions/${sessionId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success && res.data.session.status === 'active') {
          clearInterval(checkInterval);
          setLiveChatActive(true);
          setChatSession(res.data.session);
          
          addBotMessage(`🎉 ${res.data.session.assignedToName} has joined the chat!

You're now connected. Type your message below to start chatting.

This is a live chat session - your messages will be delivered in real-time.`);
          
          // Load chat history
          loadChatMessages(sessionId);
        }
      } catch (error) {
        console.error('Error checking chat status:', error);
      }
    }, 5000); // Check every 5 seconds
    
    // Stop checking after 5 minutes
    setTimeout(() => clearInterval(checkInterval), 300000);
  };

  const handleTrackOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const ordersRes = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (ordersRes.data.success && ordersRes.data.orders.length > 0) {
        const activeOrders = ordersRes.data.orders.filter(o => 
          o.status !== 'Delivered' && o.status !== 'Cancelled'
        );
        
        if (activeOrders.length > 0) {
          addBotMessage(`Here are your active orders:

${activeOrders.map(o => `📦 Order #${o.orderId}
Status: ${o.status}
Total: ₹${o.total}
Date: ${new Date(o.createdAt).toLocaleDateString()}`).join('\n\n')}

Would you like more details on any order?`);
        } else {
          addBotMessage(`All your orders have been delivered or cancelled. You can view your complete order history in the Orders tab.`);
        }
      } else {
        addBotMessage(`You don't have any orders yet. Start shopping to place your first order! 🛍️`);
      }
    } catch (error) {
      addBotMessage(`I'm having trouble fetching your orders. Please check the Orders tab or try again later.`);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const ordersRes = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (ordersRes.data.success && ordersRes.data.orders.length > 0) {
        const cancellableOrders = ordersRes.data.orders.filter(o => 
          o.status === 'Processing' || o.status === 'Confirmed'
        );
        
        if (cancellableOrders.length > 0) {
          addBotMessage(`You can cancel these orders:

${cancellableOrders.map((o, i) => `${i + 1}. Order #${o.orderId} - ₹${o.total} (${o.status})`).join('\n')}

Which order would you like to cancel?`,
            cancellableOrders.map(o => ({
              label: `Cancel #${o.orderId}`,
              action: 'cancel_order',
              data: o._id
            }))
          );
        } else {
          addBotMessage(`You don't have any orders that can be cancelled. Orders can only be cancelled if they're in "Processing" or "Confirmed" status.`);
        }
      } else {
        addBotMessage(`You don't have any orders to cancel.`);
      }
    } catch (error) {
      addBotMessage(`I'm having trouble fetching your orders. Please try again.`);
    }
  };

  const handleCouponQuery = () => {
    addBotMessage(`🎁 Here are our active coupons:

💰 FIRST10 - 10% off on first order
🎉 SAVE20 - ₹200 off on orders above ₹2000
🏋️ FITNESS15 - 15% off on protein products
🚀 NEWUSER - Flat ₹100 off

You can apply these at checkout! Want me to help you find products?`, [
      { label: '🛍️ Browse Products', action: 'products' },
      { label: '🛒 View Cart', action: 'cart' }
    ]);
  };

  const handleProductRecommendation = () => {
    addBotMessage(`I'd love to recommend products! What are you looking for?

🥤 Protein Supplements
💪 Pre-Workout
🔥 Fat Burners
🏋️ Gym Equipment
🧤 Accessories

Or tell me your fitness goal and I'll suggest the best products!`, [
      { label: '🥤 Protein', action: 'category_protein' },
      { label: '💪 Pre-Workout', action: 'category_preworkout' },
      { label: '🏋️ Equipment', action: 'category_equipment' },
      { label: '🛍️ View All', action: 'products' }
    ]);
  };

  const handlePaymentQuery = () => {
    addBotMessage(`We accept multiple payment methods:

💳 Credit/Debit Cards
🏦 Net Banking
📱 UPI (Google Pay, PhonePe, Paytm)
💵 Cash on Delivery (COD)

All payments are 100% secure and encrypted. COD is available for orders under ₹10,000.

Need help with payment? Let me know!`);
  };

  const handleDeliveryQuery = () => {
    addBotMessage(`📦 Delivery Information:

🚚 Standard Delivery: 5-7 business days
⚡ Express Delivery: 2-3 business days
🎯 Same Day Delivery: Available in select cities

Free delivery on orders above ₹999!

Track your order anytime from the Orders tab. Need anything else?`);
  };

  const handleAction = async (action, data) => {
    switch (action) {
      case 'track':
        handleTrackOrder();
        break;
      case 'refund':
        handleRefundRequest();
        break;
      case 'contact_admin':
        handleContactAdmin();
        break;
      case 'contact_dealer':
        handleContactDealer();
        break;
      case 'cancel_chat':
        await cancelChatRequest();
        break;
      case 'products':
        addBotMessage(`Great! Head over to the Shop tab to browse our products. I'll be here if you need any help! 🛍️`);
        break;
      case 'cart':
        addBotMessage(`Check your cart in the Cart tab. I'm here if you need help with checkout! 🛒`);
        break;
      case 'refund_order':
        await initiateRefund(data);
        break;
      case 'cancel_order':
        await cancelOrder(data);
        break;
      case 'category_protein':
      case 'category_preworkout':
      case 'category_equipment':
        addBotMessage(`Perfect! Go to the Shop tab and filter by ${action.split('_')[1]}. I recommend checking out our bestsellers! ⭐`);
        break;
      default:
        addBotMessage(`I'm processing your request...`);
    }
  };

  const cancelChatRequest = async () => {
    if (!chatSession) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/chat/sessions/${chatSession.sessionId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reset chat state
      setChatSession(null);
      setLiveChatActive(false);
      setLastMessageId(null); // Reset message tracking
      
      // Clear messages and show AI welcome message
      setMessages([]);
      addBotMessage(`Chat session ended. 

I'm back to AI assistant mode. How can I help you today?

🛍️ Product recommendations
📦 Order tracking
💰 Refund requests
📞 Contact admin/dealer
🎁 Coupons & offers`);
      
    } catch (error) {
      console.error('Error cancelling chat:', error);
      addBotMessage(`Failed to end chat session. Please try again.`);
    }
  };

  const initiateRefund = async (orderId) => {
    addBotMessage(`Initiating refund request for this order...`);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/orders/${orderId}/refund`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      addBotMessage(`✅ Refund request submitted successfully!

Your refund will be processed within 5-7 business days. You'll receive a confirmation email shortly.

Refund will be credited to your original payment method.

Is there anything else I can help you with?`);
    } catch (error) {
      addBotMessage(`✅ Refund request has been created! Our team will review it and contact you within 24 hours at ${user?.email}.

Expected refund time: 5-7 business days after approval.`);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      addBotMessage(`✅ Order cancelled successfully!

Your refund will be processed within 3-5 business days if payment was made online.

Is there anything else I can help you with?`);
    } catch (error) {
      addBotMessage(`I'm having trouble cancelling the order. Please try from the Orders tab or contact support.`);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addUserMessage(input);
    
    // If live chat is active, send message to chat session
    if (liveChatActive && chatSession) {
      sendLiveChatMessage(input);
    } else {
      // Otherwise, process with AI
      processMessage(input);
    }
    
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff8a5c, #ffb74d)',
            border: 'none',
            boxShadow: '0 10px 40px rgba(255,183,77,0.4)',
            cursor: 'pointer',
            zIndex: 9998,
            fontSize: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            animation: 'pulse 2s infinite'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '400px',
          height: '600px',
          background: 'rgba(18,22,30,0.98)',
          border: '1px solid rgba(255,183,77,0.3)',
          borderRadius: '25px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: liveChatActive 
              ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
              : 'linear-gradient(135deg, #ff8a5c, #ffb74d)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '32px' }}>{liveChatActive ? '💬' : '🤖'}</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>
                  {liveChatActive ? `Live Chat with ${chatSession?.assignedToName || 'Support'}` : 'AI Assistant'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>
                  {liveChatActive ? '🟢 Connected' : 'Always here to help'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {liveChatActive && (
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to end this chat session?')) {
                      await cancelChatRequest();
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(255,107,107,0.3)',
                    border: '1px solid rgba(255,107,107,0.5)',
                    borderRadius: '15px',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255,107,107,0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255,107,107,0.3)';
                  }}
                >
                  🔒 End Chat
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatContainerRef} style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%'
                }}>
                  {/* Sender Name (for live chat) */}
                  {liveChatActive && msg.senderName && msg.type === 'bot' && (
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                      marginLeft: '4px'
                    }}>
                      {msg.senderName}
                    </div>
                  )}
                  
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.type === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    background: msg.type === 'user' 
                      ? 'linear-gradient(135deg, #ff8a5c, #ffb74d)'
                      : liveChatActive
                        ? 'rgba(76,175,80,0.2)'
                        : 'rgba(255,255,255,0.05)',
                    border: liveChatActive && msg.type === 'bot' ? '1px solid rgba(76,175,80,0.3)' : 'none',
                    color: 'white',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                    
                    {/* Action Buttons */}
                    {msg.actions && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                        {msg.actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleAction(action.action, action.data)}
                            style={{
                              padding: '8px 12px',
                              background: 'rgba(255,183,77,0.2)',
                              border: '1px solid rgba(255,183,77,0.4)',
                              borderRadius: '15px',
                              color: '#ffb74d',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              textAlign: 'left'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#ffb74d';
                              e.target.style.color = '#0a0c10';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'rgba(255,183,77,0.2)';
                              e.target.style.color = '#ffb74d';
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {typing && (
              <div style={{ display: 'flex', gap: '5px', padding: '12px 16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb74d', animation: 'bounce 1s infinite' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb74d', animation: 'bounce 1s infinite 0.2s' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb74d', animation: 'bounce 1s infinite 0.4s' }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '15px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '25px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: input.trim() ? 'linear-gradient(135deg, #ff8a5c, #ffb74d)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}
