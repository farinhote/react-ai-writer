import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard</h1>
        <button 
          onClick={logout} 
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>
      
      <div>
        <h2>Welcome, {user?.name || 'User'}!</h2>
        <p>You have successfully logged in.</p>
        <p>This is a blank dashboard page ready for your content.</p>
      </div>
    </div>
  );
};

export default Dashboard;
