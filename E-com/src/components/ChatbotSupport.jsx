import { useState, useRef, useEffect } from 'react';

function ChatbotSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! 👋 Welcome to FIT ZONE! How can I help you today?', time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined responses
  const botResponses = {
    greeting: ['hi', 'hello', 'hey', 'good morning', 'good evening'],
    products: ['product', 'supplement', 'protein', 'creatine', 'preworkout', 'what do you sell'],
    order: ['order', 'track', 'delivery', 'shipping', 'when will'],
    payment: ['payment', 'pay', 'razorpay', 'upi', 'card'],
    return: ['return', 'refund', 'cancel', 'exchange'],
    help: ['help', 'support', 'contact', 'assistance'],
    price: ['price', 'cost', 'how much', 'discount', 'coupon'],
  };

  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (botResponses.greeting.some(word => msg.includes(word))) {
      return 'Hello! 😊 I\'m here to help you with your fitness journey. What would you like to know about?';
    }
    if (botResponses.products.some(word => msg.includes(word))) {
      return 'We offer premium gym supplements including:\n\n💪 Whey Protein\n⚡ Creatine\n🔥 Pre-Workout\n🏋️ BCAA\n🥤 Casein\n\nYou can browse all products in the Shop section!';
    }
    if (botResponses.order.some(word => msg.includes(word))) {
      return 'You can track your order from the Orders tab in your dashboard. Orders typically arrive within 3-5 business days. Need help with a specific order?';
    }
    if (botResponses.payment.some(word => msg.includes(word))) {
      return 'We accept payments via Razorpay:\n\n💳 Credit/Debit Cards\n📱 UPI (Google Pay, PhonePe, Paytm)\n🏦 Net Banking\n💰 Wallets\n\nAll payments are 100% secure!';
    }
    if (botResponses.return.some(word => msg.includes(word))) {
      return 'We have a 7-day return policy for unopened products. To initiate a return, go to Orders → Select Order → Cancel Order. Refunds are processed within 5-7 business days.';
    }
    if (botResponses.price.some(word => msg.includes(word))) {
      return 'We offer competitive prices! 💰\n\nActive Coupons:\n🎟️ FITZONE10 - 10% off\n🎟️ FITZONE20 - 20% off\n🎟️ WELCOME50 - ₹50 off\n\nApply at checkout!';
    }
    if (botResponses.help.some(word => msg.includes(word))) {
      return 'I can help you with:\n\n📦 Products & Pricing\n🛒 Orders & Tracking\n💳 Payments\n🔄 Returns & Refunds\n🎟️ Coupons & Offers\n\nWhat do you need help with?';
    }

    return 'I\'m here to help! You can ask me about:\n\n• Products & Supplements\n• Order Tracking\n• Payment Methods\n• Returns & Refunds\n• Coupons & Discounts\n\nOr type "help" for more options! 😊';
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMsg = { type: 'user', text: inputText, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = getResponse(inputText);
      const botMsg = { type: 'bot', text: botResponse, time: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const quickActions = [
    { icon: '📦', text: 'Track Order', response: 'track my order' },
    { icon: '🎟️', text: 'Coupons', response: 'show me coupons' },
    { icon: '💳', text: 'Payment', response: 'payment methods' },
    { icon: '🔄', text: 'Returns', response: 'return policy' },
  ];

  const handleQuickAction = (response) => {
    setInputText(response);
    setTimeout(() => handleSend(), 100);
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
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffb74d, #ff8a5c)',
            border: 'none',
            boxShadow: '0 10px 30px rgba(255, 183, 77, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            zIndex: 9998,
            transition: 'all 0.3s',
            animation: 'pulse 2s infinite'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 183, 77, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 183, 77, 0.4)';
          }}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '380px',
          height: '550px',
          background: 'rgba(18, 22, 30, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 183, 77, 0.3)',
          borderRadius: '25px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideInUp 0.3s ease'
        }}>
          
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #ffb74d, #ff8a5c)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{ color: '#0a0c10', fontSize: '16px', fontWeight: '700', margin: 0 }}>
                  FIT ZONE Support
                </h3>
                <p style={{ color: 'rgba(10, 12, 16, 0.7)', fontSize: '12px', margin: 0 }}>
                  Online • Always here to help
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#0a0c10',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: msg.type === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  background: msg.type === 'user' 
                    ? 'linear-gradient(135deg, #ffb74d, #ff8a5c)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: msg.type === 'user' ? '#0a0c10' : 'white',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '20px 20px 20px 5px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  <span style={{ animation: 'blink 1.4s infinite' }}>●</span>
                  <span style={{ animation: 'blink 1.4s infinite 0.2s' }}>●</span>
                  <span style={{ animation: 'blink 1.4s infinite 0.4s' }}>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div style={{
            padding: '10px 20px',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.response)}
                style={{
                  padding: '8px 14px',
                  background: 'rgba(255, 183, 77, 0.1)',
                  border: '1px solid rgba(255, 183, 77, 0.3)',
                  borderRadius: '20px',
                  color: '#ffb74d',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 183, 77, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 183, 77, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {action.icon} {action.text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '15px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '25px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: inputText.trim() 
                  ? 'linear-gradient(135deg, #ffb74d, #ff8a5c)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: inputText.trim() ? '#0a0c10' : 'rgba(255, 255, 255, 0.3)',
                fontSize: '18px',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default ChatbotSupport;
