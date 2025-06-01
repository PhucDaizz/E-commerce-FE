import React, { useEffect, useRef, useState, useCallback } from 'react'
import { chatService } from '../../Services/ChatService';
import { Send, MessageCircle, X, User, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import './UserChat.css'
import { toast } from 'react-toastify';

const UserChat = ({ user, token }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const [chatStatus, setChatStatus] = useState('disconnected'); // disconnected, connecting, connected, no_conversation, pending, active, closed, error
    const [adminInfo, setAdminInfo] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const messagesEndRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const eventListenersRegistered = useRef(false);
    
    const currentConversationId = useRef(null);

    useEffect(()=> {
        console.log(user);
    },[])

    useEffect(() => {
        currentConversationId.current = conversationId;
        console.log('ConversationId updated:', conversationId);
    }, [conversationId]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Initialize chat connection when opening
    useEffect(() => {
        if (isOpen && !chatService.isConnectionActive() && token && !isConnecting) {
            initializeChat();
        }
        
        // // Cleanup on unmount
        // return () => {
        //     if (reconnectTimeoutRef.current) {
        //         clearTimeout(reconnectTimeoutRef.current);
        //     }
        //     removeEventListeners();
        // };
    }, [isOpen, token]);

    // Auto-reconnect on connection loss
    useEffect(() => {
        if (isOpen && chatStatus === 'error' && !isConnecting) {
            reconnectTimeoutRef.current = setTimeout(() => {
                console.log('Attempting auto-reconnect...');
                initializeChat();
            }, 5000);
        }
        
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [chatStatus, isOpen, isConnecting]);

    const initializeChat = async () => {
        if (isConnecting) return;
        
        try {
            setIsConnecting(true);
            setChatStatus('connecting');
            setConnectionError(null);

            await chatService.startConnection(token);
            
            if (!eventListenersRegistered.current) {
                setupEventListeners();
                eventListenersRegistered.current = true;
            }
            
            setChatStatus('connected');
            console.log('Chat initialized successfully');
            
        } catch (error) {
            console.error('Failed to connect to chat:', error);
            setConnectionError(error.message);
            toast.error('Không thể kết nối đến chat. Đang thử kết nối lại...');
            setChatStatus('error');
        } finally {
            setIsConnecting(false);
        }
    };

    const playNotificationSound = () => {
        const audio = new Audio('/sounds/notification.mp3')
        audio.play().catch((error) => {
            console.log("Không thể phát âm thanh:", error);
        });
    };

    const setupEventListeners = () => {
        console.log('Setting up event listeners...');

        // Connection events
        chatService.on('ConnectionReconnecting', () => {
            setChatStatus('connecting');
            toast.info('Đang kết nối lại...');
        });

        chatService.on('ConnectionReconnected', () => {
            setChatStatus('connected');
            toast.success('Đã kết nối lại thành công');
            setConnectionError(null);
        });

        chatService.on('ConnectionError', (error) => {
            setConnectionError(error);
            setChatStatus('error');
        });

        chatService.on('ConnectionClosed', (error) => {
            setChatStatus('disconnected');
            if (error && isOpen) {
                toast.warning('Kết nối bị ngắt. Đang thử kết nối lại...');
            }
        });

        // Chat events
        chatService.on('LoadChatHistory', (convId, history) => {
            console.log('Loading chat history:', convId, history);
            setConversationId(convId);
            // Đảm bảo history là array và có dữ liệu đúng format
            const historyArray = Array.isArray(history) ? history : [];
            console.log('Processed history:', historyArray);
            setMessages(historyArray);
            setChatStatus('active');
        });

        chatService.on('ChatRequestSent', (convId) => {
            console.log('Chat request sent:', convId);
            setConversationId(convId);
            setChatStatus('pending');
            toast.info('Yêu cầu chat đã được gửi, vui lòng chờ admin phản hồi');
        });

        chatService.on('AdminJoined', (convId, adminName, adminId) => {
            console.log('Admin joined:', convId, adminName, adminId);
            // Sử dụng ref để kiểm tra conversationId hiện tại
            if (convId === currentConversationId.current || !currentConversationId.current) {
                setAdminInfo({ name: adminName, id: adminId });
                setConversationId(convId);
                setChatStatus('active');
                toast.success(`${adminName} đã tham gia cuộc trò chuyện`);
            }
        });

        chatService.on('ChatStillPending', (convId) => {
            console.log('Chat still pending:', convId);
            setConversationId(convId);
            setChatStatus('pending');
            toast.info('Yêu cầu chat của bạn vẫn đang chờ xử lý');
        });

        chatService.on('NoActiveOrPendingConversationFound', () => {
            console.log('NoActiveOrPendingConversationFound conversationId: ', currentConversationId.current);
            console.log('No active or pending conversation found');
            setChatStatus('no_conversation');
            setConversationId(null);
            setMessages([]);
            setAdminInfo(null);
        });

        chatService.on('ReceiveMessage', (message) => {
            console.log('Received message:', message);
            // Kiểm tra message có đầy đủ thông tin không
            if (message) {
                if(message.senderUserId !== user.id){
                    playNotificationSound();
                }
                setMessages(prev => {
                    const newMessages = [...prev, message];
                    console.log('Updated messages:', newMessages);
                    return newMessages;
                });
            } else {
                console.log('Message rejected - invalid message');
            }
        });

        chatService.on('ChatClosed', (convId, reason) => {
            console.log('=== ChatClosed Event ===');
            console.log('Server convId:', convId);
            console.log('Current conversationId (state):', conversationId);
            console.log('Current conversationId (ref):', currentConversationId.current);
            console.log('Reason:', reason);
            
            // Sử dụng nhiều điều kiện để đảm bảo xử lý đúng
            const shouldCleanup = convId === currentConversationId.current || 
                                  convId === conversationId || 
                                  (!convId && currentConversationId.current) || 
                                  (!convId && conversationId);
                                  
            console.log('Should cleanup:', shouldCleanup);
            
            if (shouldCleanup) {
                console.log('Cleaning up chat state...');
                toast.info(reason || 'Cuộc trò chuyện đã được đóng bởi Admin.');
                
                // Dọn dẹp state của cuộc trò chuyện cũ
                setMessages([]); // Xóa hết tin nhắn cũ
                setAdminInfo(null); // Xóa thông tin admin
                setConversationId(null); // Quan trọng: reset conversationId
                currentConversationId.current = null; // Reset ref
                
                if (chatService.isConnectionActive()) {
                    setChatStatus('no_conversation');
                } else {
                    setChatStatus('disconnected'); 
                }
            } else {
                console.log('ChatClosed event ignored - conversation ID mismatch');
            }
        });

        chatService.on('ChatError', (error) => {
            console.error('Chat error:', error);
            toast.error(error);
        });

        chatService.on('ChatInfo', (info) => {
            console.log('Chat info:', info);
            toast.info(info);
        });
    };

    const removeEventListeners = () => {
        if (!eventListenersRegistered.current) return;
        
        console.log('Removing event listeners...');
        
        // Connection events
        chatService.off('ConnectionReconnecting');
        chatService.off('ConnectionReconnected');
        chatService.off('ConnectionError');
        chatService.off('ConnectionClosed');
        
        // Chat events
        chatService.off('LoadChatHistory');
        chatService.off('ChatRequestSent');
        chatService.off('AdminJoined');
        chatService.off('ChatStillPending');
        chatService.off('NoActiveOrPendingConversationFound');
        chatService.off('ReceiveMessage');
        chatService.off('ChatClosed');
        chatService.off('ChatError');
        chatService.off('ChatInfo');
        
        eventListenersRegistered.current = false;
    };

    const cleanupChatState = useCallback(() => {
        console.log('Manual cleanup of chat state');
        setMessages([]);
        setAdminInfo(null);
        setConversationId(null);
        currentConversationId.current = null;
        setChatStatus(chatService.isConnectionActive() ? 'no_conversation' : 'disconnected');
    }, []);

    const startNewChat = async () => {
        if (!messageInput.trim()) {
            toast.warning('Vui lòng nhập tin nhắn để bắt đầu chat');
            return;
        }

        if (!chatService.isConnectionActive()) {
            toast.error('Không có kết nối. Vui lòng thử lại sau');
            return;
        }

        const tempClientMessage = {
            // id: undefined, 
            // conversationId: undefined, 
            senderUserId: user?.id,
            senderName: user?.userName || "Bạn",
            messageContent: messageInput.trim(),
            sentTimeUtc: new Date().toISOString(),
        };

        try {
            setMessages(prevMessages => [...prevMessages, tempClientMessage]);
            await chatService.clientRequestChat(messageInput.trim());
            setMessageInput('');
        } catch (error) {
            console.error('Failed to start chat:', error);
            toast.error('Không thể bắt đầu chat: ' + error.message);
        }
    };

    const sendMessage = async () => {
        const currentConvId = currentConversationId.current || conversationId;
        
        if (!messageInput.trim() || !currentConvId) {
            console.warn('Cannot send message - missing content or conversation ID');
            return;
        }

        if (!chatService.isConnectionActive()) {
            toast.error('Không có kết nối. Vui lòng thử lại sau');
            return;
        }

        try {
            await chatService.sendMessage(currentConvId, messageInput.trim());
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Không thể gửi tin nhắn: ' + error.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (chatStatus === 'no_conversation' || chatStatus === 'connected') {
                startNewChat();
            } else if (chatStatus === 'active') {
                sendMessage();
            }
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const renderConnectionStatus = () => {
        if (chatStatus === 'connecting' || isConnecting) {
            return (
                <div className="apple-status-bar apple-status-connecting">
                    <div className="apple-status-content">
                        <div className="apple-spinner"></div>
                        <span>Đang kết nối...</span>
                    </div>
                </div>
            );
        }

        if (chatStatus === 'error') {
            return (
                <div className="apple-status-bar apple-status-error">
                    <div className="apple-status-content">
                        <WifiOff className="apple-status-icon" />
                        <span>Lỗi kết nối</span>
                    </div>
                    <button
                        onClick={() => initializeChat()}
                        className="apple-retry-btn"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        if (chatService.isConnectionActive()) {
            return (
                <div className="apple-status-bar apple-status-connected">
                    <div className="apple-status-content">
                        <Wifi className="apple-status-icon" />
                        <span>Đã kết nối</span>
                        {/* <span className="apple-debug-info">
                            (ID: {conversationId ? conversationId.toString().substring(0, 8) + '...' : 'none'})
                        </span> */}
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderChatStatus = () => {
        switch (chatStatus) {
            case 'pending':
                return (
                    <div className="apple-chat-status apple-chat-pending">
                        <Clock className="apple-status-icon apple-pulse" />
                        <span>Đang chờ admin phản hồi...</span>
                    </div>
                );
            case 'active':
                return adminInfo && (
                    <div className="apple-chat-status apple-chat-active">
                        <div className="apple-admin-info">
                            <User className="apple-status-icon" />
                            <span>Đang trò chuyện với {adminInfo.name}</span>
                        </div>
                        {/* <button
                            onClick={cleanupChatState}
                            className="apple-reset-btn"
                            title="Dọn dẹp chat (Debug)"
                        >
                            Reset
                        </button> */}
                    </div>
                );
            case 'closed':
                return (
                    <div className="apple-chat-status apple-chat-closed">
                        <X className="apple-status-icon" />
                        <span>Cuộc trò chuyện đã kết thúc</span>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderMessages = () => {
        if (!messages || messages.length === 0) {
            return (
                <div className="apple-empty-state">
                    <div className="apple-empty-content">
                        <MessageCircle className="apple-empty-icon" />
                        <p className="apple-empty-text">
                            {chatStatus === 'no_conversation' || chatStatus === 'connected' 
                                ? 'Nhập tin nhắn để bắt đầu chat' 
                                : 'Chưa có tin nhắn nào'}
                        </p>
                        <p className="apple-debug-status">
                            Status: {chatStatus} | ConvID: {conversationId ? 'Set' : 'None'}
                        </p>
                    </div>
                </div>
            );
        }

        return messages.map((message, index) => {
            console.log('Rendering message:', message, 'User ID:', user?.id);
            
            // Kiểm tra xem tin nhắn có phải của user hiện tại không
            const isOwnMessage = message.senderUserId === user?.id;
            
            return (
                <div
                    key={`${message.conversationId || 'no-conv'}-${message.id || index}-${index}`}
                    className={`apple-message-wrapper ${isOwnMessage ? 'apple-message-own' : 'apple-message-other'}`}
                >
                    <div className={`apple-message-bubble ${isOwnMessage ? 'apple-bubble-own' : 'apple-bubble-other'}`}>
                        <div className="apple-message-content">
                            {message.messageContent}
                        </div>
                        <div className="apple-message-meta">
                            {message.senderName && !isOwnMessage && (
                                <span className="apple-sender-name">{message.senderName}</span>
                            )}
                            <span className="apple-message-time">
                                {formatTime(message.sentTimeUtc)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        });
    };

    const canSendMessage = () => {
        return chatService.isConnectionActive() && 
               (chatStatus === 'active' || chatStatus === 'no_conversation' || chatStatus === 'connected');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="apple-chat-toggle"
            >
                <MessageCircle className="apple-toggle-icon" />
                {chatStatus === 'error' && (
                    <div className="apple-error-indicator"></div>
                )}
            </button>
        );
    }

    return (
        <div className="apple-chat-container">
            {/* Header */}
            <div className="apple-chat-header">
                <h3 className="apple-chat-title">Chat hỗ trợ</h3>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="apple-close-btn"
                >
                    <X className="apple-close-icon" />
                </button>
            </div>

            {/* Connection Status */}
            {renderConnectionStatus()}

            {/* Chat Status */}
            {renderChatStatus()}

            {/* Messages */}
            <div className="apple-messages-container">
                {renderMessages()}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {canSendMessage() && (
                <div className="apple-input-container">
                    <div className="apple-input-wrapper">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                                chatStatus === 'no_conversation' || chatStatus === 'connected'
                                    ? "Nhập tin nhắn để bắt đầu chat..."
                                    : "Nhập tin nhắn..."
                            }
                            className="apple-message-input"
                            disabled={!chatService.isConnectionActive()}
                        />
                        <button
                            onClick={
                                chatStatus === 'no_conversation' || chatStatus === 'connected'
                                    ? startNewChat
                                    : sendMessage
                            }
                            disabled={!chatService.isConnectionActive() || !messageInput.trim()}
                            className="apple-send-btn"
                        >
                            <Send className="apple-send-icon" />
                        </button>
                    </div>
                </div>
            )}

            {/* Reconnect Button for Error State */}
            {chatStatus === 'error' && !canSendMessage() && (
                <div className="apple-error-container">
                    <button
                        onClick={() => initializeChat()}
                        disabled={isConnecting}
                        className="apple-reconnect-btn"
                    >
                        {isConnecting ? (
                            <>
                                <div className="apple-spinner-small"></div>
                                Đang kết nối...
                            </>
                        ) : (
                            <>
                                <AlertCircle className="apple-alert-icon" />
                                Kết nối lại
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserChat;