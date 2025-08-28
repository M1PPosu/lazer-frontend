import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiUser, FiLogOut, FiHome, FiTrendingUp, FiMusic, FiBell, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationContext } from '../../contexts/NotificationContext';
import UserDropdown from '../UI/UserDropdown';
import Avatar from '../UI/Avatar';
import type { NavItem } from '../../types';

// 将 NavItem 组件提取并使用 memo 优化，防止不必要的重新渲染
const NavItem = memo<{ item: NavItem }>(({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [forceShowText, setForceShowText] = useState(false);
  const prevIsActiveRef = useRef<boolean | undefined>(undefined);
  const location = useLocation();
  const IconComponent = item.icon;
  const isActive = location.pathname === item.path;
  
  // 文字显示逻辑：活跃时强制显示，或者悬停时显示
  const shouldShowText = isActive || forceShowText || isHovered;
  
  // 检测是否是路由切换导致的状态变化
  const isRouteChange = prevIsActiveRef.current !== undefined && 
                       prevIsActiveRef.current !== isActive;
  
  // 更新前一个活跃状态的引用
  useEffect(() => {
    prevIsActiveRef.current = isActive;
    // 如果变为活跃状态，强制显示文本
    if (isActive) {
      setForceShowText(true);
    } else {
      setForceShowText(false);
    }
  }, [isActive]);

  // 使用 useCallback 防止函数重新创建导致重新渲染
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      animate={{ 
        scale: isActive ? 1 : 0.98,
        opacity: isActive ? 1 : 0.75 
      }}
      whileHover={{ 
        scale: 1,
        opacity: 1,
        transition: { duration: 0.2 }
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      onHoverStart={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
      className="relative"
    >
      <Link
        to={item.path}
        className={`relative flex items-center rounded-xl font-medium text-sm transition-all duration-200 group overflow-hidden ${
          isActive
            ? 'text-white bg-osu-pink shadow-lg shadow-osu-pink/25'
            : 'text-gray-600 dark:text-gray-300 hover:text-osu-pink dark:hover:text-osu-pink hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        style={{ 
          paddingLeft: '12px',
          paddingRight: shouldShowText ? '16px' : '12px',
          paddingTop: '8px',
          paddingBottom: '8px'
        }}
      >
        {/* 图标 */}
        {IconComponent && (
          <motion.div
            animate={{ 
              rotate: isHovered && !isActive ? 10 : 0 
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex-shrink-0"
          >
            <IconComponent size={16} />
          </motion.div>
        )}
        
        {/* 文字伸缩效果 */}
        <motion.div
          className="overflow-hidden flex items-center"
          animate={{ 
            width: shouldShowText ? 'auto' : 0,
            marginLeft: shouldShowText ? 8 : 0,
          }}
          transition={{ 
            // 路由切换时不播放动画，只有悬停时才播放动画
            duration: isRouteChange ? 0 : 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <motion.span
            className="whitespace-nowrap"
            animate={{ 
              opacity: shouldShowText ? 1 : 0,
              x: shouldShowText ? 0 : -10
            }}
            transition={{ 
              // 路由切换时不播放动画，只有悬停时才播放动画
              duration: isRouteChange ? 0 : 0.25,
              delay: shouldShowText && !isActive && isHovered ? 0.1 : 0
            }}
          >
            {item.title}
          </motion.span>
        </motion.div>

        {/* 活跃状态指示器 */}
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-2 right-2 h-0.5 bg-white/50 rounded-full"
            layoutId="activeTabIndicator"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        {/* 悬停效果背景 */}
        {!isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-osu-pink/10"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </Link>
    </motion.div>
  );
});

NavItem.displayName = 'NavItem';

// 将 MobileNavItem 组件也提取并使用 memo 优化
const MobileNavItem = memo<{ item: NavItem }>(({ item }) => {
  const location = useLocation();
  const IconComponent = item.icon;
  const isActive = location.pathname === item.path;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex-1 max-w-20" // 限制最大宽度，避免单个元素过宽
    >
      <Link
        to={item.path}
        className={`relative flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-200 w-full ${
          isActive 
            ? 'text-white' 
            : 'text-gray-600 dark:text-gray-400 hover:text-osu-pink'
        }`}
      >
        {isActive && (
          <motion.div 
            className="absolute inset-0 bg-osu-pink rounded-2xl shadow-lg shadow-osu-pink/25"
            layoutId="mobileActiveTab"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        
        <div className="relative z-10 flex flex-col items-center">
          {IconComponent && (
            <div className="mb-1">
              <IconComponent size={20} />
            </div>
          )}
          <span className="text-xs font-medium">{item.title}</span>
        </div>

        {!isActive && (
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-osu-pink/10"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </Link>
    </motion.div>
  );
});

MobileNavItem.displayName = 'MobileNavItem';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  // 通过全局通知上下文获取统一的 unreadCount
  let unreadCount = { total: 0, team_requests: 0, private_messages: 0, friend_requests: 0 } as any;
  let isConnected = false;
  let chatConnected = false;
  try {
    const ctx = useNotificationContext();
    unreadCount = ctx.unreadCount;
    isConnected = ctx.isConnected;
    chatConnected = ctx.chatConnected;
  } catch (e) {
    // 如果 Provider 尚未包裹，不影响其它功能
  }
  
  // 综合连接状态：通知和聊天都需要连接
  const isFullyConnected = isConnected && chatConnected;
  //const location = useLocation();

  const navItems: NavItem[] = React.useMemo(() => [
    { path: '/', title: '主页', icon: FiHome },
    { path: '/rankings', title: '排行榜', icon: FiTrendingUp, requireAuth: true },
    { path: '/beatmaps', title: '谱面', icon: FiMusic, requireAuth: true },
    { path: '/teams', title: '战队', icon: FiUsers, requireAuth: true },
    { path: '/messages', title: '消息', icon: FiMessageCircle, requireAuth: true },
    { path: '/profile', title: '个人资料', icon: FiUser, requireAuth: true },
  ], []);

  const filteredNavItems = React.useMemo(() => 
    navItems.filter(item => 
      !item.requireAuth || (item.requireAuth && isAuthenticated)
    ), [navItems, isAuthenticated]
  );

  // 使用 useCallback 优化回调函数
  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* 使用 grid 布局来确保三个区域的平衡 */}
          <div className="grid grid-cols-3 items-center h-16">
            {/* Logo - Left */}
            <div className="flex items-center justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 group"
              >
                <Link to="/" className="flex items-center space-x-3 transition-transform duration-200">
                  <div className="relative">
                    <img 
                      src="/image/logo.svg" 
                      alt="GuSou Logo" 
                      className="w-9 h-9 object-contain"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-osu-pink rounded-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <span className="text-xl font-bold text-osu-pink">
                    咕哦！
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Navigation Links - Center (真正居中) */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {filteredNavItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center justify-end space-x-3">
              {/* Notification (if authenticated) */}
              {isAuthenticated && (
                <Link to="/messages">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      relative p-2.5 rounded-xl transition-all duration-200 group
                      ${isFullyConnected 
                        ? 'text-gray-600 dark:text-gray-300 hover:text-osu-pink hover:bg-gray-50 dark:hover:bg-gray-800/50' 
                        : 'text-gray-400 dark:text-gray-500'
                      }
                    `}
                    /* title={isFullyConnected ? '实时通知已连接' : '实时通知未连接'} */
                  >
                    <FiBell size={18} />
                    {unreadCount.total > 0 && (
                      <motion.div 
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {unreadCount.total > 99 ? '99+' : unreadCount.total}
                      </motion.div>
                    )}
                    {/* WebSocket连接状态指示器 */}
                    {/* <div className={`
                      absolute bottom-0 right-0 w-2 h-2 rounded-full
                      ${isFullyConnected ? 'bg-green-500' : 'bg-red-500'}
                    `} /> */}
                  </motion.button>
                </Link>
              )}

              {/* Theme toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleThemeToggle}
                className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-osu-pink hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                aria-label="Toggle theme"
              >
                <motion.div
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                </motion.div>
              </motion.button>

              {/* User actions */}
              {isAuthenticated && user ? (
                <UserDropdown user={user} onLogout={handleLogout} />
              ) : (
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="px-5 py-2.5 text-sm font-medium text-osu-blue hover:text-osu-blue/80 border border-osu-blue/30 hover:border-osu-blue/50 rounded-xl hover:bg-osu-blue/5 transition-all duration-200"
                    >
                      登录
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="px-5 py-2.5 text-sm font-medium text-white bg-osu-pink hover:bg-osu-pink/90 rounded-xl shadow-lg shadow-osu-pink/25 hover:shadow-osu-pink/35 transition-all duration-200"
                    >
                      注册
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header - Top */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/image/logo.svg" 
                  alt="GuSou Logo" 
                  className="w-8 h-8 object-contain"
                />
                <motion.div 
                  className="absolute inset-0 bg-osu-pink rounded-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className="text-lg font-bold text-osu-pink">
                咕哦！
              </span>
            </Link>
          </motion.div>

          {/* Mobile actions */}
          <div className="flex items-center space-x-2">
            {/* Notification (if authenticated) */}
            {isAuthenticated && (
              <Link to="/messages">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    relative p-2.5 rounded-xl transition-all duration-200
                    ${isFullyConnected 
                      ? 'text-gray-600 dark:text-gray-300 hover:text-osu-pink hover:bg-gray-50 dark:hover:bg-gray-800/50' 
                      : 'text-gray-400 dark:text-gray-500'
                    }
                  `}
                >
                  <FiBell size={16} />
                  {unreadCount.total > 0 && (
                    <motion.div 
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {unreadCount.total > 9 ? '9+' : unreadCount.total}
                    </motion.div>
                  )}
                  {/* WebSocket连接状态指示器 */}
                  <div className={`
                    absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full
                    ${isFullyConnected ? 'bg-green-500' : 'bg-red-500'}
                  `} />
                </motion.button>
              </Link>
            )}

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleThemeToggle}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-osu-pink hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              <motion.div
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
              </motion.div>
            </motion.button>

            {/* User actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                {/* User Avatar */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/profile" className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
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
                    </div>
                  </Link>
                </motion.div>
                
                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                  aria-label="Logout"
                >
                  <FiLogOut size={16} />
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-osu-pink hover:text-osu-pink/80 bg-osu-pink/10 hover:bg-osu-pink/15 rounded-xl transition-all duration-200"
                >
                  登录
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom (页面导航) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg safe-area-inset-bottom">
        <div className="flex items-center justify-center py-2 px-2">
          {filteredNavItems.map((item) => (
            <MobileNavItem key={item.path} item={item} />
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;