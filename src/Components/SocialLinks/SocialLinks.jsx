import React from 'react';
import { Facebook, MessageSquare } from 'lucide-react';
import './SocialLinks.css';

const SocialLinks = ({ variant = 'compact' }) => {
    const facebookUrl = "https://m.me/your-facebook-page"; 
    const zaloUrl = "https://zalo.me/0373907378"; 

    if (variant === 'full') {
        
        return (
            <div className="social-links-full">
                <div className="social-header-full">
                    <h2>Hỗ trợ khách hàng</h2>
                    <p>Liên hệ với chúng tôi qua các kênh sau:</p>
                </div>
                
                <div className="social-buttons-full">
                    <a 
                        href={facebookUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-btn-full facebook-full"
                    >
                        <Facebook className="social-icon-full" />
                        <span>Chat qua Facebook</span>
                    </a>
                    
                    <a 
                        href={zaloUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-btn-full zalo-full"
                    >
                        <MessageSquare className="social-icon-full" />
                        <span>Chat qua Zalo</span>
                    </a>
                </div>
            </div>
        );
    }

    // Dành cho chat compact
    return (
        <div className="social-links-compact">
            <div className="social-header-compact">
                <span>Hoặc liên hệ qua:</span>
            </div>
            <div className="social-buttons-compact">
                <a 
                    href={facebookUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-btn-compact facebook-compact"
                >
                    <Facebook className="social-icon-compact" />
                    <span>Facebook</span>
                </a>
                <a 
                    href={zaloUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-btn-compact zalo-compact"
                >
                    <MessageSquare className="social-icon-compact" />
                    <span>Zalo</span>
                </a>
            </div>
        </div>
    );
};

export default SocialLinks;