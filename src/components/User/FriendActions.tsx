import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiUserPlus,
  FiShield,
  FiShieldOff,
  FiHeart,
  FiLoader,
  FiUsers,
  FiUser,
  FiUserCheck,
  FiX,
  FiChevronUp,
} from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
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

/** ===================== 常量与工具 ===================== */
const MENU_WIDTH_PX = 176; // w-44
const GAP_PX = 8;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** ===================== 子组件（稳定引用） ===================== */
type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  action: () => void | Promise<void>;
};

type MobileSheetProps = {
  open: boolean;
  loading: boolean;
  isSelf: boolean;
  isSmallScreen: boolean;
  menuItems: MenuItem[];
  onClose: () => void;
  onClickItem: (fn: () => void | Promise<void>) => void;
};

const MobileSheet = React.memo(function MobileSheet({
  open,
  loading,
  isSelf,
  isSmallScreen,
  menuItems,
  onClose,
  onClickItem,
}: MobileSheetProps) {
  if (!open || loading || isSelf || !isSmallScreen) return null;

  return createPortal(
    <AnimatePresence initial={false}>
      <div className="fixed inset-0 z-[10000]" style={{ position: "fixed" }}>
        {/* 背景遮罩 */}
        <motion.div
          initial={false}
          className="absolute inset-0 bg-black/50"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />

        {/* 抽屉内容 */}
        <motion.div
          role="menu"
          aria-label="好友操作"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
          className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-1xl"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            backgroundColor: "white",
            boxShadow:
              "0 -10px 25px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* 顶部把手和关闭按钮 */}
          <div className="flex items-center justify-center px-4 pt-4 pb-2 relative">
            <div
              className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600"
              style={{
                height: "6px",
                width: "48px",
                borderRadius: "3px",
                backgroundColor: "#d1d5db",
              }}
            />
            <button
              aria-label="关闭"
              className="absolute right-4 top-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={onClose}
              style={{
                position: "absolute",
                right: "16px",
                top: "12px",
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* 菜单项列表 */}
          {menuItems.length > 0 && (
            <div className="pb-6 pt-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  role="menuitem"
                  onClick={() => onClickItem(item.action)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left text-base text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "16px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#1f2937",
                  }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
});

type DesktopMenuProps = {
  open: boolean;
  loading: boolean;
  isSelf: boolean;
  isSmallScreen: boolean;
  menuRect: { top: number; left: number };
  menuItems: MenuItem[];
  onClickItem: (fn: () => void | Promise<void>) => void;
};

const DesktopMenu = React.memo(function DesktopMenu({
  open,
  loading,
  isSelf,
  isSmallScreen,
  menuRect,
  menuItems,
  onClickItem,
}: DesktopMenuProps) {
  if (!open || loading || isSelf || isSmallScreen) return null;

  return createPortal(
    <AnimatePresence initial={false}>
      <motion.div
        role="menu"
        aria-label="好友操作"
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed w-44 z-[10000]"
        style={{
          top: menuRect.top,
          left: menuRect.left,
          position: "fixed",
          width: "176px",
          zIndex: 10000,
        }}
      >
        <div
          className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 shadow-1xl"
          style={{
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          <div className="py-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                role="menuitem"
                onClick={() => onClickItem(item.action)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 focus:outline-none focus:bg-gray-100/80 dark:focus:bg-gray-800/60 transition-colors"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  textAlign: "left",
                  fontSize: "14px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});

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

  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [menuRect, setMenuRect] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // 小屏判断
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateScreenSize = () => {
      const newIsSmall = window.innerWidth <= 768;
      setIsSmallScreen(newIsSmall);
    };

    updateScreenSize();

    window.addEventListener("resize", updateScreenSize);
    const onOC = () => setTimeout(updateScreenSize, 100);
    window.addEventListener("orientationchange", onOC);

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      // 兼容旧浏览器
      (mediaQuery as any).addListener(handleMediaChange);
    }

    return () => {
      window.removeEventListener("resize", updateScreenSize);
      window.removeEventListener("orientationchange", onOC);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        (mediaQuery as any).removeListener(handleMediaChange);
      }
    };
  }, []);

  // 计算菜单位置
  const updateMenuPosition = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();

    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const pageTop =
      vv?.pageTop ??
      (window.scrollY || document.documentElement.scrollTop || 0);
    const pageLeft =
      vv?.pageLeft ??
      (window.scrollX || document.documentElement.scrollLeft || 0);
    const vw = vv?.width ?? window.innerWidth;

    let left = rect.right + pageLeft - MENU_WIDTH_PX;
    left = clamp(
      left,
      GAP_PX + pageLeft,
      pageLeft + vw - GAP_PX - MENU_WIDTH_PX
    );
    const top = rect.bottom + pageTop + GAP_PX;

    setMenuRect({ top, left });
  };

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();

    const handleUpdate = () => updateMenuPosition();

    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);

    const vv = (window as any).visualViewport;
    if (vv) {
      vv.addEventListener("resize", handleUpdate);
      vv.addEventListener("scroll", handleUpdate as any, { passive: true } as any);
    }

    return () => {
      window.removeEventListener("scroll", handleUpdate as any);
      window.removeEventListener("resize", handleUpdate as any);
      if (vv) {
        vv.removeEventListener("resize", handleUpdate as any);
        vv.removeEventListener("scroll", handleUpdate as any);
      }
    };
  }, [open]);

  // 外部点击关闭
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: Event) => {
      const target = e.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("touchstart", handleClickOutside, {
        passive: true,
        capture: true,
      });
      document.addEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
      document.addEventListener("pointerdown", handleClickOutside, {
        capture: true,
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("touchstart", handleClickOutside as any);
      document.removeEventListener("mousedown", handleClickOutside as any);
      document.removeEventListener("pointerdown", handleClickOutside as any);
    };
  }, [open]);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const menuItems: MenuItem[] = useMemo(() => {
    if (isSelf) return [];

    if (isBlocked) {
      return [
        {
          key: "unblock",
          label: "取消屏蔽",
          icon: <FiShieldOff className="w-4 h-4" />,
          action: onUnblock,
        },
      ];
    }
    if (isFriend) {
      return [
        {
          key: "remove",
          label: isMutual ? "取消互关" : "取消关注",
          icon: (
            <span className="relative flex items-center justify-center w-5 h-5">
              {isMutual ? (
                <>
                  <FiUsers className="w-4 h-4" />
                  <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-pink-400" />
                </>
              ) : (
                <>
                  <FiUser className="w-4 h-4" />
                  <FiUserCheck className="absolute -top-0.5 -right-0.5 w-2 h-2 text-green-400" />
                </>
              )}
            </span>
          ),
          action: onRemove,
        },
        {
          key: "block",
          label: "屏蔽",
          icon: <FiShield className="w-4 h-4" />,
          action: onBlock,
        },
      ];
    }
    return [
      {
        key: "add",
        label: followsMe ? "回关" : "关注",
        icon: (
          <span className="relative flex items-center justify-center w-5 h-5">
            {followsMe ? (
              <>
                <FiUsers className="w-4 h-4" />
                <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-pink-400 opacity-50" />
              </>
            ) : (
              <>
                <FiUser className="w-4 h-4" />
                <FiUserPlus className="absolute -top-0.5 -right-0.5 w-2 h-2 text-blue-400" />
              </>
            )}
          </span>
        ),
        action: onAdd,
      },
      {
        key: "block",
        label: "屏蔽",
        icon: <FiShield className="w-4 h-4" />,
        action: onBlock,
      },
    ];
  }, [isSelf, isBlocked, isFriend, isMutual, followsMe, onAdd, onRemove, onBlock, onUnblock]);

  const triggerAria = isSelf
    ? "自己"
    : isBlocked
    ? "已屏蔽"
    : isFriend
    ? isMutual
      ? "互关中"
      : "已关注"
    : followsMe
    ? "回关"
    : "关注";

  // 点击
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelf || loading) return;
    if (!open) updateMenuPosition();
    setOpen((v) => !v);
  };

  // 菜单项点击
  const handleMenuItemClick = async (action: () => void | Promise<void>) => {
    setOpen(false);
    try {
      await action();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  /** ========== 用 useMemo 缓存动画对象，避免“新对象触发重动画” ========== */
  const buttonAnimate = useMemo(() => {
    const hasMenu = !isSelf && !loading && menuItems.length > 0;
    return {
      paddingLeft: (isHovered || open) && hasMenu ? "1rem" : "0.75rem",
      paddingRight: (isHovered || open) && hasMenu ? "1.5rem" : "0.75rem",
    };
  }, [isHovered, open, isSelf, loading, menuItems.length]);

  const buttonTransition = useMemo(
    () => ({ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as any }),
    []
  );

  const iconContainerAnimate = useMemo(() => {
    const hasMenu = !isSelf && !loading && menuItems.length > 0;
    return { x: (isHovered || open) && hasMenu ? -2 : 0 };
  }, [isHovered, open, isSelf, loading, menuItems.length]);

  const iconContainerTransition = useMemo(
    () => ({ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as any }),
    []
  );

  const userIconAnimate = useMemo(() => {
    return {
      rotate: loading ? 0 : isHovered && !open ? 2 : 0,
      scale: loading ? 1 : isHovered && !open ? 1.05 : 1,
    };
  }, [loading, isHovered, open]);

  const userIconTransition = useMemo(
    () => ({ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as any }),
    []
  );

  const showArrow = !isSelf && !loading && menuItems.length > 0;
  const arrowAnimate = useMemo(
    () => ({
      opacity: isHovered || open ? 1 : 0,
      scale: isHovered || open ? 1 : 0.8,
      x: isHovered || open ? 0 : 4,
    }),
    [isHovered, open]
  );

  const arrowTransition = useMemo(
    () => ({ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as any }),
    []
  );

  const chevronAnimate = useMemo(
    () => ({ rotate: open ? 180 : 0, scale: open ? 1.1 : 1 }),
    [open]
  );

  const chevronTransition = useMemo(
    () => ({ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as any }),
    []
  );

  /** ===================== 渲染 ===================== */
  return (
    <div ref={rootRef} className={"relative inline-flex " + className}>
      {/* 触发按钮 */}
      <motion.button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerAria}
        disabled={loading || isSelf}
        onClick={handleButtonClick}
        onMouseEnter={() => !open && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchEnd={(e) => {
          // 防止触摸设备上的双重触发
          e.preventDefault();
        }}
        title={isSelf ? "不能对自己进行此操作" : undefined}
        whileHover={{ scale: !isSelf && !loading ? 1.02 : 1 }}
        whileTap={{ scale: !isSelf && !loading ? 0.98 : 1 }}
        initial={false} /** 关键：关闭初帧动画，避免反复播放 */
        animate={buttonAnimate}
        transition={buttonTransition}
        className={[
          "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
          "py-2 rounded-full flex items-center gap-2 text-sm",
          "text-gray-700 dark:text-gray-300",
          "disabled:opacity-50 disabled:cursor-not-allowed select-none",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          open ? "ring-2 ring-blue-500/20" : "",
        ].join(" ")}
        style={{
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}
      >
        {/* 图标和数字容器 */}
        <motion.div
          className="flex items-center gap-2"
          initial={false}
          animate={iconContainerAnimate}
          transition={iconContainerTransition}
        >
          {loading ? (
            <FiLoader className="w-4 h-4 animate-spin" />
          ) : (
            <motion.div
              initial={false}
              animate={userIconAnimate}
              transition={userIconTransition}
            >
              <FaUserFriends className="w-4 h-4" />
            </motion.div>
          )}
          <span>{followerCount ?? 0}</span>
        </motion.div>

        {/* 箭头指示器 - 只在非自己且有菜单项时显示 */}
        {showArrow && (
          <motion.div
            className="absolute right-3 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={arrowAnimate}
            transition={arrowTransition}
          >
            <motion.div
              initial={false}
              animate={chevronAnimate}
              transition={chevronTransition}
            >
              <FiChevronUp className="w-3 h-3" />
            </motion.div>
          </motion.div>
        )}
      </motion.button>

      {/* 菜单渲染（将存在性变化隔离到各自 Portal 的 AnimatePresence 内） */}
      {/* 这里不用外层 AnimatePresence 避免影响其它区域 */}
      <MobileSheet
        open={open}
        loading={loading}
        isSelf={isSelf}
        isSmallScreen={isSmallScreen}
        menuItems={menuItems}
        onClose={() => setOpen(false)}
        onClickItem={handleMenuItemClick}
      />
      <DesktopMenu
        open={open}
        loading={loading}
        isSelf={isSelf}
        isSmallScreen={isSmallScreen}
        menuRect={menuRect}
        menuItems={menuItems}
        onClickItem={handleMenuItemClick}
      />
    </div>
  );
};

export default FriendActions;
