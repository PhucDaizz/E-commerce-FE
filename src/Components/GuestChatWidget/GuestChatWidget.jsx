import React, { useState } from 'react';
import { MessageCircle, X, Facebook, MessageSquare, User } from 'lucide-react';
import './GuestChatWidget.css';

const GuestChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    const facebookUrl = "https://m.me/your-facebook-page";
    const zaloUrl = "https://zalo.me/0373907378";

    const handleSocialClick = (platform, url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsOpen(false); 
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="guest-chat-toggle"
                title="Liên hệ hỗ trợ"
            >
                <MessageCircle className="guest-toggle-icon" />
                <div className="guest-chat-pulse"></div>
            </button>
        );
    }

    return (
        <div className="guest-chat-container">
            {/* Header */}
            <div className="guest-chat-header">
                <div className="guest-header-content">
                    <MessageCircle className="guest-header-icon" />
                    <h3 className="guest-chat-title">Hỗ trợ khách hàng</h3>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="guest-close-btn"
                >
                    <X className="guest-close-icon" />
                </button>
            </div>

            {/* Content */}
            <div className="guest-chat-content">
                <div className="guest-welcome">
                    <div className="guest-avatar">
                        <User className="guest-avatar-icon" />
                    </div>
                    <p className="guest-welcome-text">
                        Xin chào! Chúng tôi sẵn sàng hỗ trợ bạn. 
                        Hãy chọn cách liên hệ thuận tiện nhất:
                    </p>
                </div>

                <div className="guest-social-options">
                    <button
                        onClick={() => handleSocialClick('facebook', facebookUrl)}
                        className="guest-social-btn guest-facebook-btn"
                    >
                        <Facebook className="guest-social-icon" />
                        <div className="guest-social-info">
                            <span className="guest-social-title">Facebook Messenger</span>
                            <span className="guest-social-desc">Nhắn tin qua Facebook</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSocialClick('zalo', zaloUrl)}
                        className="guest-social-btn guest-zalo-btn"
                    >
                        <MessageSquare className="guest-social-icon" />
                        <div className="guest-social-info">
                            <span className="guest-social-title">Zalo</span>
                            <span className="guest-social-desc">Chat qua Zalo</span>
                        </div>
                    </button>
                </div>

                <div className="guest-footer">
                    <p className="guest-footer-text">
                        Hoặc{' '}
                        <a href="/login" className="guest-login-link">
                            đăng nhập
                        </a>{' '}
                        để sử dụng chat trực tiếp
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GuestChatWidget;