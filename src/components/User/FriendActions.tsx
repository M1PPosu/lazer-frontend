import React, { useMemo, useState } from "react";
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
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

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

type MenuItemType = {
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

  // Floating UI 配置
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift({
        padding: 8,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // osu! 单向好友系统菜单配置
  const menuItems: MenuItemType[] = useMemo(() => {
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

  // 如果是自己或没有菜单项，只显示按钮
  if (isSelf || loading || menuItems.length === 0) {
    return (
      <div className={`relative inline-flex ${className}`}>
        <motion.button
          type="button"
          disabled={loading || isSelf}
          aria-label={getButtonStatusText()}
          whileHover={{ scale: !isSelf && !loading ? 1.02 : 1 }}
          whileTap={{ scale: !isSelf && !loading ? 0.98 : 1 }}
          className={`
            bg-gray-100 dark:bg-gray-800 
            px-3 py-2 rounded-full flex items-center gap-2 text-sm
            text-gray-700 dark:text-gray-300
            disabled:opacity-50 disabled:cursor-not-allowed select-none
            transition-all duration-200
            cursor-default
          `}
        >
          <div className="flex items-center gap-2">
            {getMainIcon()}
            <span>{followerCount}</span>
          </div>
        </motion.button>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      <motion.button
        ref={refs.setReference}
        type="button"
        aria-label={getButtonStatusText()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...getReferenceProps()}
        className={`
          bg-gray-100 dark:bg-gray-800 
          hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer
          px-3 py-2 rounded-full flex items-center gap-2 text-sm
          text-gray-700 dark:text-gray-300
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          ${isOpen ? 'ring-2 ring-blue-500/20' : ''}
          ${showDropdownArrow ? 'pr-4' : ''}
        `}
      >
        {/* 图标和数字 */}
        <div className="flex items-center gap-2">
          {getMainIcon()}
          <span>{followerCount}</span>
        </div>

        {/* 下拉箭头 - 只在有菜单项时显示 */}
        {showDropdownArrow && (
          <motion.div
            className="ml-1"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
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

      {/* 使用 FloatingPortal 渲染菜单到 body */}
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 overflow-hidden focus:outline-none z-[9999]"
            >
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={async () => {
                    try {
                      await item.action();
                      setIsOpen(false); // 关闭菜单
                    } catch (error) {
                      console.error("Action failed:", error);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium
                    transition-all duration-200
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    ${item.className || 'text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
};

export default FriendActions;