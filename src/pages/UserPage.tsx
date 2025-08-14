import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FiUserPlus, FiShield, FiShieldOff, FiHeart, FiLoader, FiUsers, FiUser, FiUserCheck } from 'react-icons/fi';
import { userAPI, friendsAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import type { User, GameMode, MainGameMode } from '../types';
import { GAME_MODE_COLORS, GAME_MODE_GROUPS, GAME_MODE_NAMES, MAIN_MODE_ICONS } from '../types';
import Avatar from '../components/UI/Avatar';
import ProfileCover from '../components/UI/ProfileCover';
import toast from 'react-hot-toast';

// 文本骨架屏 - 精确匹配文本尺寸
const TextSkeleton: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="invisible">{children}</div>
    <div className="absolute inset-0 animate-pulse bg-gray-300/70 dark:bg-gray-600/70 rounded"></div>
  </div>
);

const UserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>('osu');
  const [selectedMainMode, setSelectedMainMode] = useState<MainGameMode>('osu');
  const [showSubModes, setShowSubModes] = useState<MainGameMode | null>(null);
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);
  const modeSelectRef = useRef<HTMLDivElement>(null);
  // 记录已经获取过好友关系的用户ID，防止切换模式时重复请求
  const relationshipFetchedUserIdRef = useRef<number | null>(null);

  // 好友关系状态
  const [friendshipStatus, setFriendshipStatus] = useState({
    isFriend: false,        // 我是否关注了对方
    isBlocked: false,       // 我是否屏蔽了对方
    isMutual: false,        // 是否互相关注
    followsMe: false,       // 对方是否关注了我
    loading: false
  });

  // 获取用户关系状态
  const fetchFriendshipStatus = async (targetUserId: number) => {
    if (!isAuthenticated || !currentUser || currentUser.id === targetUserId) {
      return; // 不需要检查自己与自己的关系
    }

    try {
      setFriendshipStatus(prev => ({ ...prev, loading: true }));
      const status = await friendsAPI.checkRelationship(targetUserId);
      setFriendshipStatus({
        ...status,
        loading: false
      });
      relationshipFetchedUserIdRef.current = targetUserId; // 记录已获取
    } catch (error) {
      console.error('获取好友关系失败:', error);
      setFriendshipStatus({
        isFriend: false,
        isBlocked: false,
        isMutual: false,
        followsMe: false,
        loading: false
      });
    }
  };

  // 添加好友
  const handleAddFriend = async () => {
    if (!user || !isAuthenticated) return;

    try {
      setFriendshipStatus(prev => ({ ...prev, loading: true }));
      await friendsAPI.addFriend(user.id);
      
      // 重新获取关系状态
      await fetchFriendshipStatus(user.id);
      
      toast.success('已添加好友');
    } catch (error: any) {
      console.error('添加好友失败:', error);
      setFriendshipStatus(prev => ({ ...prev, loading: false }));
      toast.error(error.response?.data?.detail || '添加好友失败');
    }
  };

  // 删除好友
  const handleRemoveFriend = async () => {
    if (!user || !isAuthenticated) return;

    try {
      setFriendshipStatus(prev => ({ ...prev, loading: true }));
      await friendsAPI.removeFriend(user.id);
      
      // 重新获取关系状态
      await fetchFriendshipStatus(user.id);
      
      toast.success('已删除好友');
    } catch (error: any) {
      console.error('删除好友失败:', error);
      setFriendshipStatus(prev => ({ ...prev, loading: false }));
      toast.error(error.response?.data?.detail || '删除好友失败');
    }
  };

  // 屏蔽用户
  const handleBlockUser = async () => {
    if (!user || !isAuthenticated) return;

    try {
      setFriendshipStatus(prev => ({ ...prev, loading: true }));
      await friendsAPI.blockUser(user.id);
      
      // 重新获取关系状态
      await fetchFriendshipStatus(user.id);
      
      toast.success('已屏蔽用户');
    } catch (error: any) {
      console.error('屏蔽用户失败:', error);
      setFriendshipStatus(prev => ({ ...prev, loading: false }));
      toast.error(error.response?.data?.detail || '屏蔽用户失败');
    }
  };

  // 取消屏蔽
  const handleUnblockUser = async () => {
    if (!user || !isAuthenticated) return;

    try {
      setFriendshipStatus(prev => ({ ...prev, loading: true }));
      await friendsAPI.unblockUser(user.id);
      
      // 重新获取关系状态
      await fetchFriendshipStatus(user.id);
      
      toast.success('已取消屏蔽');
    } catch (error: any) {
      console.error('取消屏蔽失败:', error);
      setFriendshipStatus(prev => ({ ...prev, loading: false }));
      toast.error(error.response?.data?.detail || '取消屏蔽失败');
    }
  };

  // 点击外部关闭子模式菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modeSelectRef.current && !modeSelectRef.current.contains(event.target as Node)) {
        setShowSubModes(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 获取用户数据后检查好友关系
  useEffect(() => {
    if (
      user &&
      isAuthenticated &&
      currentUser &&
      user.id !== currentUser.id &&
      relationshipFetchedUserIdRef.current !== user.id // 仅当该用户尚未获取关系时调用
    ) {
      fetchFriendshipStatus(user.id);
    }
  }, [user, isAuthenticated, currentUser]);

  // 获取用户数据
  const fetchUser = async (userIdOrName: string, mode?: GameMode) => {
    try {
      setIsUpdatingMode(true);
      setError(null);
      const userData = await userAPI.getUser(userIdOrName, mode);
      setUser(userData);
    } catch (error: any) {
      console.error('获取用户数据失败:', error);
      setError(error.response?.data?.detail || '用户不存在或服务器错误');
      toast.error('获取用户信息失败');
    } finally {
      setLoading(false);
      setIsUpdatingMode(false);
    }
  };

  // 初始加载用户数据
  useEffect(() => {
    if (userId) {
      fetchUser(userId, selectedMode);
    }
  }, [userId]);

  // 当选择的模式改变时，获取对应模式的用户数据
  useEffect(() => {
    if (userId && selectedMode && user) {
      setIsUpdatingMode(true);
      fetchUser(userId, selectedMode);
    }
  }, [selectedMode]);

  // 处理主模式切换
  const handleMainModeChange = (mainMode: MainGameMode) => {
    if (selectedMainMode === mainMode) {
      // 如果点击的是当前选中的模式，切换子模式显示状态
      setShowSubModes(showSubModes === mainMode ? null : mainMode);
    } else {
      // 如果点击的是不同的模式，选择该模式并显示其子模式
      setSelectedMainMode(mainMode);
      setShowSubModes(mainMode);
      // 默认选择该主模式的第一个子模式
      const firstSubMode = GAME_MODE_GROUPS[mainMode][0];
      setSelectedMode(firstSubMode);
    }
  };

  // 处理子模式选择
  const handleSubModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setShowSubModes(null); // 选择后隐藏子模式选项
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-osu-pink"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          用户未找到
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {error || '请检查用户 ID 或用户名是否正确'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* 用户基本信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-full"
      >
        <ProfileCover
          coverUrl={user.cover_url || user.cover?.url}
          className="rounded-2xl shadow-lg"
        >
          <div className="p-4 sm:p-6 md:p-8 w-full max-w-full relative">
            {/* 游戏模式选择器 - 位于卡片右上角 */}
            <div className="absolute top-3 mr-[10px] right-4 sm:right-[100px] z-20" ref={modeSelectRef}>
              {/* 主模式图标 */}
              <div className="flex gap-1 sm:gap-2">
                {(Object.keys(GAME_MODE_GROUPS) as MainGameMode[]).map((mainMode) => (
                  <div key={mainMode} className="relative">
                    <button
                      onClick={() => handleMainModeChange(mainMode)}
                      className={`relative p-1.5 sm:p-2 rounded-lg transition-all duration-300 group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 ${
                        selectedMainMode === mainMode
                          ? 'scale-110 shadow-lg'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      data-tooltip-id={`main-mode-${mainMode}`}
                      data-tooltip-content={mainMode === 'osu' ? 'osu!' : 
                                          mainMode === 'taiko' ? 'osu!taiko' :
                                          mainMode === 'fruits' ? 'osu!catch' :
                                          'osu!mania'}
                      style={{
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      {/* 背景层 */}
                      <span
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{
                          background: selectedMainMode === mainMode
                            ? `linear-gradient(135deg, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]} 0%, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]}CC 100%)`
                            : 'rgba(255,255,255,0.07)',
                          boxShadow: selectedMainMode === mainMode ? '0 4px 14px rgba(0,0,0,0.35)' : '0 2px 6px rgba(0,0,0,0.25)'
                        }}
                      />
                      {/* 内部细微高亮 */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-40 transition-opacity"
                        style={{
                          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 70%)'
                        }}
                      />
                      {/* 选中环 */}
                      {selectedMainMode === mainMode && (
                        <span
                          className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-white/50 ring-offset-2 ring-offset-black/30 animate-[pulse_2.4s_ease-in-out_infinite]"
                          style={{
                            boxShadow: '0 0 0 3px rgba(255,255,255,0.08)'
                          }}
                        />
                      )}
                      <i
                        className={`${MAIN_MODE_ICONS[mainMode]} relative z-10 text-lg sm:text-xl transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]`}
                        style={{
                          color: selectedMainMode === mainMode ? '#fff' : 'rgba(255,255,255,0.85)'
                        }}
                      />
                    </button>

                    {/* 子模式弹出选项 */}
                    {showSubModes === mainMode && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="absolute top-full mt-2 right-0 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-2 min-w-28 sm:min-w-32 shadow-xl z-30"
                      >
                        {GAME_MODE_GROUPS[mainMode].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => handleSubModeSelect(mode)}
                            className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm block ${
                              selectedMode === mode
                                ? 'text-white shadow-md'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                            style={{
                              backgroundColor: selectedMode === mode ? GAME_MODE_COLORS[mode] : 'transparent',
                            }}
                          >
                            {GAME_MODE_NAMES[mode]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* 模式图标的 Tooltip */}
              {(Object.keys(GAME_MODE_GROUPS) as MainGameMode[]).map((mainMode) => (
                <ReactTooltip
                  key={`tooltip-${mainMode}`}
                  id={`main-mode-${mainMode}`}
                  place="top"
                  variant="dark"
                  offset={10}
                  delayShow={300}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '8px 12px',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 99999,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  classNameArrow="!border-t-black/90"
                />
              ))}
            </div>
            <div className="flex mt-[13px] flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-full">
              {/* 左侧：头像、用户名、国家 */}
              <div className="flex-1 lg:flex-[2] min-w-0 max-w-full">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6 w-full max-w-full">
                  {/* 头像 */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Avatar 
                        userId={user.id} 
                        username={user.username} 
                        avatarUrl={user.avatar_url}
                        size="2xl" 
                      />
                      {/* 头像边框 */}
                      <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                    </div>
                  </div>

                  {/* 用户基本信息 */}
                  <div className="flex-1 text-center sm:text-left min-w-0 max-w-full">
                    <div className="flex flex-col items-center gap-3 mb-3 sm:flex-row sm:items-end w-full max-w-full">
                      <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-white text-shadow-lg leading-tight min-w-0 max-w-full">
                        <span className="inline-block break-all word-wrap break-words">{user.username}</span>
                      </h1>

                      {/* 等级信息 - 与用户名并排 */}
                      {isUpdatingMode || !user.statistics?.level ? (
                        <div className="relative h-8 w-16 rounded-full border-2 border-white/20 overflow-hidden flex-shrink-0 sm:top-[4px] sm:left-[10px]">
                          <div className="absolute inset-0 animate-pulse bg-gray-300/50 dark:bg-gray-600/50 rounded-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white/50 font-bold text-sm">
                              {user.statistics?.level?.current || '--'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="relative h-8 w-16 rounded-full border-2 border-white/30 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 flex-shrink-0 sm:top-[4px] sm:left-[10px]"
                          data-tooltip-id="level-tooltip"
                          data-tooltip-content={`等级进度: ${user.statistics.level.progress || 0}%`}
                        >
                          {/* 背景进度条 */}
                          <div 
                            className="absolute inset-0 transition-all duration-500"
                            style={{
                              background: `linear-gradient(90deg, ${GAME_MODE_COLORS[selectedMode]}40 0%, ${GAME_MODE_COLORS[selectedMode]} ${user.statistics.level.progress || 0}%, rgba(255,255,255,0.1) ${user.statistics.level.progress || 0}%)`
                            }}
                          />
                          
                          {/* 等级数字叠加 */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-sm drop-shadow-lg">
                              {user.statistics.level.current || 0}
                            </span>
                          </div>
                          
                          {/* 发光效果 */}
                          <div 
                            className="absolute inset-0 rounded-full opacity-30"
                            style={{
                              background: `radial-gradient(circle at center, ${GAME_MODE_COLORS[selectedMode]}20 0%, transparent 70%)`
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* React Tooltip */}
                    {user.statistics && user.statistics.level && (
                      <ReactTooltip
                        id="level-tooltip"
                        place="top"
                        variant="dark"
                        offset={10}
                        delayShow={300}
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          color: 'white',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          padding: '8px 12px',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          zIndex: 99999,
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                        classNameArrow="!border-t-black/90"
                      />
                    )}

                    {user.country && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                        <img
                          src={`https://flagcdn.com/w20/${user.country.code.toLowerCase()}.png`}
                          alt={user.country.code}
                          className="w-6 h-auto drop-shadow-sm"
                        />
                        <span className="text-white/90 text-shadow font-medium text-lg">
                          {user.country.name}
                        </span>
                      </div>
                    )}

                    {/* 用户状态信息 */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${user.is_online ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-white/90 text-shadow font-medium">
                          {user.is_online ? '在线' : '离线'}
                        </span>
                      </div>
                      
                      {user.follower_count > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-white font-bold text-lg">{user.follower_count.toLocaleString()}</span>
                          <span className="text-white/80 text-shadow">关注者</span>
                        </div>
                      )}
                      
                      {user.scores_best_count > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-white font-bold text-lg">{user.scores_best_count.toLocaleString()}</span>
                          <span className="text-white/80 text-shadow">最佳成绩</span>
                        </div>
                      )}
                    </div>

                    {/* 游戏统计 - 移除，将在头像下方单独放置 */}
                  </div>
                </div>
              </div>

              {/* 右侧：用户详细信息 */}
              <div className="flex-1 lg:flex-[1] lg:max-w-sm w-full min-w-0">
                <div className="space-y-3 sm:space-y-4 w-full max-w-full mt-6 sm:mt-5">
                  {/* 用户基本信息 */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-xs sm:text-sm font-medium">用户 ID</span>
                        <span className="text-white font-bold text-sm sm:text-lg">{user.id}</span>
                      </div>
                      
                      {user.join_date && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/70 text-xs sm:text-sm font-medium">加入时间</span>
                          <span className="text-white font-medium text-xs sm:text-base">
                            {new Date(user.join_date).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      
                      {user.last_visit && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/70 text-xs sm:text-sm font-medium">最后访问</span>
                          <span className="text-white font-medium text-xs sm:text-base">
                            {new Date(user.last_visit).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 游戏统计 */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                    <div className="flex items-center gap-6 text-xs">
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">
                          {isUpdatingMode || !user.statistics ? (
                            <TextSkeleton>
                              {user.statistics?.play_count?.toLocaleString() || '999,999'}
                            </TextSkeleton>
                          ) : (
                            user.statistics.play_count?.toLocaleString() || '0'
                          )}
                        </p>
                        <p className="text-xs text-white/60">游戏次数</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">
                          {isUpdatingMode || !user.statistics ? (
                            <TextSkeleton>
                              {user.statistics?.total_score?.toLocaleString() || '99,999,999'}
                            </TextSkeleton>
                          ) : (
                            user.statistics.total_score?.toLocaleString() || '0'
                          )}
                        </p>
                        <p className="text-xs text-white/60">总分</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">
                          {isUpdatingMode || !user.statistics ? (
                            <TextSkeleton>
                              {user.statistics?.ranked_score?.toLocaleString() || '99,999,999'}
                            </TextSkeleton>
                          ) : (
                            user.statistics.ranked_score?.toLocaleString() || '0'
                          )}
                        </p>
                        <p className="text-xs text-white/60">排名分数</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">
                          {isUpdatingMode || !user.statistics ? (
                            <TextSkeleton>
                              {user.statistics?.play_time ? `${Math.round(user.statistics.play_time / 3600).toLocaleString()}h` : '999h'}
                            </TextSkeleton>
                          ) : (
                            `${Math.round((user.statistics.play_time || 0) / 3600).toLocaleString()}h`
                          )}
                        </p>
                        <p className="text-xs text-white/60">游戏时间</p>
                      </div>
                    </div>
                  </div>

                  {/* 核心统计 */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                    <div className="flex items-center gap-6 text-xs">
                      <div className="text-left">
                        <div className="text-white font-bold text-sm sm:text-lg">
                          {isUpdatingMode || !user.statistics ? (
                            <TextSkeleton>
                              {user.statistics?.global_rank ? `#${user.statistics.global_rank.toLocaleString()}` : '#999,999'}
                            </TextSkeleton>
                          ) : (
                            user.statistics.global_rank ? `#${user.statistics.global_rank.toLocaleString()}` : 'N/A'
                          )}
                        </div>
                        <div className="text-white/70 text-xs sm:text-sm">全球排名</div>
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-lg">
                          {isUpdatingMode || !user.statistics ? (
                            <TextSkeleton>
                              {user.statistics?.country_rank ? `#${user.statistics.country_rank.toLocaleString()}` : '#999,999'}
                            </TextSkeleton>
                          ) : (
                            user.statistics.country_rank ? `#${user.statistics.country_rank.toLocaleString()}` : 'N/A'
                          )}
                        </div>
                        <div className="text-white/70 text-xs sm:text-sm">国家排名</div>
                      </div>
                      <div className="text-left">
                        <div 
                          className="text-white font-bold text-lg"
                          style={{ color: GAME_MODE_COLORS[selectedMode] }}
                        >
                          {isUpdatingMode || !user.statistics ? (
                            <TextSkeleton>
                              {user.statistics?.pp ? `${Math.round(user.statistics.pp).toLocaleString()}pp` : '9,999pp'}
                            </TextSkeleton>
                          ) : (
                            `${Math.round(user.statistics.pp || 0).toLocaleString()}pp`
                          )}
                        </div>
                        <div className="text-white/70 text-xs sm:text-sm">表现分数</div>
                      </div>
                      <div className="text-left">
                        <div className="text-white font-bold text-lg">
                          {isUpdatingMode || !user.statistics ? (
                            <TextSkeleton>
                              {user.statistics?.hit_accuracy ? `${user.statistics.hit_accuracy.toFixed(1)}%` : '99.9%'}
                            </TextSkeleton>
                          ) : (
                            `${(user.statistics.hit_accuracy || 0).toFixed(1)}%`
                          )}
                        </div>
                        <div className="text-white/70 text-xs sm:text-sm">准确率</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 好友操作按钮 - 左下角偏上和内位置，与头像左对齐 */}
            {isAuthenticated && currentUser && user.id !== currentUser.id && (
              <div className="absolute bottom-8 left-[58px] z-10">
                <div className="flex gap-3">
                  {friendshipStatus.isBlocked ? (
                    // 已屏蔽状态
                    <button
                      onClick={handleUnblockUser}
                      disabled={friendshipStatus.loading}
                      className="btn-primary flex items-center gap-2 !px-4 !py-2 !text-sm
                               disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm bg-black/20 border border-white/20"
                    >
                      {friendshipStatus.loading ? (
                        <FiLoader className="w-4 h-4 animate-spin" />
                      ) : (
                        <FiShieldOff className="w-4 h-4" />
                      )}
                      <span>取消屏蔽</span>
                    </button>
                  ) : (
                    <>
                      {friendshipStatus.isFriend ? (
                        // 已是好友状态 - 显示当前关注状态
                        <button
                          onClick={handleRemoveFriend}
                          disabled={friendshipStatus.loading}
                          className="btn-secondary flex items-center gap-2 !px-4 !py-2 !text-sm
                                   disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm bg-black/20 border border-white/20"
                        >
                          {friendshipStatus.loading ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                          ) : (
                            <div className="relative flex items-center justify-center w-5 h-5">
                              {friendshipStatus.isMutual ? (
                                // 互相关注 - 显示双人图标 + 爱心
                                <>
                                  <FiUsers className="w-4 h-4" />
                                  <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-pink-400" />
                                </>
                              ) : (
                                // 单向关注 - 显示单人图标 + 勾选
                                <>
                                  <FiUser className="w-4 h-4" />
                                  <FiUserCheck className="absolute -top-0.5 -right-0.5 w-2 h-2 text-green-400" />
                                </>
                              )}
                            </div>
                          )}
                          <span>
                            {friendshipStatus.isMutual ? '互关中' : '已关注'}
                          </span>
                        </button>
                      ) : (
                        // 未添加好友状态 - 显示预期的关注结果
                        <button
                          onClick={handleAddFriend}
                          disabled={friendshipStatus.loading}
                          className="btn-primary flex items-center gap-2 !px-4 !py-2 !text-sm
                                   disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm bg-black/20 border border-white/20"
                        >
                          {friendshipStatus.loading ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                          ) : (
                            <div className="relative flex items-center justify-center w-5 h-5">
                              {friendshipStatus.followsMe ? (
                                // 对方已关注我，点击后将变成互关 - 显示即将的双人状态
                                <>
                                  <FiUsers className="w-4 h-4" />
                                  <FiHeart className="absolute -top-0.5 -right-0.5 w-2 h-2 text-pink-400 opacity-50" />
                                </>
                              ) : (
                                // 对方未关注我，点击后是单向关注 - 显示即将的单人状态
                                <>
                                  <FiUser className="w-4 h-4" />
                                  <FiUserPlus className="absolute -top-0.5 -right-0.5 w-2 h-2 text-blue-400" />
                                </>
                              )}
                            </div>
                          )}
                          <span>
                            {friendshipStatus.followsMe ? '回关' : '关注'}
                          </span>
                        </button>
                      )}
                      <button
                        onClick={handleBlockUser}
                        disabled={friendshipStatus.loading}
                        className="btn-secondary flex items-center gap-2 !px-4 !py-2 !text-sm
                                 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm bg-black/20 border border-white/20"
                      >
                        <FiShield className="w-4 h-4" />
                        <span>屏蔽</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </ProfileCover>
      </motion.div>


      {/* 排名历史图表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          排名历史趋势
        </h3>
        <div className="h-64">
          {isUpdatingMode ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-gray-400 dark:text-gray-500 text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>数据加载中...</p>
              </div>
            </div>
          ) : user.rank_history && user.rank_history.data && user.rank_history.data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={user.rank_history.data.map((rank, index) => {
                  return {
                    day: index,
                    rank: rank === 0 ? null : rank,
                  };
                }).filter(item => item.rank !== null)}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day"
                  className="text-gray-600 dark:text-gray-400"
                  tickFormatter={(value) => {
                    const daysAgo = user.rank_history!.data.length - 1 - value;
                    if (daysAgo === 0) return '今天';
                    return `${daysAgo}天`;
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  reversed
                  className="text-gray-600 dark:text-gray-400"
                  tickFormatter={(value) => `#${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  labelFormatter={(label) => {
                    const daysAgo = user.rank_history!.data.length - 1 - label;
                    return daysAgo === 0 ? '今天' : `${daysAgo}天前`;
                  }}
                  formatter={(value) => [`#${value}`, '全球排名']}
                />
                <Line
                  type="monotone"
                  dataKey="rank"
                  stroke={GAME_MODE_COLORS[selectedMode]}
                  strokeWidth={3}
                  dot={{ fill: GAME_MODE_COLORS[selectedMode], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: GAME_MODE_COLORS[selectedMode], strokeWidth: 2 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2 text-gray-400 dark:text-gray-500">📊</div>
                <p className="text-gray-500 dark:text-gray-400">暂无排名历史数据</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 月度游戏次数图表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          月度游戏活跃度
        </h3>
        <div className="h-64">
          {isUpdatingMode ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-gray-400 dark:text-gray-500 text-center">
                <div className="text-4xl mb-2">📅</div>
                <p>数据加载中...</p>
              </div>
            </div>
          ) : user.monthly_playcounts && user.monthly_playcounts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={user.monthly_playcounts.map((item) => ({
                  month: new Date(item.start_date).toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'short' 
                  }),
                  count: item.count,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [value, '游戏次数']}
                />
                <Bar 
                  dataKey="count" 
                  fill={GAME_MODE_COLORS[selectedMode]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2 text-gray-400 dark:text-gray-500">📅</div>
                <p className="text-gray-500 dark:text-gray-400">暂无月度活跃度数据</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 评级分布饼图 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          成绩评级分布
        </h3>
        <div className="h-64">
          {isUpdatingMode ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-gray-400 dark:text-gray-500 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <p>数据加载中...</p>
              </div>
            </div>
          ) : user.statistics?.grade_counts && 
           Object.values(user.statistics.grade_counts).some(count => count > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'SSH', value: user.statistics.grade_counts.ssh, color: '#FFD700' },
                    { name: 'SS', value: user.statistics.grade_counts.ss, color: '#C0C0C0' },
                    { name: 'SH', value: user.statistics.grade_counts.sh, color: '#FFA500' },
                    { name: 'S', value: user.statistics.grade_counts.s, color: '#87CEEB' },
                    { name: 'A', value: user.statistics.grade_counts.a, color: '#98FB98' },
                  ].filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'SSH', value: user.statistics.grade_counts.ssh, color: '#FFD700' },
                    { name: 'SS', value: user.statistics.grade_counts.ss, color: '#C0C0C0' },
                    { name: 'SH', value: user.statistics.grade_counts.sh, color: '#FFA500' },
                    { name: 'S', value: user.statistics.grade_counts.s, color: '#87CEEB' },
                    { name: 'A', value: user.statistics.grade_counts.a, color: '#98FB98' },
                  ].filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2 text-gray-400 dark:text-gray-500">🏆</div>
                <p className="text-gray-500 dark:text-gray-400">暂无成绩评级数据</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 多模式统计对比 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          各模式表现对比
        </h3>
        {isUpdatingMode ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-500 text-center">
              <div className="text-4xl mb-2">🎮</div>
              <p>数据加载中...</p>
            </div>
          </div>
        ) : user.statistics_rulesets && Object.keys(user.statistics_rulesets).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(user.statistics_rulesets).map(([mode, stats]) => (
              <div key={mode} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">
                  {GAME_MODE_NAMES[mode as GameMode] || mode}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">PP:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(stats.pp || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">准确率:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(stats.hit_accuracy || 0).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">游戏次数:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(stats.play_count || 0).toLocaleString()}
                    </span>
                  </div>
                  {stats.global_rank && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">排名:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        #{stats.global_rank.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-4xl mb-2 text-gray-400 dark:text-gray-500">🎮</div>
              <p className="text-gray-500 dark:text-gray-400">暂无多模式统计数据</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserPage;
