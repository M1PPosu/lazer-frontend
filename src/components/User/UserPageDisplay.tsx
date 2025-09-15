import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { FaEdit, FaUser } from 'react-icons/fa';
import ContentContainer from '../UI/ContentContainer';
import UserPageEditModal from './UserPageEditModal';

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

  // 移除图片边框的样式优化
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

  // 检查是否可以编辑（仅自己的页面）
  const canEdit = currentUser?.id === user.id;

  // 从用户对象中获取页面内容
  const userPage = user.page;
  const hasContent = userPage?.html && userPage.html.trim();

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleModalSave = (updatedUser: User) => {
    onUserUpdate?.(updatedUser);
  };

  // 没有内容的空状态
  if (!hasContent) {
    return (
      <div className={className}>
        {canEdit ? (
          // 自己的页面：显示编辑按钮
          <div className="text-center py-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                个人介绍
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                还没有写个人介绍
              </p>
            </div>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-6 py-3 bg-osu-pink hover:bg-pink-600 text-white rounded-lg transition-colors mx-auto"
            >
              <FaEdit className="w-4 h-4" />
              <span>编写个人介绍</span>
            </button>
          </div>
        ) : (
          // 其他人的页面：显示空状态
          <div className="text-center py-8">
            <FaUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {user.username} 还没有写个人介绍
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              这里还是空的
            </p>
          </div>
        )}

        {/* 编辑模态框 */}
        <UserPageEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onSave={handleModalSave}
        />
      </div>
    );
  }

  // 有内容的正常显示
  return (
    <div className={className}>
      {/* 头部编辑按钮 */}
      {canEdit && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-osu-pink hover:bg-pink-600 text-white rounded-lg transition-colors"
          >
            <FaEdit className="w-3 h-3" />
            <span>编辑</span>
          </button>
        </div>
      )}

      {/* 内容 */}
      <ContentContainer maxHeight={500} className="user-page-content">
        <div 
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: userPage.html }}
        />
      </ContentContainer>

      {/* 编辑模态框 */}
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