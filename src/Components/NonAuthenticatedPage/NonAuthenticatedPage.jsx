// Components/NonAuthenticatedPage/NonAuthenticatedPage.js
import React from 'react';
import { MessageCircle } from 'lucide-react';
import SocialLinks from '../SocialLinks/SocialLinks';
import './NonAuthenticatedPage.css';

const NonAuthenticatedPage = () => {
    return (
        <div className="non-auth-container">
            <div className="non-auth-card">
                <div className="non-auth-icon">
                    <MessageCircle className="message-icon" />
                </div>
                
                <SocialLinks variant="full" />
                
                <div className="non-auth-footer">
                    <p>
                        Bạn cũng có thể{' '}
                        <a href="/login" className="login-link">
                            đăng nhập
                        </a>{' '}
                        để sử dụng chat trực tiếp
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NonAuthenticatedPage;