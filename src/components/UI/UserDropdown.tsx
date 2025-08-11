import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import Avatar from './Avatar';
import type { User } from '../../types';

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar/Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-osu-pink dark:hover:text-osu-pink hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      >
        {/* Avatar */}
        <Avatar
          userId={user.id}
          username={user.username}
          avatarUrl={user.avatar_url}
          size="sm"
        />
        
        {/* Username */}
        <span className="hidden sm:inline font-medium max-w-24 truncate">
          {user.username}
        </span>
        
        {/* Dropdown Icon */}
        <FiChevronDown 
          size={14} 
          className={`hidden sm:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {user.username}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email || '邮箱未设置'}
            </p>
            {user.is_supporter && (
              <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                支持者
              </span>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-osu-pink transition-colors"
            >
              <FiUser size={16} className="mr-3" />
              个人资料
            </Link>
            
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-osu-pink transition-colors"
            >
              <FiSettings size={16} className="mr-3" />
              设置
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <FiLogOut size={16} className="mr-3" />
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
