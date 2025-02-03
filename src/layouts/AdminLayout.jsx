import React from 'react';
import './AdminLayout.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import { useAdmin } from '../Context/AdminContext';

const AdminLayout = ({ children }) => {
  const { hideSideBar } = useAdmin();

  return (
    <div className="admin-layout">
      <div className={`shadow-sm sidebar-container ${hideSideBar ? 'collapsed' : ''}`}>
        <Sidebar />
      </div>
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
