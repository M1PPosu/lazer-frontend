import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMessageCircle, FiX } from 'react-icons/fi';
import Avatar from '../UI/Avatar';
import { friendsAPI } from '../../utils/api';
import type { FriendRelation, User } from '../../types';
import toast from 'react-hot-toast';

interface FriendsListProps {
  currentUser?: User; // Reserved parameters (not currently used)
  onStartPrivateChat: (user: User) => void;
  onClose: () => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ currentUser: _currentUser, onStartPrivateChat, onClose }) => {
  const [friends, setFriends] = useState<FriendRelation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load the friend list
  useEffect(() => {
    loadFriends();
  }, []);

  // Add keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('ESCPress the key to close the friend list');
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // debugonCloseCallback
  useEffect(() => {
    console.log('FriendsListComponent mount,onCloseCallback:', onClose);
  }, [onClose]);

  const loadFriends = async () => {
    try {
      setIsLoading(true);
      const friendsData = await friendsAPI.getFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error('Load the friend listfail:', error);
      toast.error('Load the friend listfail');
    } finally {
      setIsLoading(false);
    }
  };

  // Processing private chat starts and closes the list
  const handleStartPrivateChatAndClose = (user: User) => {
    console.log('Select a user for private chat:', user.username);
    onStartPrivateChat(user);
    // Close the friend list now
    onClose();
  };

  // Remove friends
  const removeFriend = async (userId: number) => {
    try {
      await friendsAPI.removeFriend(userId);
      toast.success('alreadyRemove friends');
      // againLoad the friend list
      loadFriends();
    } catch (error) {
      console.error('Remove friendsfail:', error);
      toast.error('Remove friendsfail');
    }
  };



  const filteredFriends = friends.filter(friend => 
    friend.target?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={() => {
        console.log('The background is clicked, close the friend list');
        onClose();
      }}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* head */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Friend Management</h2>
          <button
            onClick={() => {
              console.log('The close button is clicked');
              onClose();
            }}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Title bar */}
        <div className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Friends list ({friends.length})
          </h3>
        </div>

        {/* Content area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {/* Search box */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search for friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-osu-pink focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Friends list */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-osu-pink mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">loading...</p>
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="text-center py-8">
                <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {searchQuery ? 'No matching friend was found' : 'No friends yet'}
                </p>
              </div>
            ) : (
              filteredFriends.map((friend) => (
                <div
                  key={friend.target_id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <Avatar
                    userId={friend.target_id}
                    username={friend.target?.username || 'Unknown user'}
                    avatarUrl={friend.target?.avatar_url}
                    size="md"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {friend.target?.username || 'Unknown user'}
                      </h3>
                      {friend.mutual && (
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                          Pay attention to each other
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {friend.target?.country_code ? `From ${friend.target.country_code}` : 'Unknown area'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        if (friend.target) {
                          handleStartPrivateChatAndClose(friend.target);
                        }
                      }}
                      className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Send a private chat"
                    >
                      <FiMessageCircle size={16} />
                    </button>
                    <button
                      onClick={() => removeFriend(friend.target_id)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Remove friends"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FriendsList;