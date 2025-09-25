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
  FloatingFocusManager,
} from "@floating-ui/react";

/** ===================== Type definition ===================== */
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
  /** Is it yourself (for true Disable all operations) */
  isSelf?: boolean;
}

type MenuItemType = {
  key: string;
  label: string;
  icon: React.ReactNode;
  action: () => void | Promise<void>;
  className?: string;
};

/** ===================== Main component ===================== */
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
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Floating UI Configuration
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen && !isActionLoading, // Don't open the menu while performing an action
    onOpenChange: (open) => {
      if (!isActionLoading) { // The state change is allowed only when no operation is in progress
        setIsOpen(open);
      }
    },
    placement: "bottom-start", // recover bottom-start
    strategy: "absolute", // Change back absolute Positioning Strategy
    //transform: false, // Disabled transform, use native positioning
    middleware: [
      offset({ mainAxis: 12, crossAxis: 0 }), // Increase spindle offset to ensure it is below
      flip({
        fallbackAxisSideDirection: "start",
        padding: 5,
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

  // osu! One-way friend systemmenuConfiguration
  const menuItems: MenuItemType[] = useMemo(() => {
    if (isSelf) return [];

    // Blocked
    if (isBlocked) {
      return [
        {
          key: "unblock",
          label: "Unblock",
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
    
    // Status already paid attention (I've followed the other person)
    if (isFriend) {
      const items = [
        {
          key: "remove",
          label: isMutual ? "Cancel mutual attention" : "Unfollow",
          icon: (
            <span className="relative flex items-center justify-center w-4 h-4">
              {isMutual ? (
                // Pay attention to each other - Two person icon + Heart shape
                <>
                  <FiUsers className="w-4 h-4 text-pink-500" />
                  <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-pink-400 fill-current" />
                </>
              ) : (
                // One-way attention - User icon + minus sign
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

      // Add blocking option
      items.push({
        key: "block",
        label: "Block users",
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
    
    // Not followed status
    const items = [
      {
        key: "add",
        label: followsMe ? "Back to the clearance (Pay attention to each other)" : "focus on",
        icon: (
          <span className="relative flex items-center justify-center w-4 h-4">
            {followsMe ? (
              // other sidefocus onI canBack to the clearance
              <>
                <FiUsers className="w-4 h-4 text-blue-500" />
                <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-blue-400" />
              </>
            ) : (
              // ordinaryfocus on
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

    // Add blocking option
    items.push({
      key: "block",
      label: "Block users",
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

  // Get the main button icon - osu! One-way friend system
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
        // Pay attention to each other - Two person icon + pinkHeart shape + Pulse effect
        return (
          <span className="relative flex items-center justify-center">
            <FiUsers className="w-4 h-4 text-pink-500" />
            <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-pink-400 fill-current animate-pulse" />
          </span>
        );
      } else {
        // One-way attention - User icon + Blue check
        return (
          <span className="relative flex items-center justify-center">
            <FiUser className="w-4 h-4 text-blue-500" />
            <FiUserCheck className="absolute -top-0.5 -right-0.5 w-2 h-2 text-emerald-500" />
          </span>
        );
      }
    }

    if (followsMe) {
      // other sidefocus onGet me - orange colorTwo person icon + Heart shapehint
      return (
        <span className="relative flex items-center justify-center">
          <FiUsers className="w-4 h-4 text-orange-500" />
          <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-orange-400 opacity-80" />
        </span>
      );
    }

    // not yetfocus on - defaultUser icon
    return (
      <span className="relative flex items-center justify-center">
        <FaUserFriends className="w-4 h-4 text-gray-600" />
      </span>
    );
  };

  // Get button status text - osu! One-way friend system
  const getButtonStatusText = () => {
    if (isSelf) return "Your own information";
    if (isBlocked) return "This user has been blocked";
    if (isFriend) {
      if (isMutual) {
        return "Pay attention to each other - You guys each otherfocus on";
      } else {
        return "alreadyfocus on - youfocus onThis user";
      }
    }
    if (followsMe) return "focus onyouUsers - other sidefocus onIt'syou";
    return "not yetfocus on - Click to viewfocus onOptions";
  };

  // Whether to display the drop-down arrow
  const showDropdownArrow = !isSelf && !loading && !isActionLoading && menuItems.length > 0;

  // If it is yourself or there are no menu items, only buttons are displayed
  if (isSelf || loading || menuItems.length === 0) {
    return (
      <div className={`relative inline-flex ${className}`}>
        <motion.button
          type="button"
          disabled={loading || isSelf || isActionLoading}
          aria-label={getButtonStatusText()}
          whileHover={{ scale: !isSelf && !loading && !isActionLoading ? 1.02 : 1 }}
          whileTap={{ scale: !isSelf && !loading && !isActionLoading ? 0.98 : 1 }}
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
            {(loading || isActionLoading) ? (
              <FiLoader className="w-4 h-4 animate-spin text-blue-500" />
            ) : (
              getMainIcon()
            )}
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
        disabled={isActionLoading}
        aria-label={getButtonStatusText()}
        whileHover={{ scale: !isActionLoading ? 1.02 : 1 }}
        whileTap={{ scale: !isActionLoading ? 0.98 : 1 }}
        {...getReferenceProps()}
        className={`
          bg-gray-100 dark:bg-gray-800 
          hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer
          px-3 py-2 rounded-full flex items-center gap-2 text-sm
          text-gray-700 dark:text-gray-300
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'ring-2 ring-blue-500/20' : ''}
          ${showDropdownArrow ? 'pr-4' : ''}
        `}
      >
        {/* Icons and numbers */}
        <div className="flex items-center gap-2">
          {(loading || isActionLoading) ? (
            <FiLoader className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            getMainIcon()
          )}
          <span>{followerCount}</span>
        </div>

        {/* Pull down arrow - Shown only when there are menu items */}
        {showDropdownArrow && (
          <motion.div
            className="ml-1"
            animate={{ rotate: isOpen ? 0 : -180 }}
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

      {/* Popup menu */}
      {isOpen && !isActionLoading && (
        <FloatingFocusManager context={context} modal={false}>
          <motion.div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              transform: `${floatingStyles.transform || ''} translateY(8px)`, // Force downward offset
            }}
            {...getFloatingProps()}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="mt-10 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 overflow-hidden focus:outline-none z-[9999]"
          >
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={async () => {
                  // Prevent repeated clicks
                  if (isActionLoading) return;
                  
                  try {
                    setIsActionLoading(true);
                    setIsOpen(false); // Close the menu now
                    await item.action();
                  } catch (error) {
                    console.error("Action failed:", error);
                  } finally {
                    setIsActionLoading(false);
                  }
                }}
                disabled={isActionLoading}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium
                  transition-all duration-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${item.className || 'text-gray-700 dark:text-gray-300'}
                `}
              >
                {isActionLoading ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  item.icon
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        </FloatingFocusManager>
      )}
    </div>
  );
};

export default FriendActions;