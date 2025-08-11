import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiLogOut, FiHome, FiTrendingUp, FiMusic } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import UserDropdown from '../UI/UserDropdown';
import Avatar from '../UI/Avatar';
import type { NavItem } from '../../types';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();



  const navItems: NavItem[] = [
    { path: '/', title: '主页', icon: FiHome },
    { path: '/rankings', title: '排行榜', icon: FiTrendingUp },
    { path: '/beatmaps', title: '谱面', icon: FiMusic },
    { path: '/profile', title: '个人资料', icon: FiUser, requireAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.requireAuth || (item.requireAuth && isAuthenticated)
  );

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src="/logo.png" 
                  alt="GuSou Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold gradient-text">
                  GuSou! 
                </span>
              </Link>
            </div>

            {/* Navigation Links - Center */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center space-x-8">
                {filteredNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-link flex items-center ${
                        location.pathname === item.path ? 'active' : ''
                      }`}
                    >
                      {IconComponent && <IconComponent size={16} className="mr-2" />}
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex-shrink-0 flex items-center space-x-4">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-osu-pink dark:hover:text-osu-pink transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* User actions */}
              {isAuthenticated && user ? (
                <UserDropdown user={user} onLogout={logout} />
              ) : (
                <div className="flex items-center space-x-3">
                                  <Link
                  to="/login"
                  className="btn-secondary !px-4 !py-2 text-sm"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !px-4 !py-2 text-sm"
                >
                  注册
                </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header - Top */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="GuSou Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold gradient-text">GuSou!</span>
          </Link>

          {/* Mobile actions */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-osu-pink transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* User actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <Link to="/profile" className="flex items-center space-x-2">
                  <Avatar
                    userId={user.id}
                    username={user.username}
                    avatarUrl={user.avatar_url}
                    size="sm"
                  />
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-16 truncate leading-tight">
                      {user.username}
                    </span>
                    {user.is_supporter && (
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 leading-tight">
                        ⭐
                      </span>
                    )}
                  </div>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                  aria-label="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-osu-pink hover:text-osu-purple transition-colors"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom (页面导航) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2">
          {filteredNavItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? 'text-osu-pink' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {IconComponent && <IconComponent size={22} className="mb-1" />}
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
