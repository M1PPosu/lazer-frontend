import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiUsers, FiLock, FiHash } from 'react-icons/fi';
import Avatar from '../UI/Avatar';
import type { ChatChannel } from '../../types';

interface ChannelItemProps {
  channel: ChatChannel;
  isSelected: boolean;
  onClick: () => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ channel, isSelected, onClick }) => {
  const hasUnreadMessages = (channel.last_read_id || 0) < (channel.last_message_id || 0);
  const lastMessage = channel.recent_messages?.[0];

  const getChannelIcon = () => {
    switch (channel.type) {
      case 'PM':
        return (
          <Avatar 
            userId={channel.users[0] || 0} 
            username={channel.name}
            size="sm"
          />
        );
      case 'TEAM':
        return (
          <div className="w-10 h-10 bg-osu-pink/20 rounded-lg flex items-center justify-center">
            <FiUsers className="text-osu-pink" size={20} />
          </div>
        );
      case 'PRIVATE':
        return (
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <FiLock className="text-purple-500" size={20} />
          </div>
        );
      case 'PUBLIC':
        return (
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <FiHash className="text-blue-500" size={20} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
            <FiMessageCircle className="text-gray-500" size={20} />
          </div>
        );
    }
  };

  const formatLastMessage = () => {
    if (!lastMessage) {
      return channel.description || '暂无消息';
    }
    
    const senderName = lastMessage.sender?.username || '未知用户';
    const content = lastMessage.content;
    
    if (lastMessage.is_action) {
      return `* ${senderName} ${content}`;
    }
    
    return `${senderName}: ${content}`;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full p-3 rounded-lg text-left transition-all duration-200
        hover:bg-gray-50 dark:hover:bg-gray-700/50
        ${isSelected
          ? 'bg-osu-pink/10 border border-osu-pink/20 shadow-sm'
          : 'border border-transparent'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        {/* 频道图标 */}
        <div className="flex-shrink-0 relative">
          {getChannelIcon()}
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-osu-pink rounded-full border-2 border-white dark:border-gray-800" />
          )}
        </div>
        
        {/* 频道信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`
              font-medium truncate
              ${isSelected 
                ? 'text-osu-pink' 
                : 'text-gray-900 dark:text-white'
              }
              ${hasUnreadMessages ? 'font-semibold' : ''}
            `}>
              {channel.name}
            </h3>
            
            {/* 未读消息指示器 */}
            {hasUnreadMessages && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-osu-pink rounded-full flex-shrink-0"
              />
            )}
          </div>
          
          {/* 最后一条消息 */}
          <p className={`
            text-sm truncate
            ${hasUnreadMessages 
              ? 'text-gray-700 dark:text-gray-200 font-medium' 
              : 'text-gray-500 dark:text-gray-400'
            }
          `}>
            {formatLastMessage()}
          </p>
          
          {/* 频道类型标签 */}
          <div className="flex items-center space-x-1 mt-1">
            {channel.type === 'PM' && (
              <span className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                私聊
              </span>
            )}
            {channel.type === 'TEAM' && (
              <span className="text-xs px-1.5 py-0.5 bg-osu-pink/10 text-osu-pink rounded">
                团队
              </span>
            )}
            {channel.type === 'PUBLIC' && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                公共
              </span>
            )}
            {channel.moderated && (
              <span className="text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded">
                管制
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default ChannelItem;
