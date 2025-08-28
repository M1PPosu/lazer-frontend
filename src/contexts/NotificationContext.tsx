import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import type { APINotification, UnreadCount, User } from '../types';

interface NotificationContextValue {
  unreadCount: UnreadCount;
  notifications: APINotification[];
  isLoading: boolean;
  isConnected: boolean;
  connectionError: string | null;
  markAsRead: (id: number) => Promise<void> | void;
  removeNotification: (id: number) => void;
  removeNotificationByObject: (objectId: string, objectType: string) => Promise<void> | void;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{ isAuthenticated: boolean; user?: User | null; children: ReactNode; }> = ({
  isAuthenticated,
  user,
  children,
}) => {
  const {
    unreadCount,
    notifications,
    isLoading,
    isConnected,
    connectionError,
    markAsRead,
    removeNotification,
    removeNotificationByObject,
    refresh,
  } = useNotifications(isAuthenticated, user);

  return (
    <NotificationContext.Provider value={{
      unreadCount,
      notifications,
      isLoading,
      isConnected,
      connectionError,
      markAsRead,
      removeNotification,
      removeNotificationByObject,
      refresh,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return ctx;
};
