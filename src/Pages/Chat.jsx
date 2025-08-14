import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Context/AuthContext';
import AdminChatComponent from '../Components/AdminChat/AdminChat';
import UserChat from '../Components/UserChat/UserChat';

const Chat = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth();
// console.log('Auth State in ChatExample:', { isLoading, isAuthenticated, user, token });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {user.isAdmin ? (
        <AdminChatComponent admin={user} token={token} />
      ) : (
        <UserChat user={user} token={token}/>
      )}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Chat;