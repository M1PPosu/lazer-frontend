import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Enter a message...",
  maxLength = 1000
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically adjust the input box height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset the height first to get the correct one scrollHeight
      textarea.style.height = '48px';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 48), 120);
      textarea.style.height = `${newHeight}px`;
      // Make sure there are no scroll bars
      textarea.style.overflowY = newHeight >= 120 ? 'auto' : 'hidden';
    }
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
    
    // Reset input box height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '48px'; // Return to minimum height
      textareaRef.current.style.overflowY = 'hidden';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Handle paste events to ensure that the maximum length is not exceeded
    const pastedText = e.clipboardData.getData('text');
    const currentLength = message.length;
    const remainingLength = maxLength - currentLength;
    
    if (pastedText.length > remainingLength) {
      e.preventDefault();
      const truncatedText = pastedText.substring(0, remainingLength);
      setMessage(prev => prev + truncatedText);
    }
  };

  return (
    <div className=" px-3 pt-3 pb-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="mb-3 flex items-end space-x-3">
        {/* Message input area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={`
              w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 
              border border-gray-200 dark:border-gray-600 rounded-lg 
              resize-none text-gray-900 dark:text-white 
              placeholder-gray-500 dark:placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-osu-pink focus:border-transparent
              transition-all duration-200 overflow-hidden
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            rows={1}
            style={{ 
              minHeight: '48px', 
              maxHeight: '120px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          />
          
          {/* Character Count */}
          {message.length > maxLength * 0.8 && (
            <div className={`
              absolute right-3 top-1 text-xs
              ${message.length >= maxLength ? 'text-red-500' : 'text-gray-400'}
            `}>
              {message.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Send button */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`mb-[5px]
            w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center flex-shrink-0
            ${!message.trim() || disabled
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-osu-pink text-white hover:bg-osu-pink/90 shadow-lg shadow-osu-pink/25'
            }
          `}
        >
          <FiSend size={16} />
        </motion.button>
      </div>
      
      {/* Simplified prompt text */}
      {disabled && (
        <div className="mt-2 text-xs text-red-400">
          Unable to send a message.
        </div>
      )}
    </div>
  );
};

export default MessageInput;