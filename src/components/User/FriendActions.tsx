import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiUserPlus,
  FiShield,
  FiShieldOff,
  FiHeart,
  FiLoader,
  FiUsers,
  FiUser,
  FiUserCheck,
  FiUserMinus,
} from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

/** ===================== 类型定义 ===================== */
export type FriendshipStatus = {
  isFriend: boolean;
  isBlocked: boolean;
  isMutual: boolean;
  followsMe: boolean;
  loading: boolean;
};

interface FriendActionsProps {
  status: FriendshipStatus;
  onAdd: () => void | Promise<void>;
  onRemove: () => void | Promise<void>;
  onBlock: () => void | Promise<void>;
  onUnblock: () => void | Promise<void>;
  followerCount?: number;
  className?: string;
  /** 是否是自己（为 true 禁用所有操作） */
  isSelf?: boolean;
}

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  action: () => void | Promise<void>;
  className?: string;
};

/** ===================== 主组件 ===================== */
const FriendActions: React.FC<FriendActionsProps> = ({
  status,
  onAdd,
  onRemove,
  onBlock,
  onUnblock,
  followerCount = 0,
  className = "",
  isSelf = false,
}) => {
  const { isFriend, isBlocked, isMutual, followsMe, loading } = status;
  
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // osu! 单向好友系统菜单配置
  const menuItems: MenuItem[] = useMemo(() => {
    if (isSelf) return [];

    // 已屏蔽状态
    if (isBlocked) {
      return [
        {
          key: "unblock",
          label: "取消屏蔽",
          icon: (
            <span className="relative flex items-center justify-center w-4 h-4">
              <FiShieldOff className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </span>
          ),
          action: onUnblock,
          className: "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 font-medium",
        },
      ];
    }
    
    // 已关注状态 (我关注了对方)
    if (isFriend) {
      const items = [
        {
          key: "remove",
          label: isMutual ? "取消互相关注" : "取消关注",
          icon: (
            <span className="relative flex items-center justify-center w-4 h-4">
              {isMutual ? (
                // 互相关注 - 双人图标 + 心形
                <>
                  <FiUsers className="w-4 h-4 text-pink-500" />
                  <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-pink-400 fill-current" />
                </>
              ) : (
                // 单向关注 - 用户图标 + 减号
                <>
                  <FiUser className="w-4 h-4" />
                  <FiUserMinus className="absolute -top-0.5 -right-0.5 w-2 h-2 text-orange-500" />
                </>
              )}
            </span>
          ),
          action: onRemove,
          className: isMutual 
            ? "text-pink-600 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-500/10 font-medium" 
            : "text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10 font-medium",
        },
      ];

      // 添加屏蔽选项
      items.push({
        key: "block",
        label: "屏蔽用户",
        icon: (
          <span className="relative flex items-center justify-center w-4 h-4">
            <FiShield className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </span>
        ),
        action: onBlock,
        className: "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 font-medium",
      });

      return items;
    }
    
    // 未关注状态
    const items = [
      {
        key: "add",
        label: followsMe ? "回关 (互相关注)" : "关注",
        icon: (
          <span className="relative flex items-center justify-center w-4 h-4">
            {followsMe ? (
              // 对方关注了我，我可以回关
              <>
                <FiUsers className="w-4 h-4 text-blue-500" />
                <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-blue-400" />
              </>
            ) : (
              // 普通关注
              <>
                <FiUser className="w-4 h-4" />
                <FiUserPlus className="absolute -top-0.5 -right-0.5 w-2 h-2 text-green-500" />
              </>
            )}
          </span>
        ),
        action: onAdd,
        className: followsMe 
          ? "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 font-medium" 
          : "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 font-medium",
      },
    ];

    // 添加屏蔽选项
    items.push({
      key: "block",
      label: "屏蔽用户",
      icon: (
        <span className="relative flex items-center justify-center w-4 h-4">
          <FiShield className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </span>
      ),
      action: onBlock,
      className: "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 font-medium",
    });

    return items;
  }, [isSelf, isBlocked, isFriend, isMutual, followsMe, onAdd, onRemove, onBlock, onUnblock]);

  // 调试信息
  console.log('FriendActions render:', { 
    isSelf, 
    loading, 
    isOpen, 
    status,
    followerCount,
    menuItemsCount: menuItems.length,
    menuItems: menuItems.map(item => item.key)
  });

  // 计算菜单位置 - 优化滚动处理
  const updateMenuPosition = useCallback(() => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    
    // 获取更准确的滚动位置
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    
    // 视口尺寸
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    const menuWidth = 192; // w-48 = 12rem = 192px
    const gap = 8; // 菜单与按钮的间距
    
    // 动态计算菜单高度
    let menuHeight = 120; // 默认高度
    if (menuRef.current) {
      menuHeight = menuRef.current.offsetHeight;
    } else {
      // 根据菜单项数量估算高度
      const itemHeight = 44; // 每个菜单项约 44px
      const padding = 8; // 上下 padding
      menuHeight = menuItems.length * itemHeight + padding;
    }
    
    // 基础位置计算（相对于文档）
    let left = rect.right + scrollX - menuWidth; // 右对齐
    let top = rect.bottom + scrollY + gap; // 按钮下方
    
    // 水平边界检查
    const minLeft = scrollX + gap;
    const maxLeft = scrollX + viewportWidth - menuWidth - gap;
    
    if (left < minLeft) {
      left = minLeft;
    } else if (left > maxLeft) {
      left = maxLeft;
    }
    
    // 垂直边界检查 - 如果下方空间不够，显示在上方
    const maxTop = scrollY + viewportHeight - menuHeight - gap;
    if (top > maxTop) {
      // 显示在按钮上方
      top = rect.top + scrollY - menuHeight - gap;
      
      // 如果上方也不够空间，则强制显示在视口内
      if (top < scrollY + gap) {
        top = scrollY + gap;
      }
    }
    
    console.log('Menu position calculated:', { 
      top, 
      left, 
      buttonRect: rect,
      scroll: { scrollX, scrollY },
      viewport: { viewportWidth, viewportHeight }
    });
    
    setMenuPosition({ top, left });
  }, []);

  // 移除了复杂的外部点击处理，使用透明背景层代替

  // 监听滚动和窗口变化，实时更新菜单位置
  useEffect(() => {
    if (!isOpen) return;

    let rafId: number;
    
    const handlePositionUpdate = () => {
      // 使用 requestAnimationFrame 防止频繁更新
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        updateMenuPosition();
      });
    };

    // 监听多种滚动事件
    document.addEventListener('scroll', handlePositionUpdate, { passive: true });
    window.addEventListener('scroll', handlePositionUpdate, { passive: true });
    window.addEventListener('resize', handlePositionUpdate);
    
    // 监听视觉视口变化（移动端）
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handlePositionUpdate);
      window.visualViewport.addEventListener('scroll', handlePositionUpdate);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      document.removeEventListener('scroll', handlePositionUpdate);
      window.removeEventListener('scroll', handlePositionUpdate);
      window.removeEventListener('resize', handlePositionUpdate);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handlePositionUpdate);
        window.visualViewport.removeEventListener('scroll', handlePositionUpdate);
      }
    };
  }, [isOpen, updateMenuPosition]);

  // 监听按钮是否在视口内，如果不可见则关闭菜单
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          console.log('Button is out of viewport, closing menu');
          setIsOpen(false);
        }
      },
      {
        threshold: 0,
        rootMargin: '-10px'
      }
    );

    observer.observe(buttonRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  // ESC 关闭菜单
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  // 按钮点击处理
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Button clicked! isSelf:', isSelf, 'loading:', loading, 'menuItems:', menuItems.length);
    
    // 如果是自己或正在加载，直接返回不做任何操作
    if (isSelf || loading) {
      console.log('Cannot toggle menu: isSelf =', isSelf, 'loading =', loading);
      return;
    }
    
    console.log('Toggling menu, current state:', isOpen);
    
    if (!isOpen) {
      // 在打开菜单前计算位置
      updateMenuPosition();
    }
    
    setIsOpen(prev => {
      const newState = !prev;
      console.log('Setting isOpen from', prev, 'to', newState);
      return newState;
    });
  }, [isSelf, loading, isOpen, menuItems]);

  // 菜单项点击处理
  const handleMenuItemClick = useCallback(async (action: () => void | Promise<void>) => {
    console.log('Menu item clicked, executing action...');
    setIsOpen(false);
    try {
      await action();
      console.log('Action completed successfully');
    } catch (error) {
      console.error("Action failed:", error);
    }
  }, []);

  // 获取主按钮的图标 - osu! 单向好友系统
  const getMainIcon = () => {
    if (loading) {
      return <FiLoader className="w-4 h-4 animate-spin text-blue-500" />;
    }

    if (isSelf) {
      return (
        <span className="relative flex items-center justify-center">
          <FiUser className="w-4 h-4 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full"></span>
        </span>
      );
    }

    if (isBlocked) {
      return (
        <span className="relative flex items-center justify-center">
          <FiShield className="w-4 h-4 text-red-500" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </span>
      );
    }

    if (isFriend) {
      if (isMutual) {
        // 互相关注 - 双人图标 + 粉色心形 + 脉冲效果
        return (
          <span className="relative flex items-center justify-center">
            <FiUsers className="w-4 h-4 text-pink-500" />
            <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-pink-400 fill-current animate-pulse" />
          </span>
        );
      } else {
        // 单向关注 - 用户图标 + 蓝色勾选
        return (
          <span className="relative flex items-center justify-center">
            <FiUser className="w-4 h-4 text-blue-500" />
            <FiUserCheck className="absolute -top-0.5 -right-0.5 w-2 h-2 text-emerald-500" />
          </span>
        );
      }
    }

    if (followsMe) {
      // 对方关注了我 - 橙色双人图标 + 心形提示
      return (
        <span className="relative flex items-center justify-center">
          <FiUsers className="w-4 h-4 text-orange-500" />
          <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-orange-400 opacity-80" />
        </span>
      );
    }

    // 未关注 - 默认用户图标
    return (
      <span className="relative flex items-center justify-center">
        <FaUserFriends className="w-4 h-4 text-gray-600" />
      </span>
    );
  };

  // 获取按钮状态文本 - osu! 单向好友系统
  const getButtonStatusText = () => {
    if (isSelf) return "自己的资料";
    if (isBlocked) return "已屏蔽该用户";
    if (isFriend) {
      if (isMutual) {
        return "互相关注 - 你们相互关注";
      } else {
        return "已关注 - 你关注了此用户";
      }
    }
    if (followsMe) return "关注你的用户 - 对方关注了你";
    return "未关注 - 点击查看关注选项";
  };

  // 是否显示下拉箭头
  const showDropdownArrow = !isSelf && !loading && menuItems.length > 0;

  return (
    <div className={`relative inline-flex z-50 ${className}`} ref={containerRef}>
      {/* 主按钮 */}
      <motion.button
        ref={buttonRef}
        type="button"
        disabled={loading || isSelf}
        onClick={handleToggle}
        aria-label={getButtonStatusText()}
        whileHover={{ scale: !isSelf && !loading ? 1.02 : 1 }}
        whileTap={{ scale: !isSelf && !loading ? 0.98 : 1 }}
        className={`
          bg-gray-100 dark:bg-gray-800 
          ${!isSelf && !loading ? 'hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer' : 'cursor-default'}
          px-3 py-2 rounded-full flex items-center gap-2 text-sm
          text-gray-700 dark:text-gray-300
          disabled:opacity-50 disabled:cursor-not-allowed select-none
          transition-all duration-200
          ${!isSelf && !loading ? 'focus:outline-none focus:ring-2 focus:ring-blue-500/20' : ''}
          ${isOpen && !isSelf ? 'ring-2 ring-blue-500/20' : ''}
          ${showDropdownArrow ? 'pr-4' : ''}
        `}
      >
        {/* 图标和数字 */}
        <div className="flex items-center gap-2">
          {getMainIcon()}
          <span>{followerCount}</span>
        </div>

        {/* 下拉箭头 - 只在非自己且有菜单项时显示 */}
        {showDropdownArrow && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-1"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        )}
      </motion.button>

      {/* 下拉菜单 - 使用 Portal 渲染到 body 避免被遮挡 */}
      {isOpen && !isSelf && !loading && menuItems.length > 0 && createPortal(
        <>
          {/* 透明背景层，确保层级正确 */}
          <div 
            className="fixed inset-0"
            style={{ zIndex: 99998 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* 菜单内容 */}
          <div 
            ref={menuRef}
            className="fixed w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 overflow-hidden"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 99999,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 25px 25px -18px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleMenuItemClick(item.action)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium
                  transition-all duration-200
                  ${item.className || 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default FriendActions;