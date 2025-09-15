import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import type { UserPage, User } from '../../types';
import BBCodeEditor from './BBCodeEditor';
import LoadingSpinner from '../UI/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { FaSave, FaTimes, FaEdit } from 'react-icons/fa';

interface UserPageEditorProps {
  user: User;
  onClose?: () => void;
  onSaved?: (newContent: UserPage) => void;
  className?: string;
}

const UserPageEditor: React.FC<UserPageEditorProps> = ({
  user,
  onClose,
  onSaved,
  className = '',
}) => {
  const { user: currentUser } = useAuth();
  
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 检查是否有权限编辑
  const canEdit = currentUser?.id === user.id;

  // 加载用户页面内容
  useEffect(() => {
    if (canEdit) {
      setLoading(true);
      setError(null);
      
      // 直接从用户对象获取页面内容
      const initialContent = user.page?.raw || '';
      setContent(initialContent);
      setOriginalContent(initialContent);
      setHasChanges(false);
      setLoading(false);
    } else {
      setError('您没有权限编辑此用户的页面');
      setLoading(false);
    }
  }, [user, canEdit]);

  // 监听内容变化
  useEffect(() => {
    setHasChanges(content !== originalContent);
  }, [content, originalContent]);

  // 保存用户页面
  const handleSave = async () => {
    if (!canEdit || saving) return;

    try {
      setSaving(true);
      setError(null);

      const result = await userAPI.updateUserPage(user.id, content);
      
      setOriginalContent(content);
      setHasChanges(false);
      setError(null);
      setSuccessMessage('个人页面已保存成功！');

      if (onSaved) {
        onSaved({
          html: result.html,
          raw: content,
        });
      }

      // 延迟关闭以显示成功消息
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1500);
    } catch (err: any) {
      console.error('Failed to save user page:', err);
      const errorMessage = err.response?.data?.error || '保存失败，请重试';
      setError(errorMessage);
      setSuccessMessage(null);
    } finally {
      setSaving(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('您有未保存的更改，确定要放弃编辑吗？')) {
        setContent(originalContent);
        setHasChanges(false);
        if (onClose) {
          onClose();
        }
      }
    } else {
      if (onClose) {
        onClose();
      }
    }
  };

  // 快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (canEdit && hasChanges && !saving) {
          handleSave();
        }
      }
      
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canEdit, hasChanges, saving]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">加载编辑器中...</span>
        </div>
      </div>
    );
  }

  if (error && !canEdit) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center py-12">
          <FaEdit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            无法编辑此页面
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              关闭
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-3">
          <FaEdit className="w-5 h-5 text-pink-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              编辑个人页面
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              为 {user.username} 编辑个人介绍
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
              有未保存的更改
            </span>
          )}
          
          <button
            onClick={handleCancel}
            disabled={saving}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="取消编辑 (Esc)"
          >
            <FaTimes className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="p-4">
        <BBCodeEditor
          title="个人介绍"
          value={content}
          onChange={setContent}
          placeholder={`为 ${user.username} 编写个人介绍...\n\n你可以使用BBCode格式化文本，比如：\n[b]粗体文本[/b]\n[i]斜体文本[/i]\n[color=red]彩色文本[/color]\n\n点击工具栏按钮或使用快捷键来快速插入格式。`}
          disabled={saving}
          className="min-h-[400px]"
        />

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>字数: {content.length}/60000</span>
          <span>•</span>
          <span>支持BBCode格式</span>
          <span>•</span>
          <span>Ctrl+S 保存</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving || content.length > 60000}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                <span>保存</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPageEditor;