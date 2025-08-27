import { useState, useEffect, useCallback } from 'react';
import { notificationsAPI } from '../utils/api';
import { useWebSocketNotifications } from './useWebSocketNotifications';
import type { UnreadCount, APINotification } from '../types';

export const useNotifications = (isAuthenticated: boolean) => {
  const [unreadCount, setUnreadCount] = useState<UnreadCount>({
    total: 0,
    team_requests: 0,
    private_messages: 0,
    friend_requests: 0,
  });
  const [notifications, setNotifications] = useState<APINotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 处理新通知
  const handleNewNotification = useCallback((notification: APINotification) => {
    setNotifications(prev => {
      // 检查通知是否已存在
      const exists = prev.some(n => n.id === notification.id);
      if (exists) {
        return prev;
      }
      return [notification, ...prev];
    });
    
    // 更新未读数量
    setUnreadCount(prev => {
      const newCount = { ...prev };
      
      // 根据通知类型增加相应计数
      switch (notification.name) {
        case 'team_application_store':
        case 'team_application_accept':
        case 'team_application_reject':
          newCount.team_requests++;
          break;
        case 'channel_message':
          newCount.private_messages++;
          break;
        default:
          break;
      }
      
      newCount.total = newCount.team_requests + newCount.private_messages + newCount.friend_requests;
      return newCount;
    });
  }, []);

  // 使用WebSocket连接
  const { isConnected, connectionError } = useWebSocketNotifications({
    isAuthenticated,
    onNewNotification: handleNewNotification,
  });

  // 获取初始通知数据
  const fetchNotifications = useCallback(async (force: boolean = false) => {
    if (!isAuthenticated) {
      setUnreadCount({
        total: 0,
        team_requests: 0,
        private_messages: 0,
        friend_requests: 0,
      });
      setNotifications([]);
      return;
    }

    // 如果不是强制刷新且已有数据，跳过
    if (!force && notifications.length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await notificationsAPI.getNotifications();
      
      setNotifications(response.notifications || []);
      
      // 计算未读数量
      const teamRequestCount = response.notifications.filter(n => 
        ['team_application_store', 'team_application_accept', 'team_application_reject'].includes(n.name) && !n.is_read
      ).length;
      
      const privateMessageCount = response.notifications.filter(n => 
        n.name === 'channel_message' && !n.is_read
      ).length;
      
      const friendRequestCount = 0; // 暂时没有好友请求
      
      setUnreadCount({
        team_requests: teamRequestCount,
        private_messages: privateMessageCount,
        friend_requests: friendRequestCount,
        total: teamRequestCount + privateMessageCount + friendRequestCount,
      });
      
    } catch (error) {
      console.error('获取通知失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // 初始加载
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(true); // 强制刷新初始数据
    }
  }, [isAuthenticated]);

  // 定期刷新（当WebSocket未连接时）
  useEffect(() => {
    if (!isConnected && isAuthenticated) {
      const interval = setInterval(() => fetchNotifications(true), 60000); // 增加到60秒，减少频率
      return () => clearInterval(interval);
    }
  }, [isConnected, isAuthenticated]);

  // 手动刷新
  const refresh = useCallback(() => {
    fetchNotifications(true);
  }, []);

  // 标记通知为已读
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      
      // 更新本地状态
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      
      // 更新未读数量
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification || notification.is_read) return prev;
        
        const newCount = { ...prev };
        
        switch (notification.name) {
          case 'team_application_store':
          case 'team_application_accept':
          case 'team_application_reject':
            newCount.team_requests = Math.max(0, newCount.team_requests - 1);
            break;
          case 'channel_message':
            newCount.private_messages = Math.max(0, newCount.private_messages - 1);
            break;
        }
        
        newCount.total = newCount.team_requests + newCount.private_messages + newCount.friend_requests;
        return newCount;
      });
      
    } catch (error) {
      console.error('标记通知已读失败:', error);
    }
  }, [notifications]);

  // 减少未读数量（当用户查看通知时）
  const decrementCount = useCallback((type?: keyof Omit<UnreadCount, 'total'>, amount: number = 1) => {
    setUnreadCount(prev => {
      const newCount = { ...prev };
      
      if (type && newCount[type] > 0) {
        newCount[type] = Math.max(0, newCount[type] - amount);
      }
      
      // 重新计算总数
      newCount.total = newCount.team_requests + newCount.private_messages + newCount.friend_requests;
      
      return newCount;
    });
  }, []);

  return {
    unreadCount,
    notifications,
    isLoading,
    isConnected,
    connectionError,
    refresh,
    decrementCount,
    markAsRead,
  };
};
