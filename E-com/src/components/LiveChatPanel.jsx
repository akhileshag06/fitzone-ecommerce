import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { API_URL } from '../config';

export default function LiveChatPanel({ token, userRole, userName, userId }) {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending', 'active', 'closed', 'all'
  const messagesEndRef = useRef(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [filter]);

  useEffect(() => {
    if (activeSession) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_URL}/chat/sessions?status=${filter}`, { headers });
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    if (!activeSession) return;
    
    try {
      const res = await axios.get(`${API_URL}/chat/sessions/${activeSession.sessionId}/messages`, { headers });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const acceptSession = async (sessionId) => {
    try {
      const res = await axios.put(`${API_URL}/chat/sessions/${sessionId}/accept`, {}, { headers });
      if (res.data.success) {
        setActiveSession(res.data.session);
        fetchSessions();
      }
    } catch (error) {
      alert('Failed to accept chat session');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSession) return;
    
    try {
      await axios.post(`${API_URL}/chat/sessions/${activeSession.sessionId}/messages`, {
        message: input
      }, { headers });
      
      setInput('');
      fetchMessages();
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const closeSession = async () => {
    if (!activeSession) return;
    
    if (!confirm('Are you sure you want to close this chat session?')) return;
    
    try {
      await axios.put(`${API_URL}/chat/sessions/${activeSession.sessionId}/close`, {}, { headers });
      setActiveSession(null);
      setMessages([]);
      fetchSessions();
    } catch (error) {
      alert('Failed to close session');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>Loading chats...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: activeSession ? '350px 1fr' : '1fr', height: '600px', gap: '20px' }}>
      {/* Sessions List */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '5px', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {['pending', 'active', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: filter === f ? 'rgba(255,183,77,0.15)' : 'transparent',
                border: filter === f ? '1px solid #ffb74d' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '15px',
                color: filter === f ? '#ffb74d' : 'rgba(255,255,255,0.6)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sessions */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {sessions.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>💬</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>No {filter} chats</p>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session._id}
                onClick={() => session.status === 'active' ? setActiveSession(session) : null}
                style={{
                  padding: '15px',
                  background: activeSession?.sessionId === session.sessionId 
                    ? 'rgba(255,183,77,0.1)' 
                    : 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '15px',
                  marginBottom: '10px',
                  cursor: session.status === 'active' ? 'pointer' : 'default',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      {session.userName}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                      {session.userEmail}
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 600,
                    background: session.status === 'pending' 
                      ? 'rgba(255,183,77,0.15)' 
                      : session.status === 'active'
                        ? 'rgba(76,175,80,0.15)'
                        : 'rgba(255,255,255,0.05)',
                    color: session.status === 'pending'
                      ? '#ffb74d'
                      : session.status === 'active'
                        ? '#4CAF50'
                        : 'rgba(255,255,255,0.5)'
                  }}>
                    {session.status}
                  </span>
                </div>

                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px' }}>
                  {session.subject}
                </div>

                {session.lastMessage && (
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '8px' }}>
                    {session.lastMessage.substring(0, 50)}...
                  </div>
                )}

                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>
                  {new Date(session.createdAt).toLocaleString()}
                </div>

                {session.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      acceptSession(session.sessionId);
                    }}
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      padding: '8px',
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ✅ Accept Chat
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {activeSession && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(76,175,80,0.1)'
          }}>
            <div>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
                {activeSession.userName}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                {activeSession.userEmail}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={closeSession}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,107,107,0.2)',
                  border: '1px solid rgba(255,107,107,0.3)',
                  borderRadius: '15px',
                  color: '#ff6b6b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🔒 Close Chat
              </button>
              <button
                onClick={() => setActiveSession(null)}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
            </div>
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
            {messages.map((msg, index) => {
              // Check if message is from current user by comparing sender ID
              // Convert both to strings for comparison since sender is ObjectId
              const senderId = typeof msg.sender === 'object' ? msg.sender._id?.toString() : msg.sender?.toString();
              const currentUserId = userId?.toString();
              const isCurrentUser = senderId === currentUserId;
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                      marginLeft: isCurrentUser ? 'auto' : '4px',
                      textAlign: isCurrentUser ? 'right' : 'left'
                    }}>
                      {msg.senderName}
                    </div>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: isCurrentUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                      background: isCurrentUser
                        ? 'linear-gradient(135deg, #4CAF50, #45a049)'
                        : 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.message}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.3)',
                      marginTop: '4px',
                      textAlign: isCurrentUser ? 'right' : 'left'
                    }}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '15px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
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
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: input.trim() ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'rgba(255,255,255,0.1)',
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
    </div>
  );
}
