import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { userAPI } from '../utils/api';
import type { User, GameMode } from '../types';
import { GAME_MODE_COLORS } from '../types';
import Avatar from '../components/UI/Avatar';
import ProfileCover from '../components/UI/ProfileCover';
import toast from 'react-hot-toast';

const UserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>('osu');

  // 获取用户数据
  const fetchUser = async (userIdOrName: string, mode?: GameMode) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userAPI.getUser(userIdOrName, mode);
      setUser(userData);
    } catch (error: any) {
      console.error('获取用户数据失败:', error);
      setError(error.response?.data?.detail || '用户不存在或服务器错误');
      toast.error('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载用户数据
  useEffect(() => {
    if (userId) {
      fetchUser(userId, selectedMode);
    }
  }, [userId, selectedMode]);

  // 处理模式切换
  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
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
          <div className="p-4 sm:p-6 md:p-8 w-full max-w-full">
            <div className="flex mt-[13px] flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-full">
              {/* 左侧：头像、用户名、国家 */}
              <div className="flex-1 min-w-0 max-w-full">
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
                      {user.statistics && user.statistics.level && (
                        <div 
                          className="relative h-8 w-16 rounded-full border-2 border-white/30 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 flex-shrink-0 sm:top-[8px] sm:left-[10px]"
                          data-tooltip-id="level-tooltip"
                          data-tooltip-content={`等级进度: ${Math.round((user.statistics.level.progress || 0) * 100)}%`}
                        >
                          {/* 背景进度条 */}
                          <div 
                            className="absolute inset-0 transition-all duration-500"
                            style={{
                              background: `linear-gradient(90deg, ${GAME_MODE_COLORS[selectedMode]}40 0%, ${GAME_MODE_COLORS[selectedMode]} ${(user.statistics.level.progress || 0) * 100}%, rgba(255,255,255,0.1) ${(user.statistics.level.progress || 0) * 100}%)`
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
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          color: 'white',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          padding: '8px 12px',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
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
                  </div>
                </div>

                {/* 游戏模式选择器 - 响应式布局优化 */}
                <div className="mt-6 sm:mt-8">
                  <h2 className="text-lg font-semibold text-white mb-4 text-shadow text-center sm:text-left">
                    游戏模式
                  </h2>
                  <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {(['osu', 'taiko', 'fruits', 'mania', 'osurx', 'osuap'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleModeChange(mode)}
                          className={`px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm ${
                            selectedMode === mode
                              ? 'text-white shadow-lg'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                          style={{
                            backgroundColor: selectedMode === mode ? GAME_MODE_COLORS[mode] : 'transparent',
                          }}
                        >
                          {mode === 'osu' ? 'Standard' :
                           mode === 'taiko' ? 'Taiko' :
                           mode === 'fruits' ? 'Catch' :
                           mode === 'mania' ? 'Mania' :
                           mode === 'osurx' ? 'RX' :
                           mode === 'osuap' ? 'AP' : mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：用户详细信息 */}
              <div className="flex-shrink-0 lg:w-80 w-full lg:max-w-none max-w-md mx-auto min-w-0">
                <div className="space-y-3 sm:space-y-4 w-full max-w-full">
                  {/* 用户基本信息 */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                    <div className="space-y-2 sm:space-y-3">
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

                  {/* 核心统计 */}
                  {user.statistics && (
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-3 text-center text-sm sm:text-base">核心统计</h4>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="text-center">
                          <div className="text-white font-bold text-sm sm:text-lg">
                            {user.statistics.global_rank ? `#${user.statistics.global_rank.toLocaleString()}` : 'N/A'}
                          </div>
                          <div className="text-white/70 text-xs sm:text-sm">全球排名</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-bold text-lg">
                            {user.statistics.country_rank ? `#${user.statistics.country_rank.toLocaleString()}` : 'N/A'}
                          </div>
                          <div className="text-white/70">国家排名</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-bold text-lg">
                            {Math.round(user.statistics.pp || 0).toLocaleString()}pp
                          </div>
                          <div className="text-white/70">表现分数</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-bold text-lg">
                            {(user.statistics.hit_accuracy || 0).toFixed(1)}%
                          </div>
                          <div className="text-white/70">准确率</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ProfileCover>
      </motion.div>

      {/* 游戏统计 - 移到主要区域 */}
      {user.statistics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-full"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            游戏统计
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full max-w-full">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.statistics.play_count?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">游戏次数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.statistics.total_score?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">总分</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.statistics.ranked_score?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">排名分数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((user.statistics.play_time || 0) / 3600).toLocaleString()}h
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">游戏时间</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 排名历史图表 */}
      {user.rank_history && user.rank_history.data && user.rank_history.data.length > 0 && (
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
          </div>
        </motion.div>
      )}

      {/* 月度游戏次数图表 */}
      {user.monthly_playcounts && user.monthly_playcounts.length > 0 && (
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
          </div>
        </motion.div>
      )}

      {/* 评级分布饼图 */}
      {user.statistics?.grade_counts && (
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
          </div>
        </motion.div>
      )}

      {/* 多模式统计对比 */}
      {user.statistics_rulesets && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            各模式表现对比
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(user.statistics_rulesets).map(([mode, stats]) => (
              <div key={mode} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">
                  {mode === 'osu' ? 'Standard' : 
                   mode === 'taiko' ? 'Taiko' :
                   mode === 'fruits' ? 'Catch' :
                   mode === 'mania' ? 'Mania' :
                   mode === 'osurx' ? 'RX' :
                   mode === 'osuap' ? 'AP' : mode}
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
        </motion.div>
      )}
    </div>
  );
};

export default UserPage;
