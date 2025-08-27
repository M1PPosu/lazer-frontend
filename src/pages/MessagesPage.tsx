import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageCircle, 
  FiBell, 
  FiChevronLeft,
  FiMoreHorizontal,
  FiX,
  FiCheck,
  FiUserPlus,
  FiPlus,
  FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useWebSocketNotifications } from '../hooks/useWebSocketNotifications';
import { chatAPI, teamsAPI, userAPI } from '../utils/api';

import MessageBubble from '../components/Chat/MessageBubble';
import ChannelItem from '../components/Chat/ChannelItem';
import MessageInput from '../components/Chat/MessageInput';
import PrivateMessageModal from '../components/Chat/PrivateMessageModal';
import FriendsList from '../components/Chat/FriendsList';
import type { 
  ChatChannel, 
  ChatMessage, 
  APINotification,
  User
} from '../types';
import toast from 'react-hot-toast';

// UTC时间转换为本地时间
const convertUTCToLocal = (utcTimeString: string): string => {
  try {
    const utcDate = new Date(utcTimeString);
    return utcDate.toISOString(); // 这会自动转换为本地时区显示
  } catch (error) {
    console.error('时间转换错误:', error);
    return utcTimeString;
  }
};

type ActiveTab = 'channels' | 'notifications';
type ChannelFilter = 'all' | 'private' | 'team' | 'public';

const MessagesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('channels');
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNewPMModal, setShowNewPMModal] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  
  // 用户信息缓存
  const [userInfoCache, setUserInfoCache] = useState<Map<number, any>>(new Map());

  // 调试好友列表状态
  useEffect(() => {
    console.log('好友列表状态变化:', showFriendsList);
  }, [showFriendsList]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedChannelRef = useRef<ChatChannel | null>(null);

  // 更新频道已读状态
  const updateChannelReadStatus = useCallback((channelId: number, messageId: number) => {
    setChannels(prev => prev.map(channel => {
      if (channel.channel_id === channelId) {
        // 更新已读ID，确保它不小于当前消息ID
        const newLastReadId = Math.max(channel.last_read_id || 0, messageId);
        console.log(`更新频道 ${channel.name} 已读ID: ${channel.last_read_id} -> ${newLastReadId}`);
        return {
          ...channel,
          last_read_id: newLastReadId
        };
      }
      return channel;
    }));
  }, []);

  // 使用通知系统
  const { 
    notifications, 
    unreadCount, 
    isConnected: notificationConnected,
    markAsRead,
    refresh,
    removeNotificationByObject
  } = useNotifications(isAuthenticated, user);

        // 使用WebSocket处理实时消息
      const { isConnected: chatConnected } = useWebSocketNotifications({
        isAuthenticated,
        currentUser: user,
        onNewMessage: (message) => {
          // 过滤自己的消息，不显示推送
          if (message.sender_id === user?.id) {
            console.log('收到自己的消息，跳过处理:', message.message_id);
            return;
          }
          
          console.log('WebSocket收到消息:', {
            messageId: message.message_id,
            channelId: message.channel_id,
            senderId: message.sender_id,
            content: message.content.substring(0, 50),
            selectedChannelId: selectedChannelRef.current?.channel_id,
            selectedChannelName: selectedChannelRef.current?.name
          });
      
      // messageWithLocalTime变量在此处不再使用，因为我们直接传递原始message给addMessageToList
      
      // 检查是否应该添加到当前频道（使用ref确保获取最新状态）
      const currentSelectedChannel = selectedChannelRef.current;
      const shouldAddToCurrentChannel = currentSelectedChannel && message.channel_id === currentSelectedChannel.channel_id;
      
      if (shouldAddToCurrentChannel) {
        console.log('添加消息到当前频道，当前列表长度:', messages.length);
        addMessageToList(message, 'websocket');
      } else if (currentSelectedChannel) {
        console.log('消息不属于当前频道，当前频道:', currentSelectedChannel.channel_id, '消息频道:', message.channel_id);
      } else {
        console.log('没有选中的频道，尝试找到对应频道并自动选择');
        console.log('当前频道列表长度:', channels.length);
        console.log('目标频道ID:', message.channel_id);
        console.log('频道列表:', channels.map(ch => ({id: ch.channel_id, name: ch.name})));
        
        // 如果没有选中频道，尝试找到对应的频道并自动选择
        const targetChannel = channels.find(ch => ch.channel_id === message.channel_id);
        if (targetChannel) {
          console.log('找到对应频道，自动选择:', targetChannel.name);
          
          // 调用selectChannel来加载历史消息和设置频道
          // 在加载完成后再添加新消息
          selectChannelAndAddMessage(targetChannel, message);
        } else {
          console.log('未找到对应频道，频道ID:', message.channel_id);
          
          // 如果没找到频道，可能是频道列表还没加载完，尝试重新加载频道列表
          if (channels.length === 0) {
            console.log('频道列表为空，尝试重新加载频道');
            chatAPI.getChannels().then(channelsData => {
              console.log('重新加载频道完成，频道数量:', channelsData?.length || 0);
              if (channelsData) {
                setChannels(channelsData);
                const retryChannel = channelsData.find((ch: ChatChannel) => ch.channel_id === message.channel_id);
                if (retryChannel) {
                  console.log('重新加载后找到频道，自动选择:', retryChannel.name);
                  // 调用selectChannelAndAddMessage来处理频道选择和消息添加
                  selectChannelAndAddMessage(retryChannel, message);
                }
              }
            }).catch(error => {
              console.error('重新加载频道失败:', error);
            });
          }
        }
      }
    },
  });

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 自动滚动到最新消息
  useEffect(() => {
    console.log('消息列表更新，当前消息数量:', messages.length);
    messages.forEach((msg, index) => {
      console.log(`消息${index + 1}:`, msg.message_id, msg.content.substring(0, 20));
    });
    
    // 延迟滚动，确保DOM更新完成
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      
      // 滚动完成后，标记所有可见消息为已读
      if (messages.length > 0 && selectedChannelRef.current) {
        const lastMessage = messages[messages.length - 1];
        const currentChannel = selectedChannelRef.current;
        
        // 只有当最后一条消息的ID大于当前已读ID时才更新
        if (lastMessage.message_id > (currentChannel.last_read_id || 0)) {
          console.log(`滚动完成后标记已读: ${lastMessage.message_id}`);
          throttledMarkAsRead(currentChannel.channel_id, lastMessage.message_id);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages, updateChannelReadStatus]);

  // 加载频道数据
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadChannels = async () => {
      try {
        setIsLoading(true);
        console.log('开始加载频道列表');
        const channelsData = await chatAPI.getChannels().catch(() => []);
        console.log('原始频道数据:', channelsData);
        
        // 检查私聊频道
        const pmChannels = (channelsData || []).filter((ch: ChatChannel) => ch.type === 'PM');
        console.log('私聊频道数量:', pmChannels.length);
        if (pmChannels.length > 0) {
          console.log('私聊频道详情:', pmChannels.map((ch: ChatChannel) => ({ 
            id: ch.channel_id, 
            name: ch.name, 
            type: ch.type,
            users: ch.users 
          })));
        }
        
        // 为私聊频道获取用户信息
        const channelsWithUserInfo = await Promise.all(
          (channelsData || []).map(async (channel: ChatChannel) => {
            if (channel.type === 'PM' && channel.users.length > 0) {
              try {
                // 获取私聊对象的用户ID
                const targetUserId = channel.users.find(id => id !== user?.id);
                if (targetUserId) {
                  console.log('为私聊频道获取用户信息:', targetUserId);
                  
                  // 检查缓存
                  let userInfo = userInfoCache.get(targetUserId);
                  if (!userInfo) {
                    userInfo = await userAPI.getUser(targetUserId);
                    // 更新缓存
                    setUserInfoCache(prev => new Map(prev.set(targetUserId, userInfo)));
                  }
                  
                  return {
                    ...channel,
                    name: `私聊: ${userInfo.username}`,
                    user_info: {
                      id: userInfo.id,
                      username: userInfo.username,
                      avatar_url: userInfo.avatar_url || userAPI.getAvatarUrl(userInfo.id),
                      cover_url: userInfo.cover_url || userInfo.cover?.url || ''
                    }
                  };
                }
              } catch (error) {
                console.error('获取用户信息失败:', error);
              }
            }
            return channel;
          })
        );
        
        // 过滤并排序频道：倒序排列，频道在前，最下面是第一个
        const sortedChannels = channelsWithUserInfo.sort((a: ChatChannel, b: ChatChannel) => {
          // 优先级：公共频道 > 私聊 > 团队 > 私有
          const typeOrder: Record<string, number> = { 'PUBLIC': 0, 'PM': 1, 'TEAM': 2, 'PRIVATE': 3 };
          const aOrder = typeOrder[a.type] || 4;
          const bOrder = typeOrder[b.type] || 4;
          
          if (aOrder !== bOrder) {
            // 倒序排列：较大的 order 值在前
            return bOrder - aOrder;
          }
          
          // 同类型内按名称倒序排列
          return b.name.localeCompare(a.name);
        });
        
        console.log('排序后的频道列表:', sortedChannels.map((ch: ChatChannel) => ({ id: ch.channel_id, name: ch.name, type: ch.type })));
        setChannels(sortedChannels);
        
        // 清理重复的私聊频道
        setTimeout(() => {
          cleanupDuplicatePrivateChannels();
        }, 100);
        
        // 如果没有选中频道且有可用频道，优先选择 osu! 频道
        if (!selectedChannel && sortedChannels.length > 0) {
          // 查找 osu! 频道
          const osuChannel = sortedChannels.find(ch => 
            ch.name.toLowerCase().includes('osu') || 
            ch.name.toLowerCase().includes('#osu') ||
            ch.name === 'osu!'
          );
          
          const channelToSelect = osuChannel || sortedChannels[0];
          console.log('自动选择频道:', channelToSelect.name, '类型:', channelToSelect.type);
          selectChannel(channelToSelect);
        }
      } catch (error) {
        console.error('加载频道失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChannels();
  }, [isAuthenticated]);

  // 同步selectedChannel状态到ref
  useEffect(() => {
    selectedChannelRef.current = selectedChannel;
    console.log('同步选中频道到ref:', selectedChannel?.name || 'null');
  }, [selectedChannel]);

  // 监听通知变化，处理私聊通知
  useEffect(() => {
    if (notifications.length > 0) {
      console.log('检测到新通知，数量:', notifications.length);
      
      // 使用 object_id 进行分组去重
      const processedObjectIds = new Set<string>();
      
      // 处理所有私聊通知，按 object_id 去重
      notifications.forEach(notification => {
        if (notification.name === 'channel_message' && 
            notification.details?.type === 'pm') {
          
          const objectKey = `${notification.object_type}-${notification.object_id}`;
          
          if (!processedObjectIds.has(objectKey)) {
            console.log('处理私聊通知:', notification.id, objectKey, notification.details.title);
            processedObjectIds.add(objectKey);
            handlePrivateMessageNotification(notification);
          } else {
            console.log('跳过重复的通知对象:', objectKey);
          }
        }
      });
    }
  }, [notifications, channels, user?.id]);

  // 清理定时器
  useEffect(() => {
    return () => {
      // 组件卸载时清理所有回退定时器
      const fallbackTimers = (window as any).messageFallbackTimers;
      if (fallbackTimers) {
        fallbackTimers.forEach((timer: NodeJS.Timeout) => clearTimeout(timer));
        fallbackTimers.clear();
      }
    };
  }, []);

  // 过滤频道
  const filteredChannels = channels.filter(channel => {
    switch (channelFilter) {
      case 'private':
        return channel.type === 'PM';
      case 'team':
        return channel.type === 'TEAM';
      case 'public':
        return channel.type === 'PUBLIC';
      default:
        return true;
    }
  });

  // 选择频道，加载消息，并添加新消息
  const selectChannelAndAddMessage = async (channel: ChatChannel, newMessage: ChatMessage) => {
    console.log('选择频道并添加消息:', channel.name, '频道ID:', channel.channel_id);
    setSelectedChannel(channel);
    selectedChannelRef.current = channel;
    setMessages([]);
    
    if (isMobile) {
      setShowSidebar(false);
    }

    try {
      console.log('开始加载频道历史消息');
      const channelMessages = await chatAPI.getChannelMessages(channel.channel_id);
      console.log('频道历史消息加载完成:', channelMessages?.length || 0, '条');
      
      if (channelMessages && channelMessages.length > 0) {
        // 转换所有历史消息的时间戳
        const messagesWithLocalTime = channelMessages.map((msg: ChatMessage) => ({
          ...msg,
          timestamp: convertUTCToLocal(msg.timestamp)
        }));
        
        // 检查新消息是否已经在历史消息中
        const messageExists = messagesWithLocalTime.find((m: ChatMessage) => m.message_id === newMessage.message_id);
        
        // 设置消息列表（包含新消息）
        if (messageExists) {
          console.log('新消息已在历史消息中，只设置历史消息');
          setMessages(messagesWithLocalTime);
        } else {
          console.log('添加新消息到历史消息列表');
          setMessages([...messagesWithLocalTime, {
            ...newMessage,
            timestamp: convertUTCToLocal(newMessage.timestamp)
          }]);
        }
        
                // 标记最后一条消息为已读
        const lastMessage = channelMessages[channelMessages.length - 1];
        console.log('标记最后一条消息为已读:', lastMessage.message_id);
        throttledMarkAsRead(channel.channel_id, lastMessage.message_id);
        console.log('消息已读标记完成');
      } else {
        console.log('频道没有历史消息，只显示新消息');
        setMessages([{
          ...newMessage,
          timestamp: convertUTCToLocal(newMessage.timestamp)
        }]);
        }
    } catch (error) {
      console.error('加载频道消息失败:', error);
      toast.error('加载消息失败');
      // 即使加载失败，也要显示新消息
      setMessages([{
        ...newMessage,
        timestamp: convertUTCToLocal(newMessage.timestamp)
      }]);
    }
  };

  // 选择频道并加载消息
  const selectChannel = async (channel: ChatChannel) => {
    console.log('选择频道:', channel.name, '类型:', channel.type, '频道ID:', channel.channel_id);
    setSelectedChannel(channel);
    selectedChannelRef.current = channel;
    setMessages([]);
    
    if (isMobile) {
      setShowSidebar(false);
    }

    // 如果是私聊频道，尝试获取用户信息并更新频道显示
    if (channel.type === 'PM' && channel.users.length > 0) {
      try {
        // 获取私聊对象的用户信息
        const targetUserId = channel.users.find(id => id !== user?.id);
        if (targetUserId && !channel.user_info) {
          console.log('获取私聊用户信息:', targetUserId);
          
          // 检查缓存
          let userInfo = userInfoCache.get(targetUserId);
          if (!userInfo) {
            userInfo = await userAPI.getUser(targetUserId);
            // 更新缓存
            setUserInfoCache(prev => new Map(prev.set(targetUserId, userInfo)));
          }
          
          console.log('私聊用户信息:', userInfo);
          
          // 更新频道信息
          setChannels(prev => prev.map(ch => {
            if (ch.channel_id === channel.channel_id) {
              return {
                ...ch,
                name: `私聊: ${userInfo.username}`,
                user_info: {
                  id: userInfo.id,
                  username: userInfo.username,
                  avatar_url: userInfo.avatar_url || userAPI.getAvatarUrl(userInfo.id),
                  cover_url: userInfo.cover_url || userInfo.cover?.url || ''
                }
              };
            }
            return ch;
          }));
        }
      } catch (error) {
        console.error('获取私聊用户信息失败:', error);
      }
    }

    try {
      console.log('开始加载频道消息，频道ID:', channel.channel_id);
      const channelMessages = await chatAPI.getChannelMessages(channel.channel_id);
      console.log('频道消息加载完成:', channelMessages?.length || 0, '条');
      
      if (channelMessages && channelMessages.length > 0) {
        // 转换所有历史消息的时间戳
        const messagesWithLocalTime = channelMessages.map((msg: ChatMessage) => ({
          ...msg,
          timestamp: convertUTCToLocal(msg.timestamp)
        }));
        
        console.log('设置消息列表，消息数量:', messagesWithLocalTime.length);
        setMessages(messagesWithLocalTime);
        
        // 标记最后一条消息为已读
        const lastMessage = channelMessages[channelMessages.length - 1];
        console.log('标记最后一条消息为已读:', lastMessage.message_id);
        throttledMarkAsRead(channel.channel_id, lastMessage.message_id);
        console.log('消息已读标记完成');
      } else {
        console.log('频道没有历史消息');
        setMessages([]);
      }
    } catch (error) {
      console.error('加载频道消息失败:', error);
      toast.error('加载消息失败');
      setMessages([]);
    }
  };

  // 统一的消息添加函数
  const addMessageToList = useCallback((message: ChatMessage, source: 'api' | 'websocket') => {
    console.log(`添加消息(${source}): ID=${message.message_id}, 频道ID=${message.channel_id}, 发送者=${message.sender_id}, 内容="${message.content.substring(0, 30)}"`);
    
    const messageWithLocalTime = {
      ...message,
      timestamp: convertUTCToLocal(message.timestamp)
    };
    
    setMessages(prev => {
      // 检查消息是否已存在
      const existsById = prev.find(m => m.message_id === message.message_id);
      if (existsById) {
        console.log(`消息已存在，跳过: ${message.message_id}`);
        return prev;
      }
      
      console.log(`成功添加消息: ${message.message_id}, 当前消息列表长度: ${prev.length + 1}`);
      return [...prev, messageWithLocalTime];
    });

    // 如果是当前频道的新消息，使用防抖函数标记为已读
    const currentChannel = selectedChannelRef.current;
    if (currentChannel && message.channel_id === currentChannel.channel_id) {
      console.log(`准备标记消息为已读: ${message.message_id}, 频道: ${currentChannel.name}`);
      throttledMarkAsRead(message.channel_id, message.message_id);
    } else {
      console.log(`消息不属于当前频道或没有选中频道，当前频道: ${currentChannel?.name || 'null'}, 消息频道: ${message.channel_id}`);
    }
  }, []);

  // 发送消息
  const sendMessage = async (messageText: string) => {
    if (!selectedChannel || !messageText.trim()) return;

    try {
      const message = await chatAPI.sendMessage(
        selectedChannel.channel_id,
        messageText.trim()
      );
      
      console.log('消息发送成功，立即显示:', message.message_id);
      
      // 立即显示消息，不等待WebSocket确认
      addMessageToList(message, 'api');
      
    } catch (error) {
      console.error('发送消息失败:', error);
      toast.error('发送消息失败');
    }
  };

  // 防抖的标记已读函数，避免重复请求API
  const throttledMarkAsRead = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null;
      const pendingRequests = new Set<string>();
      
      return async (channelId: number, messageId: number) => {
        const requestKey = `${channelId}-${messageId}`;
        
        // 如果已经在处理中，跳过
        if (pendingRequests.has(requestKey)) {
          console.log(`请求已在进行中，跳过: ${requestKey}`);
          return;
        }
        
        // 清除之前的定时器
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // 设置新的定时器
        timeoutId = setTimeout(async () => {
          try {
            pendingRequests.add(requestKey);
            console.log(`防抖标记已读: 频道${channelId}, 消息${messageId}`);
            await chatAPI.markAsRead(channelId, messageId);
            console.log(`标记已读成功: 频道${channelId}, 消息${messageId}`);
            
            // 更新频道列表中的已读状态
            updateChannelReadStatus(channelId, messageId);
            
            // 查找并删除相关通知
            const relatedNotifications = notifications.filter(notification => 
              notification.name === 'channel_message' && 
              notification.object_id === channelId.toString()
            );
            
            // 删除相关通知
            for (const notification of relatedNotifications) {
              try {
                console.log(`删除相关通知: ${notification.id}`);
                removeNotificationByObject(notification.object_id, notification.object_type);
              } catch (error) {
                console.error(`删除通知失败: ${notification.id}`, error);
              }
            }
            
          } catch (error) {
            console.error(`标记已读失败: 频道${channelId}, 消息${messageId}`, error);
          } finally {
            pendingRequests.delete(requestKey);
          }
        }, 500); // 500ms防抖
      };
    })(),
    [notifications, removeNotificationByObject]
  );

  // 消息可见性检测 - 当用户真正"看到"消息时自动标记已读
  useEffect(() => {
    if (!selectedChannel || messages.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && selectedChannel) {
            const messageElement = entry.target as HTMLElement;
            const messageId = parseInt(messageElement.dataset.messageId || '0');
            const channelId = selectedChannel.channel_id;
            
            // 确保消息ID有效且大于当前已读ID
            if (messageId > 0 && messageId > (selectedChannel.last_read_id || 0)) {
              console.log(`消息 ${messageId} 在频道 ${channelId} 中进入可视区域，准备标记为已读`);
              
              // 延迟一点时间确保用户真的看到了消息
              const timeoutId = setTimeout(() => {
                // 再次检查是否仍然是当前选中的频道
                if (selectedChannel && selectedChannel.channel_id === channelId) {
                  console.log(`延迟后标记消息 ${messageId} 为已读`);
                  throttledMarkAsRead(channelId, messageId);
                }
              }, 1000); // 1秒后标记为已读
              
              // 存储 timeout ID 以便在需要时清除
              messageElement.dataset.readTimeout = timeoutId.toString();
            }
          } else {
            // 消息离开可视区域时，清除等待中的标记已读操作
            const messageElement = entry.target as HTMLElement;
            const timeoutId = messageElement.dataset.readTimeout;
            if (timeoutId) {
              clearTimeout(parseInt(timeoutId));
              delete messageElement.dataset.readTimeout;
            }
          }
        });
      },
      {
        root: null, // 使用视窗作为根
        rootMargin: '0px',
        threshold: 0.6 // 当消息60%可见时触发，确保用户真的看到了
      }
    );

    // 观察当前频道的所有消息元素
    const messageElements = document.querySelectorAll(`[data-message-id]`);
    messageElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      // 清除所有观察和等待中的timeout
      messageElements.forEach((element) => {
        const timeoutId = (element as HTMLElement).dataset.readTimeout;
        if (timeoutId) {
          clearTimeout(parseInt(timeoutId));
        }
      });
      observer.disconnect();
    };
  }, [messages, selectedChannel, throttledMarkAsRead]);

  // 处理通知标记已读并跳转到聊天
  const handleNotificationMarkAsRead = useCallback(async (notification: typeof notifications[0]) => {
    try {
      console.log('处理通知标记已读:', notification.id, notification.name);
      
      // 先调用API标记通知为已读（确保服务器状态更新）
      await markAsRead(notification.id);
      
      // 如果是频道消息通知，跳转到对应聊天
      if (notification.name === 'channel_message') {
        const channelId = parseInt(notification.object_id);
        
        // 查找对应的频道
        const targetChannel = channels.find(channel => channel.channel_id === channelId);
        
        if (targetChannel) {
          console.log(`跳转到频道: ${targetChannel.name} (${channelId})`);
          setSelectedChannel(targetChannel);
          if (isMobile) {
            setShowSidebar(false); // 在移动端关闭侧边栏
          }
          
          // 可选：延迟删除通知，确保用户看到跳转效果
          setTimeout(() => {
            removeNotificationByObject(notification.object_id, notification.object_type);
          }, 500);
        } else {
          console.log(`未找到频道ID为 ${channelId} 的频道`);
        }
      }
    } catch (error) {
      console.error('处理通知标记已读失败:', error);
    }
  }, [markAsRead, channels, removeNotificationByObject, setSelectedChannel, setShowSidebar, isMobile, notifications]);

  // 监控未读计数变化
  useEffect(() => {
    console.log('未读计数更新:', unreadCount);
  }, [unreadCount]);

  // 获取用户信息
  const fetchUserInfo = useCallback(async (userId: number) => {
    // 如果已经缓存了就直接返回
    if (userInfoCache.has(userId)) {
      return userInfoCache.get(userId);
    }

    try {
      console.log(`获取用户信息: ${userId}`);
      const userInfo = await userAPI.getUser(userId);
      
      // 缓存用户信息
      setUserInfoCache(prev => new Map(prev.set(userId, userInfo)));
      
      return userInfo;
    } catch (error) {
      console.error(`获取用户信息失败: ${userId}`, error);
      return null;
    }
  }, [userInfoCache]);

  // 批量获取通知相关的用户信息
  useEffect(() => {
    if (!notifications.length) return;

    const userIdsToFetch = new Set<number>();
    
    notifications.forEach(notification => {
      if (notification.source_user_id && !userInfoCache.has(notification.source_user_id)) {
        userIdsToFetch.add(notification.source_user_id);
      }
    });

    // 批量获取用户信息
    Array.from(userIdsToFetch).forEach(userId => {
      fetchUserInfo(userId);
    });
  }, [notifications, userInfoCache, fetchUserInfo]);

  // 清理重复的私聊频道
  const cleanupDuplicatePrivateChannels = () => {
    setChannels(prev => {
      const uniqueChannels: ChatChannel[] = [];
      const seenUserPairs = new Set<string>();
      
      prev.forEach(channel => {
        if (channel.type === 'PM') {
          // 对于私聊频道，检查用户组合是否重复
          const currentUserId = user?.id || 0;
          const otherUsers = channel.users.filter(id => id !== currentUserId);
          
          if (otherUsers.length > 0) {
            // 创建用户组合的唯一标识
            const userPairKey = otherUsers.sort().join(',');
            const fullPairKey = `${currentUserId}-${userPairKey}`;
            
            if (!seenUserPairs.has(fullPairKey)) {
              seenUserPairs.add(fullPairKey);
              uniqueChannels.push(channel);
            } else {
              console.log('移除重复的私聊频道:', channel.name);
            }
          } else {
            // 如果没有其他用户，保留频道
            uniqueChannels.push(channel);
          }
        } else {
          // 非私聊频道直接保留
          uniqueChannels.push(channel);
        }
      });
      
      console.log('清理后的频道数量:', uniqueChannels.length, '原始数量:', prev.length);
      return uniqueChannels;
    });
  };

  // 处理私聊通知，创建对应的私聊频道
  const handlePrivateMessageNotification = async (notification: APINotification) => {
    if (notification.name === 'channel_message' && notification.details?.type === 'pm') {
      try {
        console.log('检测到私聊消息通知，尝试创建私聊频道:', notification);
        
        // 从通知中获取用户信息
        const sourceUserId = notification.source_user_id;
        
        if (!sourceUserId) {
          console.log('通知中缺少源用户ID，跳过处理');
          return;
        }
        
        // 检查是否已经存在对应的私聊频道（通过用户ID去重）
        const existingChannel = channels.find(ch => {
          if (ch.type !== 'PM') return false;
          
          // 检查频道是否包含当前用户和目标用户
          const hasCurrentUser = ch.users.includes(user?.id || 0);
          const hasTargetUser = ch.users.includes(sourceUserId);
          
          return hasCurrentUser && hasTargetUser;
        });
        
        if (existingChannel) {
          console.log('私聊频道已存在，跳过创建:', existingChannel.name);
          return;
        }
        
        console.log('未找到现有私聊频道，获取用户信息并创建新的私聊频道');
        
        // 获取用户详细信息
        let userName = notification.details.title as string || '未知用户';
        let userAvatarUrl = '';
        let userCoverUrl = '';
        
        try {
          // 检查缓存
          let userInfo = userInfoCache.get(sourceUserId);
          if (!userInfo) {
            userInfo = await userAPI.getUser(sourceUserId);
            // 更新缓存
            setUserInfoCache(prev => new Map(prev.set(sourceUserId, userInfo)));
          }
          
          console.log('获取到用户信息:', userInfo);
          userName = userInfo.username || userName;
          userAvatarUrl = userInfo.avatar_url || userAPI.getAvatarUrl(sourceUserId);
          userCoverUrl = userInfo.cover_url || userInfo.cover?.url || '';
        } catch (error) {
          console.error('获取用户信息失败，使用默认值:', error);
          userAvatarUrl = userAPI.getAvatarUrl(sourceUserId);
        }
        
        // 创建新的私聊频道对象
        const newPrivateChannel: ChatChannel = {
          channel_id: parseInt(notification.object_id.toString()), // 转换为数字
          name: `私聊: ${userName}`,
          description: `与 ${userName} 的私聊`,
          type: 'PM',
          moderated: false,
          users: [user?.id || 0, sourceUserId],
          current_user_attributes: {
            can_message: true,
            can_message_error: undefined,
            last_read_id: 0
          },
          last_read_id: 0,
          last_message_id: 0,
          recent_messages: [],
          message_length_limit: 1000,
          // 添加用户信息到频道对象中以便显示
          user_info: {
            id: sourceUserId,
            username: userName,
            avatar_url: userAvatarUrl,
            cover_url: userCoverUrl
          }
        };
        
        console.log('创建新的私聊频道对象:', newPrivateChannel);
        
        // 添加到频道列表，确保不重复
        setChannels(prev => {
          // 再次检查是否已经存在相同的私聊频道（防止竞态条件）
          const isDuplicate = prev.some(ch => {
            if (ch.type !== 'PM') return false;
            
            // 检查是否包含相同的用户组合
            const hasCurrentUser = ch.users.includes(user?.id || 0);
            const hasTargetUser = ch.users.includes(sourceUserId);
            
            return hasCurrentUser && hasTargetUser;
          });
          
          if (isDuplicate) {
            console.log('检测到重复的私聊频道，跳过添加');
            return prev;
          }
          
          console.log('添加新的私聊频道到列表');
          const newChannels = [...prev, newPrivateChannel];
          
          // 重新排序：倒序排列，频道在前，最下面是第一个
          return newChannels.sort((a: ChatChannel, b: ChatChannel) => {
            // 优先级：公共频道 > 私聊 > 团队 > 私有
            const typeOrder: Record<string, number> = { 'PUBLIC': 0, 'PM': 1, 'TEAM': 2, 'PRIVATE': 3 };
            const aOrder = typeOrder[a.type] || 4;
            const bOrder = typeOrder[b.type] || 4;
            
            if (aOrder !== bOrder) {
              // 倒序排列：较大的 order 值在前
              return bOrder - aOrder;
            }
            
            // 同类型内按名称倒序排列
            return b.name.localeCompare(a.name);
          });
        });
        
        console.log('私聊频道已添加到列表');
        toast.success(`发现新的私聊: ${userName}`);
        
      } catch (error) {
        console.error('处理私聊通知失败:', error);
      }
    }
  };

  // 获取通知标题
  const getNotificationTitle = (notification: APINotification): string => {
    // 获取用户信息
    const userInfo = notification.source_user_id ? userInfoCache.get(notification.source_user_id) : null;
    const userName = userInfo?.username || '未知用户';

    switch (notification.name) {
      case 'team_application_store':
        return `团队加入申请`;
      case 'team_application_accept':
        return `团队申请已接受`;
      case 'team_application_reject':
        return `团队申请已拒绝`;
      case 'channel_message':
        // 根据类型显示不同的标题
        if (notification.details?.type === 'pm') {
          return `新私聊消息: ${userName}`;
        } else if (notification.details?.type === 'team') {
          return `新团队消息: ${notification.details.title || '团队频道'}`;
        }
        return `新私聊消息: ${userName}`;
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
        return notification.name;
    }
  };

  // 获取通知内容
  const getNotificationContent = (notification: APINotification): string => {
    // 获取用户信息
    const userInfo = notification.source_user_id ? userInfoCache.get(notification.source_user_id) : null;
    const userName = userInfo?.username || '未知用户';

    switch (notification.name) {
      case 'team_application_store':
        return `${userName} 申请加入您的团队`;
      case 'team_application_accept':
        return `您已成功加入团队 ${notification.details.title}`;
      case 'team_application_reject':
        return `您的团队申请被拒绝`;
      case 'channel_message':
        // 根据类型显示不同的内容
        if (notification.details?.type === 'pm') {
          return `来自 ${userName} 的消息`;
        } else if (notification.details?.type === 'team') {
          return `团队频道: ${notification.details.title || '团队消息'}`;
        }
        return `来自 ${notification.details.title || '未知来源'}`;
      case 'channel_team':
        return `团队频道: ${notification.details?.title || '团队消息'}`;
      case 'channel_public':
        return `公共频道: ${notification.details?.title || '公共消息'}`;
      case 'channel_private':
        return `私有频道: ${notification.details?.title || '私有消息'}`;
      case 'channel_multiplayer':
        return `多人游戏: ${notification.details?.title || '游戏消息'}`;
      case 'channel_spectator':
        return `观战频道: ${notification.details?.title || '观战消息'}`;
      case 'channel_temporary':
        return `临时频道: ${notification.details?.title || '临时消息'}`;
      case 'channel_group':
        return `群组频道: ${notification.details?.title || '群组消息'}`;
      case 'channel_system':
        return `系统频道: ${notification.details?.title || '系统消息'}`;
      case 'channel_announce':
        return `公告频道: ${notification.details?.title || '公告消息'}`;
      default:
        return JSON.stringify(notification.details);
    }
  };

  // 处理私聊开始
  const handleStartPrivateChat = async (user: User) => {
    try {
      console.log('开始与用户私聊:', user.username);
      
      // 首先检查是否已经存在私聊频道
      const existingChannel = await chatAPI.getPrivateChannel(user.id);
      
      if (existingChannel) {
        console.log('找到现有私聊频道:', existingChannel.name);
        // 选择现有频道
        selectChannel(existingChannel);
        setShowFriendsList(false);
        return;
      }
      
      // 如果没有现有频道，创建新的私聊
      console.log('创建新的私聊频道');
      setShowFriendsList(false);
      setShowNewPMModal(true);
      // 将选中的用户传递给私聊模态框
      (window as any).selectedUserForPM = user;
    } catch (error) {
      console.error('开始私聊失败:', error);
      toast.error('开始私聊失败');
      // 确保好友列表关闭
      setShowFriendsList(false);
    }
  };

  // 处理团队请求
  const handleTeamRequest = async (notification: APINotification, action: 'accept' | 'reject') => {
    try {
      const teamId = parseInt(notification.object_id);
      const userId = notification.source_user_id;
      
      if (!userId) {
        toast.error('无法获取用户信息');
        return;
      }

      if (action === 'accept') {
        await teamsAPI.acceptJoinRequest(teamId, userId);
        toast.success('已接受加入请求');
      } else {
        await teamsAPI.rejectJoinRequest(teamId, userId);
        toast.success('已拒绝加入请求');
      }

      // 标记通知为已读
      await markAsRead(notification.id);
    } catch (error) {
      console.error('处理团队请求失败:', error);
      toast.error(`${action === 'accept' ? '接受' : '拒绝'}请求失败`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            需要登录
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            请登录后查看消息
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* 侧边栏 */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
              w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
              flex flex-col ${isMobile ? 'h-screen max-h-screen' : 'h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]'}
            `}
          >
            {/* 侧边栏头部 */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    消息中心
                  </h1>
                  {/* WebSocket连接状态 */}
                  <div className="flex items-center space-x-1">
                    <div className={`
                      w-2 h-2 rounded-full
                      ${notificationConnected ? 'bg-green-500' : 'bg-red-500'}
                    `} />
                    <div className={`
                      w-2 h-2 rounded-full
                      ${chatConnected ? 'bg-green-500' : 'bg-red-500'}
                    `} />
                  </div>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>

              {/* 标签页切换 */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('channels')}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium
                    transition-all duration-200
                    ${activeTab === 'channels'
                      ? 'bg-white dark:bg-gray-600 text-osu-pink shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <FiMessageCircle size={16} />
                  <span>消息</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium
                    transition-all duration-200 relative
                    ${activeTab === 'notifications'
                      ? 'bg-white dark:bg-gray-600 text-osu-pink shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <FiBell size={16} />
                  <span>通知</span>
                  {unreadCount.total > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount.total > 99 ? '99+' : unreadCount.total}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'channels' ? (
                <div className="h-full flex flex-col">
                  {/* 频道过滤器和新建按钮 */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {[
                        { key: 'all' as const, label: '全部' },
                        { key: 'private' as const, label: '私聊' },
                        { key: 'team' as const, label: '团队' },
                        { key: 'public' as const, label: '公共' },
                      ].map(filter => (
                        <button
                          key={filter.key}
                          onClick={() => setChannelFilter(filter.key)}
                          className={`
                            py-1.5 px-2 rounded text-center font-medium transition-all duration-200
                            ${channelFilter === filter.key
                              ? 'bg-osu-pink text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }
                          `}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* 刷新频道列表按钮 */}
                    <button
                      onClick={async () => {
                        console.log('手动刷新频道列表');
                        try {
                          const channels = await chatAPI.getChannels();
                          console.log('手动刷新后的频道列表:', channels);
                          const pmChannels = channels.filter((ch: ChatChannel) => ch.type === 'PM');
                          console.log('手动刷新后的私聊频道数量:', pmChannels.length);
                          if (pmChannels.length > 0) {
                            console.log('私聊频道详情:', pmChannels.map((ch: ChatChannel) => ({ 
                              id: ch.channel_id, 
                              name: ch.name, 
                              type: ch.type,
                              users: ch.users 
                            })));
                          }
                          
                          // 重新排序频道：倒序排列，频道在前，最下面是第一个
                          const sortedChannels = channels.sort((a: ChatChannel, b: ChatChannel) => {
                            // 优先级：公共频道 > 私聊 > 团队 > 私有
                            const typeOrder: Record<string, number> = { 'PUBLIC': 0, 'PM': 1, 'TEAM': 2, 'PRIVATE': 3 };
                            const aOrder = typeOrder[a.type] || 4;
                            const bOrder = typeOrder[b.type] || 4;
                            
                            if (aOrder !== bOrder) {
                              // 倒序排列：较大的 order 值在前
                              return bOrder - aOrder;
                            }
                            
                            // 同类型内按名称倒序排列
                            return b.name.localeCompare(a.name);
                          });
                          
                          setChannels(sortedChannels);
                          
                          // 清理重复的私聊频道
                          setTimeout(() => {
                            cleanupDuplicatePrivateChannels();
                          }, 100);
                          
                          toast.success(`频道列表已刷新，共 ${channels.length} 个频道，其中私聊 ${pmChannels.length} 个`);
                        } catch (error) {
                          console.error('手动刷新失败:', error);
                          toast.error('刷新失败');
                        }
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors text-sm font-medium"
                      title="刷新频道列表"
                    >
                      <FiRefreshCw size={16} />
                      <span>刷新频道</span>
                    </button>
                    
                    {/* 新建私聊按钮 */}
                    <button
                      onClick={() => setShowNewPMModal(true)}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-osu-pink/10 text-osu-pink hover:bg-osu-pink/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <FiPlus size={16} />
                      <span>新建私聊</span>
                    </button>
                    
                    {/* 好友管理按钮 */}
                    <button
                      onClick={() => setShowFriendsList(true)}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <FiUserPlus size={16} />
                      <span>好友管理</span>
                    </button>
                  </div>

                  {/* 频道列表 */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        加载中...
                      </div>
                    ) : filteredChannels.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        暂无频道
                      </div>
                    ) : (
                      <div className="space-y-1 p-2">
                        {filteredChannels.map(channel => (
                          <ChannelItem
                            key={channel.channel_id}
                            channel={channel}
                            isSelected={selectedChannel?.channel_id === channel.channel_id}
                            onClick={() => selectChannel(channel)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 通知列表 */
                <div className="flex flex-col h-full">
                  {/* 通知操作按钮 */}
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        console.log('手动刷新通知列表');
                        refresh(); // 调用通知刷新函数
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors text-sm font-medium"
                      title="刷新通知列表"
                    >
                      <FiRefreshCw size={16} />
                      <span>刷新通知</span>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto min-h-0">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        暂无通知
                      </div>
                    ) : (
                      <div className="space-y-1 p-2">
                        {notifications.map((notification, index) => (
                          <div
                            key={`notification-${notification.id}-${index}`}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {/* 显示用户头像或默认图标 */}
                                {notification.source_user_id && userInfoCache.has(notification.source_user_id) ? (
                                  <img
                                    src={userAPI.getAvatarUrl(notification.source_user_id)}
                                    alt="用户头像"
                                    className="w-10 h-10 rounded-lg object-cover"
                                    onError={(e) => {
                                      // 如果头像加载失败，显示默认图标
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                
                                {/* 默认图标 - 在没有用户信息或头像加载失败时显示 */}
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  notification.source_user_id && userInfoCache.has(notification.source_user_id) ? 'hidden' : ''
                                } ${
                                  notification.name.includes('team_application') 
                                    ? 'bg-orange-500/20' 
                                    : notification.name.includes('channel') 
                                    ? 'bg-blue-500/20' 
                                    : 'bg-gray-500/20'
                                }`}>
                                  {notification.name.includes('team_application') && (
                                    <FiUserPlus className="text-orange-500" size={20} />
                                  )}
                                  {notification.name.includes('channel') && (
                                    <FiMessageCircle className="text-blue-500" size={20} />
                                  )}
                                  {!notification.name.includes('team_application') && !notification.name.includes('channel') && (
                                    <FiBell className="text-gray-500" size={20} />
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {getNotificationTitle(notification)}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {getNotificationContent(notification)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {new Date(notification.created_at).toLocaleString()}
                                </p>
                                
                                {notification.name === 'team_application_store' && (
                                  <div className="flex space-x-2 mt-3">
                                    <button
                                      onClick={() => handleTeamRequest(notification, 'accept')}
                                      className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                                    >
                                      <FiCheck size={14} />
                                      <span>接受</span>
                                    </button>
                                    <button
                                      onClick={() => handleTeamRequest(notification, 'reject')}
                                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                                    >
                                      <FiX size={14} />
                                      <span>拒绝</span>
                                    </button>
                                  </div>
                                )}
                                
                                {!notification.is_read && (
                                  <button
                                    onClick={() => handleNotificationMarkAsRead(notification)}
                                    className="text-xs text-osu-pink hover:text-osu-pink/80 mt-2"
                                  >
                                    标记为已读
                                  </button>
                                )}
                              </div>
                          </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-4rem)] overflow-hidden">
        {selectedChannel ? (
          <>
            {/* 聊天头部 */}
            <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                )}
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedChannel.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChannel.type === 'PM' ? '私聊' : 
                     selectedChannel.type === 'TEAM' ? '团队频道' : '公共频道'}
                  </p>
                </div>
              </div>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <FiMoreHorizontal size={20} />
              </button>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                
                // 改进消息分组逻辑
                let isGrouped = false;
                if (prevMessage && prevMessage.sender_id === message.sender_id) {
                  const timeDiff = new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime();
                  // 临时禁用分组功能进行调试
                  isGrouped = false; // timeDiff < 300000; // 5分钟内才分组，而不是1分钟
                  console.log(`消息分组检查: ${message.message_id}, 时间差: ${timeDiff}ms, 是否分组: ${isGrouped}`);
                }
                
                return (
                  <div key={`message-${message.message_id}-${index}`} data-message-id={message.message_id}>
                    <MessageBubble
                      message={message}
                      currentUser={user || undefined}
                      isGrouped={isGrouped}
                    />
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* 消息输入框 */}
            <div className="flex-shrink-0">
              <MessageInput
                onSendMessage={sendMessage}
                disabled={!selectedChannel?.current_user_attributes?.can_message}
                placeholder={
                  selectedChannel?.current_user_attributes?.can_message_error || 
                  "输入消息..."
                }
                maxLength={selectedChannel?.message_length_limit || 1000}
              />
            </div>
          </>
        ) : (
          /* 未选择频道时的占位内容 */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="mb-4 p-3 bg-osu-pink text-white rounded-lg"
                >
                  <FiMessageCircle size={24} />
                </button>
              )}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                选择一个频道开始聊天
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                从左侧选择一个频道或私聊开始对话
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 移动端遮罩 */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* 新建私聊模态框 */}
      <PrivateMessageModal
        isOpen={showNewPMModal}
        onClose={() => setShowNewPMModal(false)}
        onMessageSent={async (newChannel) => {
          console.log('私聊消息发送成功，新频道:', newChannel);
          
          if (isAuthenticated && newChannel) {
            try {
              // 重新加载频道列表
              console.log('重新加载频道列表以包含新私聊频道');
              const channels = await chatAPI.getChannels();
              console.log('重新加载后的频道列表:', channels);
              
              // 过滤并排序频道：倒序排列，频道在前，最下面是第一个
              const sortedChannels = channels.sort((a: ChatChannel, b: ChatChannel) => {
                // 优先级：公共频道 > 私聊 > 团队 > 私有
                const typeOrder: Record<string, number> = { 'PUBLIC': 0, 'PM': 1, 'TEAM': 2, 'PRIVATE': 3 };
                const aOrder = typeOrder[a.type] || 4;
                const bOrder = typeOrder[b.type] || 4;
                
                if (aOrder !== bOrder) {
                  // 倒序排列：较大的 order 值在前
                  return bOrder - aOrder;
                }
                
                // 同类型内按名称倒序排列
                return b.name.localeCompare(a.name);
              });
              
              setChannels(sortedChannels);
              
              // 自动选择新创建的私聊频道
              console.log('自动选择新创建的私聊频道:', newChannel.name);
              await selectChannel(newChannel);
              
              // 确保消息被正确加载
              console.log('私聊频道选择完成，开始加载消息');
            } catch (error) {
              console.error('处理新私聊频道失败:', error);
              toast.error('加载私聊频道失败');
            }
          }
        }}
        currentUser={user || undefined}
      />

      {/* 好友管理模态框 */}
      {showFriendsList && (
        <FriendsList
          currentUser={user || undefined}
          onStartPrivateChat={handleStartPrivateChat}
          onClose={() => setShowFriendsList(false)}
        />
      )}
    </div>
  );
};

export default MessagesPage;
