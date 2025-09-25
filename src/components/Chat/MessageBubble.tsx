import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '../UI/Avatar';
import type { ChatMessage, User } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
  currentUser?: User;
  showAvatar?: boolean;
  isGrouped?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  currentUser, 
  showAvatar = true,
  isGrouped = false 
}) => {
  const isOwnMessage = message.sender_id === currentUser?.id;
  const timestamp = new Date(message.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start space-x-3 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''} ${isGrouped ? 'mt-1' : 'mt-4'}`}
    >
      {/* avatar */}
      {showAvatar && !isGrouped && (
        <div className="flex-shrink-0">
          <Avatar
            userId={message.sender_id}
            username={message.sender?.username || 'Unknown user'}
            avatarUrl={message.sender?.avatar_url}
            size="sm"
          />
        </div>
      )}
      
      {/* Message content */}
      <div className={`flex-1 max-w-md ${isOwnMessage ? 'text-right' : ''}`}>
        {/* Sender information and time */}
        {!isGrouped && (
          <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {isOwnMessage ? 'you' : message.sender?.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timestamp.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div className={`inline-block`}>
          <div className={`
            p-3 rounded-2xl text-sm
            ${isOwnMessage
              ? 'bg-osu-pink text-white rounded-br-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
            }
            ${message.is_action ? 'italic font-medium' : ''}
          `}>
            {message.is_action && (
              <span className="opacity-75">* {message.sender?.username} </span>
            )}
            <span className="whitespace-pre-wrap break-words">
              {message.content}
            </span>
          </div>
        </div>
      </div>
      
      {/* Placeholder to maintain balanced layout */}
      {showAvatar && !isGrouped && !isOwnMessage && <div className="w-8" />}
      {showAvatar && !isGrouped && isOwnMessage && <div className="w-8" />}
    </motion.div>
  );
};

export default React.memo(MessageBubble);