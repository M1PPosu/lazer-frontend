import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiUser, FiLogOut, FiHome, FiTrendingUp, FiMusic, FiBell, FiUsers, FiMessageCircle, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationContext } from '../../contexts/NotificationContext';
import UserDropdown from '../UI/UserDropdown';
import Avatar from '../UI/Avatar';
import type { NavItem } from '../../types';

// Will NavItem Component extraction and use memo Optimize to prevent unnecessary re-rendering
const NavItem = memo<{ item: NavItem }>(({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [forceShowText, setForceShowText] = useState(false);
  const prevIsActiveRef = useRef<boolean | undefined>(undefined);
  const location = useLocation();
  const IconComponent = item.icon;
  const isActive = location.pathname === item.path;
  
  // Text display logic: Forced display when active, or hover
  const shouldShowText = isActive || forceShowText || isHovered;
  
  // Detect whether it is a state change caused by routing switching
  const isRouteChange = prevIsActiveRef.current !== undefined && 
                       prevIsActiveRef.current !== isActive;
  
  // Update the reference to the previous active state
  useEffect(() => {
    prevIsActiveRef.current = isActive;
    // If active, force text to be displayed
    if (isActive) {
      setForceShowText(true);
    } else {
      setForceShowText(false);
    }
  }, [isActive]);

  // use useCallback Prevent function recreation resulting in rerendering
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
        className={`nav-link relative flex items-center rounded-xl font-medium text-sm transition-all duration-200 group overflow-hidden ${isActive ? 'active' : ''}`}
        style={{ 
          paddingLeft: '12px',
          paddingRight: shouldShowText ? '16px' : '12px',
          paddingTop: '8px',
          paddingBottom: '8px'
        }}
      >
        {/* icon */}
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
        
        {/* Text retractable effect */}
        <motion.div
          className="overflow-hidden flex items-center"
          animate={{ 
            width: shouldShowText ? 'auto' : 0,
            marginLeft: shouldShowText ? 8 : 0,
          }}
          transition={{ 
            // No animation is played during route switching, only animation is played during hovering
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
              // No animation is played during route switching, only animation is played during hovering
              duration: isRouteChange ? 0 : 0.25,
              delay: shouldShowText && !isActive && isHovered ? 0.1 : 0
            }}
          >
            {item.title}
          </motion.span>
        </motion.div>

        {/* Active status indicator */}
        {isActive && (
          <motion.div 
            className="absolute bottom-0 left-2 right-2 h-0.5 bg-white/50 rounded-full"
            layoutId="activeTabIndicator"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
});

NavItem.displayName = 'NavItem';

// Mobile menu pull-down component
const MobileMenuDropdown = memo<{ 
  items: NavItem[];
  isAuthenticated: boolean;
}>(({ items, isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close the drop-down menu
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Switch the drop-down menu
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Click External Close
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

  // Close the menu when routing changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Menu Buttons */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={`p-2.5 rounded-xl transition-all duration-200 ${
          isOpen
            ? 'text-osu-pink bg-osu-pink/10'
            : 'text-gray-600 dark:text-gray-300 hover:text-osu-pink hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
        aria-label="Toggle menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </motion.div>
      </motion.button>

      {/* Pull-down menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.95,
              y: -10
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              y: -10
            }}
            transition={{ 
              duration: 0.15,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="absolute right-0 mt-6 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50 overflow-hidden"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Menu Items */}
            <div className="py-1">
              {items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleClose}
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-osu-pink bg-osu-pink/10'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-osu-pink'
                    }`}
                  >
                    {IconComponent && <IconComponent size={16} className="mr-3" />}
                    <span>{item.title}</span>
                    {isActive && (
                      <motion.div 
                        className="ml-auto w-2 h-2 bg-osu-pink rounded-full"
                        layoutId="mobileDropdownActiveIndicator"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
              
              {/* Settings button - Shown only when logged in */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-1" />
                  <Link
                    to="/settings"
                    onClick={handleClose}
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      location.pathname === '/settings'
                        ? 'text-osu-pink bg-osu-pink/10'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-osu-pink'
                    }`}
                  >
                    <FiSettings size={16} className="mr-3" />
                    <span>Profile Settings</span>
                    {location.pathname === '/settings' && (
                      <motion.div 
                        className="ml-auto w-2 h-2 bg-osu-pink rounded-full"
                        layoutId="mobileDropdownActiveIndicator"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </>
              )}
            </div>

            {/* Decorative gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-osu-pink/5 via-transparent to-osu-blue/5 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MobileMenuDropdown.displayName = 'MobileMenuDropdown';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  // ---- type-safe unreadCount ----
  type UnreadCount = {
    total: number;
    team_requests: number;
    private_messages: number;
    friend_requests: number;
  };

  let unreadCount: UnreadCount = { total: 0, team_requests: 0, private_messages: 0, friend_requests: 0 };
  let isConnected = false;
  let chatConnected = false;
  try {
    const ctx = useNotificationContext();
    unreadCount = ctx.unreadCount as UnreadCount;
    isConnected = ctx.isConnected;
    chatConnected = ctx.chatConnected;
  } catch {
    // if Provider Not yet packaged, does not affect other functions
  }
  
  // Comprehensive connection status: notifications and chats require connection
  const isFullyConnected = isConnected && chatConnected;

  // ---- NEW: scroll-aware nav state ----
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: NavItem[] = React.useMemo(() => [
    { path: '/', title: 'Home page', icon: FiHome },
    { path: '/rankings', title: 'Leaderboard', icon: FiTrendingUp, requireAuth: true },
    { path: 'https://catboy.best/search', title: 'Beatmaps', icon: FiMusic, requireAuth: true },
    { path: '/teams', title: 'Teams', icon: FiUsers, requireAuth: true },
    { path: '/messages', title: 'Chat', icon: FiMessageCircle, requireAuth: true },
    { path: '/profile', title: 'Your Profile', icon: FiUser, requireAuth: true },
  ], []);

  const filteredNavItems = React.useMemo(() => 
    navItems.filter(item => 
      !item.requireAuth || (item.requireAuth && isAuthenticated)
    ), [navItems, isAuthenticated]
  );

  // use useCallback Optimize callback function
  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-200 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-900/80 shadow-md border-gray-200/70 dark:border-gray-700/70'
            : 'bg-white/90 dark:bg-gray-900/90 shadow-sm border-gray-200/50 dark:border-gray-700/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* use grid Layout to ensure balance of three areas */}
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
                      src="/image/logos/logo.svg" 
                      alt="M1Lazer Logo" 
                      className="w-9 h-9 object-contain"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-osu-pink rounded-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <span className="text-xl font-bold gradient-text">
                    M1Lazer
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Navigation Links - Center (Really centered) */}
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
                      Log in
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
                      Register
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header - Top */}
      <nav
        className={`md:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-200 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-900/80 shadow-md border-gray-200/70 dark:border-gray-700/70'
            : 'bg-white/90 dark:bg-gray-900/90 shadow-sm border-gray-200/50 dark:border-gray-700/50'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/image/logos/logo.svg" 
                  alt="M1Lazer Logo" 
                  className="w-8 h-8 object-contain"
                />
                <motion.div 
                  className="absolute inset-0 bg-osu-pink rounded-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className="text-lg font-bold gradient-text">
                M1Lazer
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
                  {/* WebSocketConnection status indicator */}
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
                  <Link to="/profile" className="flex items-center p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                    <Avatar
                      userId={user.id}
                      username={user.username}
                      avatarUrl={user.avatar_url}
                      size="sm"
                    />
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
                  Log in
                </Link>
              </motion.div>
            )}

            {/* Mobile menu dropdown */}
            <MobileMenuDropdown 
              items={filteredNavItems}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </nav>

    </>
  );
};

export default Navbar;