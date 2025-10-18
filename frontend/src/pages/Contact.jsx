import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth.context';
import { Card, Input, Button, Avatar, message as antMessage, Spin, Empty } from 'antd';
import { SendOutlined, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import { AxiosInstance } from '../services/Axios.service';

const { TextArea } = Input;

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  const { sellerId, itemId, itemType, itemName } = location.state || {};

  useEffect(() => {
    console.log('Contact page loaded with state:', { sellerId, itemId, itemType, itemName });
    
    if (!sellerId || !itemId || !itemType) {
      console.error('Missing required parameters:', { sellerId, itemId, itemType });
      antMessage.error(`Invalid chat parameters. Missing: ${!sellerId ? 'sellerId ' : ''}${!itemId ? 'itemId ' : ''}${!itemType ? 'itemType' : ''}`);
      navigate(-1);
      return;
    }

    const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      antMessage.error('Failed to connect to chat server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [sellerId, itemId, itemType, navigate]);

  useEffect(() => {
    const initializeChat = async () => {
      console.log('=== INITIALIZING CHAT ===');
      console.log('sellerId:', sellerId);
      console.log('itemId:', itemId);
      console.log('itemType:', itemType);
      console.log('user:', user);
      console.log('user._id:', user?._id);
      console.log('user.id:', user?.id);
      
      // Check if user is trying to contact themselves
      const currentUserId = user?._id || user?.id;
      if (sellerId === currentUserId) {
        console.error('User trying to contact themselves');
        antMessage.error('You cannot chat with yourself. This is your own listing!');
        navigate(-1); // Go back
        return;
      }
      
      // Check for authentication token
      const token = localStorage.getItem('accessToken');
      console.log('Access token present:', !!token);
      console.log('Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'none');
      
      if (!token) {
        console.error('No access token found in localStorage');
        antMessage.error('Please log in to use chat');
        navigate('/login', { 
          state: { 
            returnTo: location.pathname, 
            returnState: { sellerId, itemId, itemType, itemName } 
          } 
        });
        return;
      }
      
      try {
        setLoading(true);
        
        console.log('Creating/fetching chat...');
        console.log('Request payload:', {
          other_user_id: sellerId,
          product_id: itemType === 'product' ? itemId : null,
          service_id: itemType === 'service' ? itemId : null
        });
        
        const response = await AxiosInstance.post('/chats/create', {
          other_user_id: sellerId,
          product_id: itemType === 'product' ? itemId : null,
          service_id: itemType === 'service' ? itemId : null
        });

        console.log('Chat response:', response.data);
        const chat = response.data.data;
        setChatId(chat._id);
        console.log('Chat ID set to:', chat._id);
        console.log('Chat participants:', chat.participants);

        // Participants are populated objects, not just IDs
        const currentUserId = user._id || user.id;
        console.log('Current user ID:', currentUserId);
        console.log('Participants array length:', chat.participants?.length);
        
        const otherUserObj = chat.participants?.find(p => {
          const participantId = typeof p === 'string' ? p : (p?._id || p?.id);
          console.log('Checking participant:', participantId, 'against current user:', currentUserId);
          return participantId && participantId !== currentUserId;
        });
        
        console.log('Other user object:', otherUserObj);
        
        if (!otherUserObj) {
          console.error('Could not find other participant in chat');
          throw new Error('Could not find other participant. Chat participants: ' + JSON.stringify(chat.participants));
        }
        
        // If participant is already populated, use it directly
        if (typeof otherUserObj === 'object' && otherUserObj.name) {
          setOtherUser(otherUserObj);
          console.log('Other user loaded from chat participants:', otherUserObj);
        } else {
          // If not populated, fetch from API
          const otherUserId = typeof otherUserObj === 'string' ? otherUserObj : (otherUserObj._id || otherUserObj.id);
          
          if (!otherUserId) {
            console.error('Could not extract user ID from participant:', otherUserObj);
            throw new Error('Invalid participant data structure');
          }
          
          console.log('Fetching user from API with ID:', otherUserId);
          const userResponse = await AxiosInstance.get(`/users/${otherUserId}`);
          setOtherUser(userResponse.data.data);
          console.log('Other user loaded from API:', userResponse.data.data);
        }

        console.log('Fetching messages for chat:', chat._id);
        const messagesResponse = await AxiosInstance.get(`/chats/${chat._id}`);
        console.log('Messages response:', messagesResponse.data);
        
        const chatData = messagesResponse.data.data;
        const loadedMessages = chatData.messages || [];
        setMessages(loadedMessages);
        console.log('Messages loaded:', loadedMessages.length);
        
        if (loadedMessages.length > 0) {
          console.log('Sample message:', loadedMessages[0]);
          console.log('All messages:', loadedMessages);
        } else {
          console.log('No messages in this chat yet');
        }
        
        // Count unread messages from other user
        const unreadCount = loadedMessages.filter(
          msg => !msg.read && msg.sender_id !== (user._id || user.id)
        ).length;
        console.log('Unread messages:', unreadCount);

        // Mark messages as read
        if (unreadCount > 0) {
          try {
            console.log('Marking messages as read...');
            await AxiosInstance.put(`/chats/${chat._id}/read`);
            console.log('Messages marked as read successfully');
            
            // Update local state to reflect read status
            setMessages(prevMessages => 
              prevMessages.map(msg => ({
                ...msg,
                read: msg.sender_id === (user._id || user.id) ? msg.read : true
              }))
            );
          } catch (readError) {
            console.error('Error marking messages as read:', readError);
            // Don't block the chat if marking as read fails
          }
        }

        if (socket) {
          console.log('Joining chat room:', chat._id);
          socket.emit('join_chat', chat._id);
        } else {
          console.warn('Socket not available yet');
        }

        setLoading(false);
        console.log('Chat initialization complete');
      } catch (error) {
        console.error('Error initializing chat:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        if (error.response?.status === 401) {
          console.error('Authentication failed - token invalid or expired');
          antMessage.error('Session expired. Please log in again.');
          localStorage.removeItem('accessToken');
          navigate('/login', { 
            state: { 
              returnTo: location.pathname, 
              returnState: { sellerId, itemId, itemType, itemName } 
            } 
          });
        } else {
          antMessage.error(error.response?.data?.message || 'Failed to load chat');
        }
        setLoading(false);
      }
    };

    if (socket && user) {
      console.log('Socket and user available, initializing chat');
      initializeChat();
    } else {
      console.log('Waiting for socket and user...', { socket: !!socket, user: !!user });
    }
  }, [socket, user, sellerId, itemId, itemType, navigate, location.pathname, itemName]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', async (data) => {
        console.log('=== MESSAGE RECEIVED VIA SOCKET ===');
        console.log('Received data:', data);
        console.log('Current chatId:', chatId);
        
        if (data.chat_id === chatId) {
          console.log('Message is for this chat, adding to messages');
          
          // Add the message to local state
          setMessages(prev => {
            const updated = [...prev, data.message];
            console.log('Updated messages:', updated);
            return updated;
          });
          
          // If message is from another user, mark it as read automatically
          if (data.sender_id !== (user?._id || user?.id)) {
            try {
              console.log('Message from other user, marking as read...');
              await AxiosInstance.put(`/chats/${chatId}/read`);
              console.log('Message marked as read');
              
              // Update the message read status in local state
              setMessages(prev => 
                prev.map(msg => ({
                  ...msg,
                  read: msg.sender_id === (user?._id || user?.id) ? msg.read : true
                }))
              );
            } catch (error) {
              console.error('Error marking message as read:', error);
            }
          }
          
          scrollToBottom();
        } else {
          console.log('Message is for different chat, ignoring');
        }
      });

      socket.on('user_typing', (data) => {
        if (data.chat_id === chatId && data.user_id !== (user?._id || user?.id)) {
          console.log('User is typing...');
        }
      });
      
      socket.on('connect', () => {
        console.log('Socket connected in chat page');
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected in chat page');
      });
      
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('error');
      }
    };
  }, [socket, chatId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    console.log('=== SEND MESSAGE CLICKED ===');
    console.log('newMessage:', newMessage);
    console.log('chatId:', chatId);
    console.log('socket:', socket);
    console.log('user:', user);
    
    if (!newMessage.trim()) {
      console.log('Message is empty');
      return;
    }
    
    if (!user) {
      console.log('User not loaded');
      antMessage.error('User information not available');
      return;
    }

    try {
      setSending(true);
      
      let currentChatId = chatId;
      
      // If chatId is null, try to create/fetch the chat first
      if (!currentChatId) {
        console.log('No chatId, creating chat first...');
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
          antMessage.error('Please log in to send messages');
          navigate('/login');
          return;
        }
        
        try {
          const chatResponse = await AxiosInstance.post('/chats/create', {
            other_user_id: sellerId,
            product_id: itemType === 'product' ? itemId : null,
            service_id: itemType === 'service' ? itemId : null
          });
          
          currentChatId = chatResponse.data.data._id;
          setChatId(currentChatId);
          console.log('Chat created with ID:', currentChatId);
          
          // Join the socket room
          if (socket) {
            socket.emit('join_chat', currentChatId);
          }
        } catch (error) {
          console.error('Failed to create chat:', error);
          if (error.response?.status === 401) {
            antMessage.error('Session expired. Please log in again.');
            localStorage.removeItem('accessToken');
            navigate('/login');
          } else {
            antMessage.error('Failed to initialize chat');
          }
          setSending(false);
          return;
        }
      }
      
      const messageData = {
        chat_id: currentChatId,
        sender_id: user._id || user.id,
        message: newMessage.trim()
      };
      
      console.log('Sending message to database via API...');
      
      // Always save to database first via REST API
      const response = await AxiosInstance.post('/chats/message', {
        chat_id: currentChatId,
        message: newMessage.trim()
      });
      
      console.log('Message saved to database:', response.data);
      
      // Add message to local state immediately
      const newMsg = {
        sender_id: user._id || user.id,
        message: newMessage.trim(),
        timestamp: new Date(),
        read: false
      };
      setMessages(prev => [...prev, newMsg]);
      
      // If socket is connected, also emit for real-time delivery to other user
      if (socket && socket.connected) {
        console.log('Socket connected, broadcasting message via WebSocket...');
        socket.emit('send_message', messageData);
        console.log('Message broadcasted via socket');
      } else {
        console.log('Socket not connected, message saved to database only');
        antMessage.info('Message saved. Will be delivered when recipient is online.');
      }

      setNewMessage('');
      setSending(false);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        antMessage.error('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        antMessage.error(error.response?.data?.message || 'Failed to send message');
      }
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (socket && chatId) {
      socket.emit('typing', { chat_id: chatId, user_id: user._id });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
             date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
          <div className="flex items-center gap-4 pb-4 border-b">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
              type="text"
            />
            <Avatar size={48} icon={<UserOutlined />} className="bg-blue-500" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {otherUser?.name?.fname && otherUser?.name?.lname 
                  ? `${otherUser.name.fname} ${otherUser.name.lname}`
                  : otherUser?.universityMail || 'Seller'}
              </h2>
              <p className="text-sm text-gray-500">
                Regarding: {itemName || 'Product/Service'}
              </p>
            </div>
          </div>

          <div className="h-[500px] overflow-y-auto py-4 space-y-4">
            {messages.length === 0 ? (
              <Empty 
                description="No messages yet. Start the conversation!" 
                className="mt-20"
              />
            ) : (
              messages.map((msg, index) => {
                const isCurrentUser = msg.sender_id === user._id;
                const isUnread = !msg.read && !isCurrentUser;
                
                return (
                  <div
                    key={index}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="relative">
                      {isUnread && (
                        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? 'bg-blue-500 text-white'
                            : isUnread
                            ? 'bg-blue-50 text-gray-800 border-2 border-blue-200'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="break-words">{msg.message}</p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatTime(msg.timestamp)}
                          </span>
                          {isCurrentUser && (
                            <span className={`text-xs ${msg.read ? 'text-blue-200' : 'text-blue-300'}`}>
                              {msg.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <TextArea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="flex-1"
                disabled={sending}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={sending}
                disabled={!newMessage.trim()}
                size="large"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
