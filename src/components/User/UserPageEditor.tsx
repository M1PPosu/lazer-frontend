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

  // Check if you have permissions to edit
  const canEdit = currentUser?.id === user.id;

  // Load user page content
  useEffect(() => {
    if (canEdit) {
      setLoading(true);
      setError(null);
      
      // Get page content directly from user objects
      const initialContent = user.page?.raw || '';
      setContent(initialContent);
      setOriginalContent(initialContent);
      setHasChanges(false);
      setLoading(false);
    } else {
      setError('You do not have permission to edit this user page');
      setLoading(false);
    }
  }, [user, canEdit]);

  // Listening content changes
  useEffect(() => {
    setHasChanges(content !== originalContent);
  }, [content, originalContent]);

  // Save the user page
  const handleSave = async () => {
    if (!canEdit || saving) return;

    try {
      setSaving(true);
      setError(null);

      const result = await userAPI.updateUserPage(user.id, content);
      
      setOriginalContent(content);
      setHasChanges(false);
      setError(null);
      setSuccessMessage('The personal page has been saved successfully!');

      if (onSaved) {
        onSaved({
          html: result.html,
          raw: content,
        });
      }

      // Delayed closing to display success message
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1500);
    } catch (err: any) {
      console.error('Failed to save user page:', err);
      const errorMessage = err.response?.data?.error || 'Saving failed, please try again';
      setError(errorMessage);
      setSuccessMessage(null);
    } finally {
      setSaving(false);
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes, are you sure you want to give up editing?')) {
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

  // Shortcut key processing
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
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading in the editor...</span>
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
            This page cannot be edited
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              closure
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* head */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-3">
          <FaEdit className="w-5 h-5 text-pink-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Edit Player page
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              for {user.username} Editor for About Me
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
              There are unsaved changes
            </span>
          )}
          
          <button
            onClick={handleCancel}
            disabled={saving}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cancel Edit (Esc)"
          >
            <FaTimes className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-4">
        <BBCodeEditor
          title="About Me"
          value={content}
          onChange={setContent}
          placeholder={`for ${user.username} Write your About Me...\n\nYou can useBBCodeFormat text, such as:\n[b]Bold text[/b]\n[i]Italic text[/i]\n[color=red]Colorful text[/color]\n\nClick the toolbar button or use shortcut keys to quickly insert the format.`}
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

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Word count: {content.length}/60000</span>
          <span>•</span>
          <span>supportBBCodeFormat</span>
          <span>•</span>
          <span>Ctrl+S save</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving || content.length > 60000}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                <span>savemiddle...</span>
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                <span>save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPageEditor;