import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCheck, FiX, FiImage, FiCamera } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userAPI } from '../utils/api';
import EditableCover from '../components/UI/EditableCover';
import Avatar from '../components/UI/Avatar';
import AvatarUpload from '../components/UI/AvatarUpload';

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-osu-pink"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Unable to load settings!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  const handleStartEdit = () => {
    setNewUsername(user.username);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewUsername('');
  };

  const handleSubmitUsername = async () => {
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty.');
      return;
    }

    if (newUsername.trim() === user.username) {
      toast.error('The new username is the same as the current username!');
      return;
    }

    setIsSubmitting(true);
    try {
      await userAPI.rename(newUsername.trim());
      
      toast.success('Username modification was successful!');
      setIsEditing(false);
      setNewUsername('');
      
      // Delayed refresh of user information to avoid immediate refresh resulting in avatar cache problems
      setTimeout(async () => {
        await refreshUser();
      }, 1000);
    } catch (error) {
      console.error('Failed to modify the username:', error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 409) {
        toast.error('The username is already used, please select another username.');
      } else if (err.response?.status === 404) {
        toast.error('The specified user cannot be found!');
      } else {
        toast.error('Failed to modify the username, please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpdate = async (newAvatarUrl: string) => {
    console.log('Avatar updated successfully:', newAvatarUrl);
    toast.success('The avatar was modified successfully!');
    setShowAvatarUpload(false);
    
    // Delayed refresh of user information
    setTimeout(async () => {
      await refreshUser();
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your Account Settings.
        </p>
      </motion.div>

      {/* Username settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiUser className="w-6 h-6 text-osu-pink" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Username settings
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current username
            </label>
            {!isEditing ? (
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.username}
                </span>
                <button
                  onClick={handleStartEdit}
                  className="btn-secondary !px-4 !py-2 text-sm"
                >
                  Modify username
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-osu-pink focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter a new username"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    After the user name is modified, your original user name will be saved in the user history.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitUsername}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 btn-primary !px-4 !py-2 !text-sm !inline-flex disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck className="w-4 h-4" />
                    {isSubmitting ? 'Saving...' : 'save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 btn-secondary !px-4 !py-2 !text-sm !inline-flex disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Avatar settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiCamera className="w-6 h-6 text-osu-pink" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Avatar settings
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current avatar
            </label>
            <div className="flex items-center gap-4">
              <Avatar
                userId={user.id}
                username={user.username}
                avatarUrl={user.avatar_url}
                size="lg"
                shape="rounded"
                editable={false}
                className="!w-16 !h-16"
              />
              <div className="flex-1">
                <button
                  onClick={() => setShowAvatarUpload(true)}
                  className="btn-primary !px-4 !py-2 text-sm flex items-center gap-2"
                >
                  <FiCamera className="w-4 h-4" />
                  Modify avatar
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  support PNG,JPEG,GIF Format, recommended size 256x256 Pixel, maximum 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header image settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiImage className="w-6 h-6 text-osu-pink" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Header image settings
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile header
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Suggested size:2000x500 Pixels (official recommendation 4:1 Proportion),support PNG,JPEG,GIF Format, maximum 10MB
            </p>
            <EditableCover
              userId={user.id}
              username={user.username}
              coverUrl={user.cover_url}
              editable={true}
              onCoverUpdate={(newCoverUrl) => {
                if (import.meta.env.DEV) {
                  console.log('The header image has been updated:', newCoverUrl);
                }
                // Here you can choose whether to refresh the user information immediately
                // Not refreshing for the time being, allowing users to see the update effect
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* User Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Account information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              user ID
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-900 dark:text-white font-mono">
                {user.id}
              </span>
            </div>
          </div>

          {user.join_date && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration time
              </label>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white">
                  {new Date(user.join_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}

          {user.country && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                nation/area
              </label>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w20/${user.country.code.toLowerCase()}.png`}
                    alt={user.country.code}
                    className="w-5 h-auto"
                  />
                  <span className="text-gray-900 dark:text-white">
                    {user.country.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {user.last_visit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last visit
              </label>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white">
                  {new Date(user.last_visit).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Avatar upload modal box */}
      {showAvatarUpload && (
        <AvatarUpload
          userId={user.id}
          currentAvatarUrl={user.avatar_url}
          onUploadSuccess={handleAvatarUpdate}
          onClose={() => setShowAvatarUpload(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;