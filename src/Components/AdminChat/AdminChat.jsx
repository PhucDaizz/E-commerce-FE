// Components/AdminChat/AdminChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../Services/ChatService';
import { toast } from 'react-toastify';
import { 
  MessageCircle, 
  X, 
  Send, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  Minimize2,
  Maximize2,
  User,
  ArrowLeft
} from 'lucide-react';
import './AdminChatComponent.css';
import { useChat } from '../../Context/ChatContext';

const AdminChatComponent = ({ admin, token }) => {
  const {markReadMessage} = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'active'
  
  // Chat state
  const [pendingConversations, setPendingConversations] = useState([]);
  const [activeConversations, setActiveConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const isInitializedRef = useRef(false); // Thêm ref để track initialization

  // Initialize connection and event handlers - FIX: Chỉ chạy 1 lần
  useEffect(() => {
    if (token && admin && !isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeChat();
    }

    return () => {
      // Cleanup khi component unmount
      if (isInitializedRef.current) {
        chatService.dispose();
        isInitializedRef.current = false;
      }
    };
  }, []); // FIX: Loại bỏ dependencies để chỉ chạy 1 lần

  // FIX: Separate effect để handle token/admin changes
  useEffect(() => {
    if (!token || !admin) {
      // Reset states when token/admin becomes invalid
      setIsConnected(false);
      setPendingConversations([]);
      setActiveConversations([]);
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [token, admin]);

  useEffect(()=> {
    // console.log('activeConversations',activeConversations);
  },[activeConversations])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      await chatService.startConnection(token);
      setIsConnected(true);
      setupEventHandlers();
      // toast.success('Kết nối chat thành công!');
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // toast.error('Không thể kết nối chat: ' + error.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setupEventHandlers = () => {
    // FIX: Clear existing handlers trước khi đăng ký mới
    chatService.off('ReceivePendingConversations');
    chatService.off('ReceiveActiveConversationList');
    chatService.off('NewChatRequest');
    chatService.off('ChatAcceptedByOther');
    chatService.off('ChatAcceptedByYou');
    chatService.off('LoadChatHistory');
    chatService.off('AdminJoined');
    chatService.off('AddToActiveConversationList');
    chatService.off('ReceiveMessage');
    chatService.off('ClientReconnected');
    chatService.off('ClientDisconnected');
    chatService.off('ChatClosed');
    chatService.off('ChatError');
    chatService.off('ChatInfo');
    chatService.off('ReceiveReadReceipt');

    // Receive pending conversations when admin connects
    chatService.on('ReceivePendingConversations', (conversations) => {
      // console.log('Received pending conversations:', conversations);
      setPendingConversations(conversations);
    });

    // Receive active conversations when admin connects
    chatService.on('ReceiveActiveConversationList', (conversations) => {
      // console.log('Received active conversations:', conversations);
      setActiveConversations(conversations);
    });

    // New chat request from client
    chatService.on('NewChatRequest', (conversation) => {
      // console.log('New chat request:', conversation);
      setPendingConversations(prev => [...prev, conversation]);
      toast.info(`Có yêu cầu chat mới từ ${conversation.userName}`);
    });

    // Chat accepted by another admin
    chatService.on('ChatAcceptedByOther', (conversationId, adminName) => {
      setPendingConversations(prev => 
        prev.filter(conv => conv.conversationId !== conversationId)
      );
      toast.warning(`Cuộc hội thoại đã được ${adminName} nhận`);
    });

    // Chat accepted by current admin
    chatService.on('ChatAcceptedByYou', (conversationId) => {
      // console.log('Chat accepted by you:', conversationId);
      // Move from pending to active will be handled by LoadChatHistory
    });

    // Load chat history
    chatService.on('LoadChatHistory', (conversationId, history) => {
      // console.log('Loading chat history for:', conversationId, history);
      setMessages(history);
      setCurrentConversation(prev => ({
        ...prev,
        conversationId: conversationId
      }));
    });

    // Admin joined notification
    chatService.on('AdminJoined', (conversationId, adminName, adminId) => {
      // console.log('Admin joined:', conversationId, adminName, adminId);
      if (adminId === admin.id) {
        // Update active conversations
        const pendingConv = pendingConversations.find(c => c.conversationId === conversationId);
        if (pendingConv) {
          const activeConv = {
            ConversationId: conversationId,
            ClientUserName: pendingConv.clientUserName,
            ClientUserId: pendingConv.clientUserId,
            LastMessageContent: pendingConv.initialMessage || 'No messages yet',
            LastMessageTime: new Date().toLocaleString(),
            IsReadByAdmin: false
          };
          setActiveConversations(prev => [...prev, activeConv]);
          setPendingConversations(prev => 
            prev.filter(c => c.conversationId !== conversationId)
          );
        }
      }
    });

    chatService.on('AddToActiveConversationList', (activeConversationInfo) => {
      // console.log('Received AddToActiveConversationList:', activeConversationInfo);
      // Đảm bảo không bị trùng lặp nếu đã có từ ReceiveActiveConversationList ban đầu
      setPendingConversations(prev => 
        prev.filter(c => c.conversationId !== activeConversationInfo.conversationId)
      );
      setActiveConversations(prev => {
        const existingIndex = prev.findIndex(c => c.conversationId === activeConversationInfo.conversationId);
        if (existingIndex > -1) {
          // Nếu đã tồn tại, cập nhật thay vì thêm mới
          const updatedList = [...prev];
          updatedList[existingIndex] = {
            conversationId: activeConversationInfo.conversationId,
            clientUserName: activeConversationInfo.clientUserName,
            clientUserId: activeConversationInfo.clientUserId,
            lastMessageContent: activeConversationInfo.lastMessageContent,
            lastMessageTime: activeConversationInfo.lastMessageTime,
            isReadByAdmin: activeConversationInfo.isReadByAdmin,
          };
          return updatedList;
        }
        // Thêm mới nếu chưa có
        return [...prev, {
            conversationId: activeConversationInfo.conversationId,
            clientUserName: activeConversationInfo.clientUserName,
            clientUserId: activeConversationInfo.clientUserId,
            lastMessageContent: activeConversationInfo.lastMessageContent,
            lastMessageTime: activeConversationInfo.lastMessageTime,
            isReadByAdmin: activeConversationInfo.isReadByAdmin,
        }];
      });
    });

    // FIX: Receive new message - chỉ xử lý 1 lần
    chatService.on('ReceiveMessage', (message) => {
      // console.log('Received message:', message);
      
      // Only add to messages if it's for the current conversation
      if (currentConversation && currentConversation.conversationId === message.conversationId) {
        setMessages(prev => [...prev, message]);
      }

      // Update active conversations for any message
      setActiveConversations(prev =>
        prev.map(conv =>
          conv.conversationId === message.conversationId
            ? {
                ...conv,
                lastMessageContent: message.messageContent,
                lastMessageTime: new Date(message.sentTimeUtc).toLocaleString('vi-VN'),
                isReadByAdmin: message.isReadByAdmin
              }
            : conv
        )
      );
    });

    // Client reconnected
    chatService.on('ClientReconnected', (conversationId, clientUserId) => {
      // console.log('Client reconnected:', conversationId, clientUserId);
      toast.info('Khách hàng đã kết nối lại');
    });

    // Client disconnected
    chatService.on('ClientDisconnected', (conversationId, clientUserId) => {
      // console.log('Client disconnected:', conversationId, clientUserId);
      toast.warning('Khách hàng đã ngắt kết nối');
    });

    // Chat closed
    chatService.on('ChatClosed', (conversationId, message) => {
      // console.log('Chat closed:', conversationId, message);
      setActiveConversations(prev => 
        prev.filter(conv => conv.conversationId !== conversationId)
      );
      if (currentConversation && currentConversation.conversationId === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      toast.info(message);
    });

    // Error handling
    chatService.on('ChatError', (error) => {
      console.error('Chat error:', error);
      toast.error(error);
    });

    chatService.on('ChatInfo', (info) => {
      // console.log('Chat info:', info);
      toast.info(info);
    });

    chatService.on('ReceiveReadReceipt', (conversationId, readerUserId, DateTime) => {
      if (readerUserId !== admin.id) {
        setMessages(prevMessages =>
          prevMessages.map(message =>
            message.conversationId === conversationId &&
            message.senderUserId === admin.id 
              ? { ...message, isReadByClient: true }
              : message
          )
        );
      }

      if (readerUserId === admin.id) {
        setActiveConversations(prev =>
          prev.map(conv =>
            conv.conversationId === conversationId
              ? { ...conv, isReadByAdmin: true }
              : conv
          )
        );
      }
      
      
      // setMessages(prevMessages =>
      //   prevMessages.map(message =>
      //     message.conversationId === conversationId &&
      //     message.senderUserId !== admin.id // Tin nhắn từ client
      //       ? { ...message, isReadByClient: true }
      //       : message
      //   )
      // );
      // // Cập nhật activeConversations để phản ánh trạng thái đọc
      // setActiveConversations(prev =>
      //   prev.map(conv =>
      //     conv.conversationId === conversationId
      //       ? { ...conv, isReadByAdmin: true }
      //       : conv
      //   )
      // );
    });
  };

  const markMessagesAsRead = async (conversationId) => {
    const isAlreadyRead = activeConversations.find(
      conv => conv.conversationId === conversationId
    )?.isReadByAdmin;

    if (isAlreadyRead) {
      // console.log(`Conversation ${conversationId} already marked as read, skipping SignalR invoke`);
      return; 
    }
    try {
      await chatService.invoke('MarkMessagesAsRead', conversationId);
      // console.log(`Successfully invoked MarkMessagesAsRead for conversation: ${conversationId}`);
      
      setActiveConversations(prev =>
        prev.map(conv =>
          conv.conversationId === conversationId
            ? { ...conv, isReadByAdmin: true }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
      toast.error('Không thể đánh dấu tin nhắn là đã đọc');
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAcceptChat = async (conversationId) => {
    try {
      setIsLoading(true);
      await chatService.adminAcceptChat(conversationId);
      
      // Find the conversation to set as current
      const conversation = pendingConversations.find(c => c.conversationId === conversationId);
      if (conversation) {
        setCurrentConversation({
          conversationId: conversationId,
          clientUserName: conversation.clientUserName,
          clientUserId: conversation.clientUserId
        });
        setActiveTab('active');
      }
    } catch (error) {
      console.error('Error accepting chat:', error);
      toast.error('Không thể nhận cuộc hội thoại: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectActiveChat = async (conversation) => {
    try {
      // Clear current messages before loading new ones
      setMessages([]);
      
      setCurrentConversation({
        conversationId: conversation.conversationId,
        clientUserName: conversation.clientUserName,
        clientUserId: conversation.clientUserId
      });
      
      // Request chat history
      await chatService.adminRequestChatHistory(conversation.conversationId);
      
      if (!conversation.isReadByAdmin) {
        await markReadMessage(conversation.conversationId);
        setActiveConversations(prev =>
          prev.map(conv =>
            conv.conversationId === conversation.conversationId
              ? { ...conv, isReadByAdmin: true }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error selecting active chat:', error);
      toast.error('Không thể tải lịch sử chat: ' + error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    try {
      await chatService.sendMessage(currentConversation.conversationId, newMessage);
      setNewMessage('');
      messageInputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn: ' + error.message);
    }
  };

  const handleCloseChat = async () => {
    if (!currentConversation) return;

    try {
      await chatService.adminCloseChat(currentConversation.conversationId);
      setCurrentConversation(null);
      setMessages([]);
    } catch (error) {
      console.error('Error closing chat:', error);
      toast.error('Không thể đóng cuộc hội thoại: ' + error.message);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUnreadCount = () => {
    return pendingConversations.length + 
           activeConversations.filter(conv => !conv.IsReadByAdmin).length;
  };

  if (!isOpen) {
    return (
      <div className="apple-chat-fab">
        <button
          onClick={() => setIsOpen(true)}
          className="apple-chat-fab-button"
        >
          <MessageCircle size={24} />
          {getUnreadCount() > 0 && (
            <span className="apple-chat-badge">
              {getUnreadCount()}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`apple-chat-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="apple-chat-header">
        <div className="apple-chat-header-left">
          <div className="apple-chat-header-icon">
            <MessageCircle size={20} />
          </div>
          <h3 className="apple-chat-title">Messages</h3>
          {getUnreadCount() > 0 && (
            <span className="apple-chat-header-badge">
              {getUnreadCount()}
            </span>
          )}
        </div>
        <div className="apple-chat-header-controls">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="apple-chat-control-btn"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="apple-chat-control-btn close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="apple-chat-body">
          {/* Connection Status */}
          <div className={`apple-chat-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className="apple-chat-status-indicator"></div>
            <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>

          {!currentConversation ? (
            // Conversation List View
            <div className="apple-chat-list-view">
              {/* Tabs */}
              <div className="apple-chat-tabs">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`apple-chat-tab ${activeTab === 'pending' ? 'active' : ''}`}
                >
                  <Clock size={16} />
                  <span>Pending</span>
                  <span className="apple-chat-tab-count">{pendingConversations.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`apple-chat-tab ${activeTab === 'active' ? 'active' : ''}`}
                >
                  <Users size={16} />
                  <span>Active</span>
                  <span className="apple-chat-tab-count">{activeConversations.length}</span>
                </button>
              </div>

              {/* Conversation List */}
              <div className="apple-chat-conversations">
                {activeTab === 'pending' ? (
                  pendingConversations.length === 0 ? (
                    <div className="apple-chat-empty">
                      <Clock size={48} />
                      <p>No pending requests</p>
                    </div>
                  ) : (
                    pendingConversations.map((conversation) => (
                      <div key={conversation.conversationId} className="apple-chat-conversation-card pending">
                        <div className="apple-chat-conversation-header">
                          <div className="apple-chat-conversation-user">
                            <div className="apple-chat-avatar">
                              <User size={16} />
                            </div>
                            <span className="apple-chat-username">
                              {conversation.userName || 'Customer'}
                            </span>
                          </div>
                          <span className="apple-chat-time">
                            {formatTime(conversation.startTimeUtc)}
                          </span>
                        </div>
                        {conversation.initialMessage && (
                          <p className="apple-chat-preview">
                            {conversation.initialMessage}
                          </p>
                        )}
                        <button
                          onClick={() => handleAcceptChat(conversation.conversationId)}
                          disabled={isLoading}
                          className="apple-chat-accept-btn"
                        >
                          {isLoading ? 'Accepting...' : 'Accept Chat'}
                        </button>
                      </div>
                    ))
                  )
                ) : (
                  activeConversations.length === 0 ? (
                    <div className="apple-chat-empty">
                      <Users size={48} />
                      <p>No active conversations</p>
                    </div>
                  ) : (
                    activeConversations.map((conversation) => {
                      
                      const isUnread =  conversation.lastMessageUserId !== admin.id && !conversation.isReadByAdmin ;
                      // console.log('lastMessageAdmin: ', conversation.lastMessageUserId === admin.id);
                      // console.log('isAdminRead:' , conversation.isReadByAdmin);
                      // console.log('isUnread:' , conversation.lastMessageUserId !== admin.id || !conversation.isReadByAdmin);

                      return (
                        <div
                          key={conversation.conversationId}
                          onClick={() => handleSelectActiveChat(conversation)}
                          className={`apple-chat-conversation-card active ${isUnread ? 'unread' : ''}`}
                        >
                          <div className="apple-chat-conversation-header">
                            <div className="apple-chat-conversation-user">
                              <div className="apple-chat-avatar">
                                <User size={16} />
                              </div>
                              <span className="apple-chat-username">
                                {conversation.userName || conversation.clientUserName || 'Customer'}
                              </span>
                              {isUnread && <div className="apple-chat-unread-dot"></div>}
                            </div>
                            <span className="apple-chat-time">{conversation.lastMessageTime}</span>
                          </div>
                          <p className="apple-chat-preview">
                            {conversation.lastMessageContent}
                          </p>
                        </div>
                      );
                    })
                  )
                )}
              </div>
            </div>
          ) : (
            // Chat View
            <div className="apple-chat-view">
              {/* Chat Header */}
              <div className="apple-chat-view-header">
                <div className="apple-chat-view-header-left">
                  <button
                    onClick={() => setCurrentConversation(null)}
                    className="apple-chat-back-btn"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="apple-chat-avatar">
                    <User size={16} />
                  </div>
                  <span className="apple-chat-view-title">
                    {currentConversation.userName|| currentConversation.clientUserName || 'Customer'}
                  </span>
                </div>
                <button
                  onClick={handleCloseChat}
                  className="apple-chat-close-btn"
                >
                  <XCircle size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="apple-chat-messages">
                {messages.map((message, index) => {
                  // Kiểm tra xem đây có phải là tin nhắn cuối cùng trong chuỗi từ admin
                  const isLastInSequence =
                    message.senderUserId === admin.id && // Tin nhắn từ admin
                    (index === messages.length - 1 || // Là tin nhắn cuối cùng trong danh sách
                    messages[index + 1]?.senderUserId !== admin.id || // Tin nhắn tiếp theo không phải từ admin
                    messages[index + 1]?.senderUserId !== message.senderUserId); // Tin nhắn tiếp theo từ người gửi khác

                  return (
                    <div
                      key={index}
                      className={`apple-chat-message ${
                        message.senderUserId === admin.id  ? 'sent' : 'received'
                      }`}
                    >
                      <div className="apple-chat-message-bubble">
                        <p className="apple-chat-message-text">{message.messageContent}</p>
                        <div className="apple-chat-message-footer">
                          <span className="apple-chat-message-time">
                            {formatTime(message.sentTimeUtc)}
                          </span>
                          {isLastInSequence && (
                            <span className={`apple-chat-message-status ${
                              message.isReadByClient ? 'read' : 'unread'
                            }`}>
                              {message.isReadByClient ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="apple-chat-input-form">
                <div className="apple-chat-input-container">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onClick={() => markMessagesAsRead(currentConversation.conversationId)}
                    placeholder="Type a message..."
                    className="apple-chat-input"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="apple-chat-send-btn"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminChatComponent;