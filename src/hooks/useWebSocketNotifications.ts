import { useState, useEffect, useRef, useCallback } from 'react';
import { notificationsAPI } from '../utils/api';
import type { 
  SocketMessage, 
  ChatEvent, 
  NotificationEvent, 
  APINotification,
  ChatMessage,
  User
} from '../types';
import { showCustomToast } from '../components/CustomToast';

// 生成唯一通知 ID 的函数
let notificationIdCounter = 0;
const generateUniqueNotificationId = (): number => {
  return Date.now() * 10000 + (++notificationIdCounter % 10000);
};

interface UseWebSocketNotificationsProps {
  isAuthenticated: boolean;
  currentUser?: User | null;
  onNewMessage?: (message: ChatMessage) => void;
  onNewNotification?: (notification: APINotification) => void;
}

export const useWebSocketNotifications = ({
  isAuthenticated,
  currentUser,
  onNewMessage,
  onNewNotification
}: UseWebSocketNotificationsProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelayBase = 1000;
  const endpointCacheRef = useRef<string | null>(null);
  const lastConnectAttemptRef = useRef<number>(0);
  const connectionThrottleMs = 2000; // 2秒内不重复连接

  // 获取WebSocket端点（带缓存）
  const getWebSocketEndpoint = useCallback(async (): Promise<string | null> => {
    if (!isAuthenticated) {
      endpointCacheRef.current = null;
      return null;
    }

    // 如果有缓存且用户仍认证，直接返回
    if (endpointCacheRef.current) {
      return endpointCacheRef.current;
    }

    try {
      const response = await notificationsAPI.getNotifications();
      endpointCacheRef.current = response.notification_endpoint;
      return endpointCacheRef.current;
    } catch (error) {
      console.error('Failed to get notification endpoint:', error);
      return null;
    }
  }, [isAuthenticated]);

  // 发送消息到WebSocket
  const sendMessage = useCallback((message: SocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // 处理WebSocket消息
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: SocketMessage = JSON.parse(event.data);
      console.log('WebSocket收到原始消息:', message);
      
      // 处理各种聊天消息事件
      if (message.event === 'chat.message.new' || 
          message.event === 'new_message' || 
          message.event === 'message') {
        const chatEvent = message as ChatEvent;
        console.log('聊天事件数据:', chatEvent.data);
        
        if (chatEvent.data?.messages) {
          console.log('处理消息数组:', chatEvent.data.messages);
          chatEvent.data.messages.forEach(msg => {
            // 过滤自己的消息
            if (msg.sender_id && currentUser && msg.sender_id === currentUser.id) {
              console.log(`✓ 过滤自己的聊天消息: ${msg.message_id}, 发送者ID: ${msg.sender_id}`);
              return;
            }
            console.log('发送他人消息到回调:', msg);
            onNewMessage?.(msg);
          });
        } else if ((chatEvent.data as any)?.message) {
          // 可能是单个消息而不是数组
          const msg = (chatEvent.data as any).message as ChatMessage;
          // 过滤自己的消息
          if (msg.sender_id && currentUser && msg.sender_id === currentUser.id) {
            console.log(`✓ 过滤自己的单个聊天消息: ${msg.message_id}, 发送者ID: ${msg.sender_id}`);
            return;
          }
          console.log('处理他人单个消息:', msg);
          onNewMessage?.(msg);
        } else if (chatEvent.data && typeof chatEvent.data === 'object') {
          // 可能消息数据直接在data中
          const msg = chatEvent.data as ChatMessage;
          // 过滤自己的消息
          if (msg.sender_id && currentUser && msg.sender_id === currentUser.id) {
            console.log(`✓ 过滤自己的直接消息数据: ${msg.message_id}, 发送者ID: ${msg.sender_id}`);
            return;
          }
          console.log('处理他人直接消息数据:', msg);
          onNewMessage?.(msg);
        }
      }
      // 处理直接的消息格式（服务器直接发送ChatMessage格式的数据）
      else if (message.data && 
               typeof message.data === 'object' && 
               'message_id' in message.data && 
               'channel_id' in message.data && 
               'content' in message.data && 
               'sender_id' in message.data && 
               'timestamp' in message.data) {
        // 服务器直接发送ChatMessage格式的消息
        console.log('处理直接ChatMessage格式:', message.data);
        const chatMessage: ChatMessage = {
          message_id: message.data.message_id as number,
          channel_id: message.data.channel_id as number,
          content: message.data.content as string,
          timestamp: message.data.timestamp as string,
          sender_id: message.data.sender_id as number,
          is_action: (message.data.is_action as boolean) || false,
          sender: message.data.sender as any,
          uuid: message.data.uuid as string | undefined
        };
        
        // 过滤自己的消息
        if (chatMessage.sender_id && currentUser && chatMessage.sender_id === currentUser.id) {
          console.log(`✓ 过滤自己的直接ChatMessage: ${chatMessage.message_id}, 发送者ID: ${chatMessage.sender_id}`);
          return;
        }
        
        onNewMessage?.(chatMessage);
      }
      // 如果消息本身就是ChatMessage格式（没有嵌套在data中）
      else if ('message_id' in message && 
               'channel_id' in message && 
               'content' in message && 
               'sender_id' in message && 
               'timestamp' in message) {
        // 消息直接是ChatMessage格式
        console.log('处理直接消息格式（无嵌套）:', message);
        const chatMessage: ChatMessage = {
          message_id: (message as any).message_id,
          channel_id: (message as any).channel_id,
          content: (message as any).content,
          timestamp: (message as any).timestamp,
          sender_id: (message as any).sender_id,
          is_action: (message as any).is_action || false,
          sender: (message as any).sender,
          uuid: (message as any).uuid
        };
        
        // 过滤自己的消息
        if (chatMessage.sender_id && currentUser && chatMessage.sender_id === currentUser.id) {
          console.log(`✓ 过滤自己的无嵌套消息: ${chatMessage.message_id}, 发送者ID: ${chatMessage.sender_id}`);
          return;
        }
        
        onNewMessage?.(chatMessage);
      }
      
      // 处理新通知
      else if (message.event === 'new_private_notification') {
        const notificationEvent = message as NotificationEvent;
        if (notificationEvent.data) {
          // 检查是否是自己的消息，如果是则不显示通知
          if (notificationEvent.data.source_user_id && currentUser && notificationEvent.data.source_user_id === currentUser.id) {
            console.log(`✓ 过滤自己的私人通知: ${notificationEvent.data.source_user_id}, 当前用户ID: ${currentUser.id}`);
            return;
          }

          const notification: APINotification = {
            id: generateUniqueNotificationId(),
            name: notificationEvent.data.name,
            created_at: new Date().toISOString(),
            object_type: notificationEvent.data.object_type,
            object_id: notificationEvent.data.object_id.toString(),
            source_user_id: notificationEvent.data.source_user_id,
            is_read: false,
            details: notificationEvent.data.details
          };
          
          onNewNotification?.(notification);
          
          // 显示自定义通知提示
          const notificationTitle = getNotificationTitle(notification);
          if (notificationTitle) {
            showCustomToast({
              title: notificationTitle,
              message: '您有新的通知',
              sourceUserId: notification.source_user_id,
              type: 'default'
            });
          }
        }
      }
      
      // 处理新的通知事件（包括私聊通知）
      else if (message.event === 'new') {
        console.log('处理新通知事件:', message);
        
        if (message.data && typeof message.data === 'object') {
          const data = message.data as any;
          
          // 根据频道类型创建相应的通知
          if (data.category === 'channel' && data.name === 'channel_message') {
            const channelType = data.details?.type?.toLowerCase();
            console.log(`检测到频道通知，类型: ${channelType}`, data);
            
            let notificationName = 'channel_message';
            let defaultTitle = '频道消息';
            
            // 根据频道类型设置通知名称和默认标题
            switch (channelType) {
              case 'pm':
                notificationName = 'channel_message';
                defaultTitle = '私聊消息';
                break;
              case 'team':
                notificationName = 'channel_team';
                defaultTitle = '团队消息';
                break;
              case 'public':
                notificationName = 'channel_public';
                defaultTitle = '公共频道';
                break;
              case 'private':
                notificationName = 'channel_private';
                defaultTitle = '私有频道';
                break;
              case 'multiplayer':
                notificationName = 'channel_multiplayer';
                defaultTitle = '多人游戏';
                break;
              case 'spectator':
                notificationName = 'channel_spectator';
                defaultTitle = '观战频道';
                break;
              case 'temporary':
                notificationName = 'channel_temporary';
                defaultTitle = '临时频道';
                break;
              case 'group':
                notificationName = 'channel_group';
                defaultTitle = '群组频道';
                break;
              case 'system':
                notificationName = 'channel_system';
                defaultTitle = '系统频道';
                break;
              case 'announce':
                notificationName = 'channel_announce';
                defaultTitle = '公告频道';
                break;
              default:
                notificationName = 'channel_message';
                defaultTitle = '频道消息';
                break;
            }
            
            const notification: APINotification = {
              id: generateUniqueNotificationId(),
              name: notificationName,
              created_at: data.created_at || new Date().toISOString(),
              object_type: data.object_type || 'channel',
              object_id: data.object_id?.toString() || data.id?.toString(),
              source_user_id: data.source_user_id,
              is_read: data.is_read || false,
              details: {
                type: data.details?.type || channelType || 'unknown',
                title: data.details?.title || defaultTitle,
                cover_url: data.details?.cover_url || ''
              }
            };
            
            console.log(`创建${defaultTitle}通知对象:`, notification, '根据source_user_id判断是不是自己消息 - source_user_id:', notification.source_user_id);
            
            // 检查是否是自己的消息，如果是则不创建通知
            if (notification.source_user_id && currentUser && notification.source_user_id === currentUser.id) {
              console.log(`✓ 在WebSocket层过滤自己的消息通知: ${notification.id}, 发送者ID: ${notification.source_user_id}, 当前用户ID: ${currentUser.id}`);
              return; // 直接返回，不调用 onNewNotification
            }
            
            console.log(`✓ 准备发送他人的消息通知: ${notification.id}`);
            onNewNotification?.(notification);
            
            // 显示自定义通知提示
            const notificationTitle = getNotificationTitle(notification);
            if (notificationTitle) {
              const toastType = channelType === 'pm' ? 'pm' : 
                              channelType === 'team' ? 'team' : 
                              channelType === 'public' ? 'public' : 'default';
              
              let toastMessage = '';
              switch (channelType) {
                case 'pm':
                  // 显示实际的消息内容
                  const messageContent = data.details?.title as string;
                  if (messageContent && messageContent.length > 0 && messageContent !== '来自用户') {
                    // 如果消息被截断，显示提示
                    if (messageContent.length >= 36) {
                      toastMessage = `${messageContent}... (可能有更多内容)`;
                    } else {
                      toastMessage = messageContent;
                    }
                  } else {
                    toastMessage = '发送了一条私聊消息';
                  }
                  break;
                case 'team':
                  const teamMessage = data.details?.title as string;
                  toastMessage = teamMessage || '在团队频道发送了消息';
                  break;
                case 'public':
                  const publicMessage = data.details?.title as string;
                  toastMessage = publicMessage || '在公共频道发送了消息';
                  break;
                default:
                  const generalMessage = data.details?.title as string;
                  toastMessage = generalMessage || '发送了一条消息';
                  break;
              }
              
              showCustomToast({
                title: channelType === 'pm' ? '新私聊消息' : notificationTitle,
                message: toastMessage,
                sourceUserId: notification.source_user_id,
                type: toastType
              });
            }
          }
          // 其他类型的通知
          else {
            console.log('检测到其他类型通知:', data);
            
            const notification: APINotification = {
              id: generateUniqueNotificationId(),
              name: data.name || 'unknown',
              created_at: data.created_at || new Date().toISOString(),
              object_type: data.object_type || 'unknown',
              object_id: data.object_id?.toString() || data.id?.toString(),
              source_user_id: data.source_user_id,
              is_read: data.is_read || false,
              details: data.details || {}
            };
            
            console.log('创建通用通知对象:', notification);
            
            // 检查是否是自己的消息，如果是则不显示通知
            if (notification.source_user_id && currentUser && notification.source_user_id === currentUser.id) {
              console.log(`✓ 过滤自己的通用通知: ${notification.id}, 发送者ID: ${notification.source_user_id}`);
              return;
            }
            
            onNewNotification?.(notification);
            
            // 显示自定义通用通知提示
            const notificationTitle = getNotificationTitle(notification);
            if (notificationTitle) {
              showCustomToast({
                title: notificationTitle,
                message: '您有新的通知',
                sourceUserId: notification.source_user_id,
                type: 'default'
              });
            }
          }
        }
      }
      
      // 处理错误消息
      if (message.error) {
        console.error('WebSocket error:', message.error);
        setConnectionError(message.error);
      }
      
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [onNewMessage, onNewNotification, currentUser]);

  // 获取通知标题
  const getNotificationTitle = (notification: APINotification): string => {
    switch (notification.name) {
      case 'team_application_store':
        return `${notification.details.title} 申请加入团队`;
      case 'team_application_accept':
        return `您的团队申请已被接受`;
      case 'team_application_reject':
        return `您的团队申请已被拒绝`;
      case 'channel_message':
        // 根据类型显示不同的标题
        if (notification.details?.type === 'pm') {
          return `新私聊消息: ${notification.details.title || '来自用户'}`;
        } else if (notification.details?.type === 'team') {
          return `新团队消息: ${notification.details.title || '团队频道'}`;
        }
        return `新私聊消息`;
      case 'channel_team':
        return `新团队消息: ${notification.details?.title || '团队频道'}`;
      case 'channel_public':
        return `新公共频道消息: ${notification.details?.title || '公共频道'}`;
      case 'channel_private':
        return `新私有频道消息: ${notification.details?.title || '私有频道'}`;
      case 'channel_multiplayer':
        return `新多人游戏消息: ${notification.details?.title || '多人游戏'}`;
      case 'channel_spectator':
        return `新观战频道消息: ${notification.details?.title || '观战频道'}`;
      case 'channel_temporary':
        return `新临时频道消息: ${notification.details?.title || '临时频道'}`;
      case 'channel_group':
        return `新群组消息: ${notification.details?.title || '群组频道'}`;
      case 'channel_system':
        return `新系统消息: ${notification.details?.title || '系统频道'}`;
      case 'channel_announce':
        return `新公告: ${notification.details?.title || '公告频道'}`;
      default:
        // 尝试从details中获取更有意义的标题
        if (notification.details?.title) {
          return `新通知: ${notification.details.title}`;
        }
        return '新通知';
    }
  };

  // WebSocket连接
  const connect = useCallback(async () => {
    if (!isAuthenticated) return;

    // 节流机制：避免频繁连接
    const now = Date.now();
    if (now - lastConnectAttemptRef.current < connectionThrottleMs) {
      console.log('连接请求过于频繁，已跳过');
      return;
    }
    lastConnectAttemptRef.current = now;

    // 如果已经连接，跳过
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const endpoint = await getWebSocketEndpoint();
    if (!endpoint) {
      setConnectionError('Failed to get WebSocket endpoint');
      return;
    }

    try {
      setConnectionError(null);
      
      // 构建WebSocket URL，添加认证参数
      const token = localStorage.getItem('access_token');
      if (!token) {
        setConnectionError('No access token available');
        return;
      }

      // 确保endpoint是完整的WebSocket URL
      let wsUrl: string;
      if (endpoint.startsWith('ws://') || endpoint.startsWith('wss://')) {
        wsUrl = `${endpoint}?access_token=${encodeURIComponent(token)}`;
      } else {
        // 如果是相对路径，构建完整的WebSocket URL
        const baseUrl = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = window.location.host;
        wsUrl = `${baseUrl}${host}${endpoint}?access_token=${encodeURIComponent(token)}`;
      }
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        
        // 发送启动消息
        ws.send(JSON.stringify({
          event: 'chat.start'
        }));
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        
        // 自动重连
        if (isAuthenticated && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = reconnectDelayBase * Math.pow(2, reconnectAttemptsRef.current);
          reconnectAttemptsRef.current++;
          
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setConnectionError('Connection lost and max reconnect attempts reached');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.log('WebSocket URL:', wsUrl);
        console.log('Endpoint:', endpoint);
        setConnectionError(`WebSocket connection error: ${endpoint}`);
      };

      wsRef.current = ws;
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to create WebSocket connection');
    }
  }, [isAuthenticated, getWebSocketEndpoint, handleMessage]);

  // 断开连接
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      // 发送结束消息
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          event: 'chat.end'
        }));
      }
      
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionError(null);
    reconnectAttemptsRef.current = 0;
    
    // 清理缓存
    endpointCacheRef.current = null;
    lastConnectAttemptRef.current = 0;
  }, []);

  // 管理连接状态
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
    
    return () => {
      disconnect();
    };
  }, [isAuthenticated]); // 移除connect和disconnect依赖，避免循环重连

  // 页面可见性变化时重连
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && !isConnected) {
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, isConnected, connect]);

  return {
    isConnected,
    connectionError,
    sendMessage,
    reconnect: connect
  };
};
