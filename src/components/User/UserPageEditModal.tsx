import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import type { User } from '../../types';
import BBCodeEditor from './BBCodeEditor';
import { userAPI } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

interface UserPageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
}

const UserPageEditModal: React.FC<UserPageEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const { user: currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent(user.page?.raw || '');
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
      
      // 添加键盘事件监听
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      // 恢复背景滚动
      document.body.style.overflow = 'unset';
    }

    // 清理函数
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, user.page?.raw, onClose]);

  const handleSave = async () => {
    if (!currentUser || currentUser.id !== user.id) return;

    setIsSaving(true);
    try {
      const response = await userAPI.updateUserPage(currentUser.id, content);
      
      // 更新用户数据
      const updatedUser = {
        ...user,
        page: response.data
      };
      
      onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
      // 这里可以添加错误提示
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(user.page?.raw || '');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            编辑个人介绍
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          <BBCodeEditor
            value={content}
            onChange={setContent}
            placeholder="使用 BBCode 编写你的个人介绍..."
            className="min-h-[60vh] h-full"
          />
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-osu-pink hover:bg-pink-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                保存
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPageEditModal;