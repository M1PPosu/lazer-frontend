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
      document.body.style.overflow = 'hidden';

      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !e.defaultPrevented) onClose();
      };
      document.addEventListener('keydown', handleGlobalKeyDown);

      return () => {
        document.removeEventListener('keydown', handleGlobalKeyDown);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, user.page?.raw, onClose]);

  const handleSave = async () => {
    if (!currentUser || currentUser.id !== user.id) return;

    setIsSaving(true);
    try {
      const response = await userAPI.updateUserPage(currentUser.id, content);

      let html = '';
      if (response.html) html = response.html;
      else if (response.data?.html) html = response.data.html;
      else if (response.preview?.html) html = response.preview.html;
      else {
        try {
          const validationResult = await userAPI.validateBBCode(content);
          if (validationResult.preview?.html) html = validationResult.preview.html;
        } catch {
          html = content.replace(/\n/g, '<br>');
        }
      }

      const updatedUser = { ...user, page: { raw: content, html } };
      onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error('Saving failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(user.page?.raw || '');
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();
  const handleModalContentMouseDown = (e: React.MouseEvent) => e.stopPropagation();
  const handleModalContentMouseUp = (e: React.MouseEvent) => e.stopPropagation();

  const [mouseDownTarget, setMouseDownTarget] = useState<EventTarget | null>(null);
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);
  const [mouseDownPosition, setMouseDownPosition] = useState<{ x: number; y: number } | null>(null);

  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    setMouseDownTarget(e.target);
    setMouseDownTime(Date.now());
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
  };

  const handleBackdropMouseUp = (e: React.MouseEvent) => {
    const timeDiff = Date.now() - mouseDownTime;
    const isQuickClick = timeDiff < 200;
    const distance = mouseDownPosition
      ? Math.hypot(e.clientX - mouseDownPosition.x, e.clientY - mouseDownPosition.y)
      : 0;
    const isStationary = distance < 5;

    if (e.target === e.currentTarget && mouseDownTarget === e.target && (isQuickClick || isStationary)) {
      onClose();
    }

    setMouseDownTarget(null);
    setMouseDownTime(0);
    setMouseDownPosition(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-start justify-center
        p-2 sm:p-4 pt-20 sm:pt-24 md:pt-28
        bg-gradient-to-b from-black/60 via-black/50 to-black/40
        backdrop-blur-sm
      "
      onMouseDown={handleBackdropMouseDown}
      onMouseUp={handleBackdropMouseUp}
    >
      <div
        className="
          w-full max-w-7xl mx-2 sm:mx-0 my-2 sm:my-0
          flex flex-col
          rounded-2xl border border-gray-200/60 dark:border-white/10
          bg-gradient-to-r from-[#f6f2ff]/95 to-[#ffeaf4]/90
          dark:from-[#1b203a]/95 dark:to-[#2a2233]/95
          shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_60px_-20px_rgba(0,0,0,0.55),0_0_60px_rgba(237,142,166,0.10)]
          /* keep the whole modal inside viewport with NO outer scrolling */
          max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-7rem)]
          overflow-hidden
        "
        onClick={handleModalContentClick}
        onMouseDown={handleModalContentMouseDown}
        onMouseUp={handleModalContentMouseUp}
      >
        {/* header (fixed) */}
        <div
          className="
            flex items-center justify-between
            p-4 md:p-6 flex-shrink-0
            border-b border-gray-200/60 dark:border-white/10
            bg-white/55 dark:bg-white/5 backdrop-blur-sm
          "
        >
          <h2
            className="
              text-lg md:text-xl font-semibold
              text-transparent bg-clip-text
              bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6]
            "
          >
            Editor of About Me
          </h2>
          <button
            onClick={onClose}
            className="
              group rounded-full p-2
              text-gray-500 hover:text-gray-900
              dark:text-gray-300 dark:hover:text-gray-100
              transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40
              bg-white/0 hover:bg-white/40 dark:hover:bg-white/10
            "
            aria-label="Close"
          >
            <FaTimes className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* content container (flex-1, NO scrollbars here) */}
        <div className="flex-1 min-h-0 p-4 md:p-6 overflow-hidden">
          {/* Give the editor a stable viewport height so it handles its own scrolling */}
          <div className="h-[56vh] sm:h-[60vh] md:h-[62vh]">
            <BBCodeEditor
              title="About Me"
              value={content}
              onChange={setContent}
              placeholder="Use BBCode to write your About Me..."
              className="
                h-full
                [&_.bbcode-editor-toolbar]:bg-white/60 dark:[&_.bbcode-editor-toolbar]:bg-white/10
                [&_.bbcode-editor-toolbar]:backdrop-blur-sm
                [&_.bbcode-editor-toolbar]:border [&_.bbcode-editor-toolbar]:border-gray-200/60 dark:[&_.bbcode-editor-toolbar]:border-white/10
                [&_.bbcode-editor-area]:bg-white/40 dark:[&_.bbcode-editor-area]:bg-white/5
                [&_.bbcode-editor-area]:border [&_.bbcode-editor-area]:border-gray-200/60 dark:[&_.bbcode-editor-area]:border-white/10
                [&_.bbcode-editor-area]:rounded-lg
              "
            />
          </div>
        </div>

        {/* footer (fixed) */}
        <div
          className="
            flex items-center justify-end gap-3
            p-4 md:p-6 flex-shrink-0
            border-t border-gray-200/60 dark:border-white/10
            bg-white/55 dark:bg-white/5 backdrop-blur-sm
          "
        >
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="
              px-4 py-2 rounded-lg
              text-gray-800 dark:text-gray-200
              border border-gray-300/70 dark:border-white/15
              bg-white/50 dark:bg-white/5
              hover:bg-white/70 dark:hover:bg-white/10
              transition-colors disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-purple-400/40
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="
              inline-flex items-center gap-2 px-5 md:px-6 py-2.5
              rounded-lg text-white
              bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6]
              shadow-[0_10px_22px_rgba(139,92,246,0.35)]
              hover:brightness-[1.03] active:translate-y-[1px]
              transition disabled:opacity-60 disabled:shadow-none
              focus:outline-none focus:ring-2 focus:ring-purple-400/40
            "
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/90 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPageEditModal;
