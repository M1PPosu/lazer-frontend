import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiSearch } from 'react-icons/fi';
import { chatAPI } from '../../utils/api';
import Avatar from '../UI/Avatar';
import type { User, ChatChannel } from '../../types';
import toast from 'react-hot-toast';

interface PrivateMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: (channel?: ChatChannel) => void;
  currentUser?: User;
}

const PrivateMessageModal: React.FC<PrivateMessageModalProps> = ({
  isOpen,
  onClose,
  onMessageSent,
  currentUser: _currentUser, // Not currently used, but reserved for subsequent expansion
}) => {
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const [targetUsername, setTargetUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // Check if there are preselected users
  React.useEffect(() => {
    const selectedUser = (window as any).selectedUserForPM as User;
    if (selectedUser) {
      setTargetUserId(selectedUser.id);
      setTargetUsername(selectedUser.username);
      // Clear global variables
      delete (window as any).selectedUserForPM;
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!targetUserId || !message.trim()) return;

    try {
      setIsLoading(true);
      const result = await chatAPI.createPrivateMessage(targetUserId, message.trim());
      
      toast.success('Private chat sent');
      onMessageSent(result?.channel);
      onClose();
      
      // Reset the form
      setTargetUserId(null);
      setTargetUsername('');
      setMessage('');
      
      // If the creation is successful, you can try to automatically select the newly created channel
      if (result?.channel) {
        console.log('Private chat channel was created successfully:', result.channel);
        // Notify the parent component to select a new channel through a callback
      }
    } catch (error) {
      console.error('Send private chat failed:', error);
      toast.error('Send private chat failed');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Since there is no search interface, the empty result is temporarily displayed here
      toast.error('User search function is not supported yet');
      setSearchResults([]);
    } catch (error) {
      console.error('Search user failed:', error);
      toast.error('Search user failed');
      setSearchResults([]);
    }
  };

  const selectUser = (user: User) => {
    setTargetUserId(user.id);
    setTargetUsername(user.username);
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Background mask */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4"
        >
          {/* head */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Send to a private chat
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* content */}
          <div className="p-6 space-y-4">
            {/* Select a user */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Send to
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for username..."
                  value={targetUsername}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTargetUsername(value);
                    
                    if (value) {
                      // Anti-shake search
                      const timeoutId = setTimeout(() => {
                        searchUsers(value);
                      }, 300);
                      
                      return () => clearTimeout(timeoutId);
                    } else {
                      setSearchResults([]);
                      setTargetUserId(null);
                    }
                  }}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osu-pink focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map(user => (
                    <button
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Avatar
                        userId={user.id}
                        username={user.username}
                        avatarUrl={user.avatar_url}
                        size="sm"
                      />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.country?.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* informationcontent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                informationcontent
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osu-pink focus:border-transparent"
              />
              <div className="flex justify-between mt-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {message.length}/1000
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!targetUserId || !message.trim() || isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-osu-pink text-white rounded-lg hover:bg-osu-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSend size={16} />
              <span>{isLoading ? 'Send...' : 'send'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrivateMessageModal;