import React, { createContext, useContext } from 'react'
import { apiRequest } from '../utils/apiHelper';

const ChatContext = createContext();

export const ChatProvider =({ children }) =>{

    const markReadMessage = async(conversationId) => {
        try {
            const response = await apiRequest({
                method: 'post',
                url: `/api/Conversation/${conversationId}/mark-as-read`
            });
            if(response.status === 200){
                return;
            } 
        } catch (error) {
            console.error('Lỗi đánh dấu tin nhắn:', error);
        }
    }

    return (
        <ChatContext.Provider value={{
            markReadMessage
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
  return useContext(ChatContext);
};
