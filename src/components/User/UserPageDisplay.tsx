import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { FaEdit, FaUser } from 'react-icons/fa';
import ContentContainer from '../UI/ContentContainer';
import UserPageEditModal from './UserPageEditModal';
import { parseBBCode } from '../../utils/bbcodeParser';

interface UserPageDisplayProps {
  user: User;
  onUserUpdate?: (user: User) => void;
  className?: string;
}

const UserPageDisplay: React.FC<UserPageDisplayProps> = ({
  user,
  onUserUpdate,
  className = '',
}) => {
  const { user: currentUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Remove the style optimization of image borders
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .user-page-content img {
        border: none !important;
        outline: none !important;
        max-width: 100%;
        height: auto;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Check if it can be edited (only its own page)
  const canEdit = currentUser?.id === user.id;

  // Get page content from user object
  const userPage = user.page;
  // More robust content checks: CheckHTMLOr original content
  const hasContent = (userPage?.html && userPage.html.trim()) || 
                    (userPage?.raw && userPage.raw.trim());

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleModalSave = (updatedUser: User) => {
    onUserUpdate?.(updatedUser);
  };

  // Empty status without content
  if (!hasContent) {
    return (
      <div className={className}>
        {canEdit ? (
          // Your own page: Show edit button
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="flex justify-center items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-osu-pink rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  About Me
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Haven't written yet!
              </p>
            </div>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-6 py-3 bg-osu-pink hover:bg-pink-600 text-white rounded-lg transition-colors mx-auto"
            >
              <FaEdit className="w-4 h-4" />
              <span>About Me</span>
            </button>
          </div>
        ) : (
          // Other people's page: Show empty status
          <div className="text-center py-8">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-osu-pink rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                About Me
              </h3>
            </div>
            <FaUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {user.username} About Me
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              It's still empty here...
            </p>
          </div>
        )}

        {/* Edit modal box */}
        <UserPageEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onSave={handleModalSave}
        />
      </div>
    );
  }

  // Normal display of content
  return (
    <div className={className}>
      {/* Header title and edit buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-osu-pink rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            About Me
          </h3>
        </div>
        {canEdit && (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-osu-pink hover:bg-pink-600 text-white rounded-lg transition-colors"
          >
            <FaEdit className="w-3 h-3" />
            <span>edit</span>
          </button>
        )}
      </div>

      {/* content */}
      <ContentContainer maxHeight={500} className="user-page-content">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {userPage.html ? (
            <div dangerouslySetInnerHTML={{ __html: userPage.html }} />
          ) : userPage.raw ? (
            // If notHTMLBut there is the originalcontent, use localBBCodeParser
            <div dangerouslySetInnerHTML={{ __html: parseBBCode(String(userPage.raw || '')).html }} />
          ) : (
            <div className="text-gray-500 dark:text-gray-400 italic">
              In progress...
            </div>
          )}
        </div>
      </ContentContainer>

      {/* Edit modal box */}
      <UserPageEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default UserPageDisplay;