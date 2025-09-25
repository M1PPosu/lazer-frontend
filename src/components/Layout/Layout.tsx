import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { NotificationProvider } from '../../contexts/NotificationContext';

const Layout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <NotificationProvider isAuthenticated={isAuthenticated} user={user}>
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <main className="pt-[56px] md:pt-16">
          <Outlet />
        </main>
        <Toaster
        position="top-right"
        containerStyle={{
          top: '80px', // It is displayed below the top bar, the height of the top bar is approximately64px, leave some spacing
          right: '16px', // Leave some margins on the right
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#ED8EA6',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
      </div>
    </NotificationProvider>
  );
};

export default Layout;