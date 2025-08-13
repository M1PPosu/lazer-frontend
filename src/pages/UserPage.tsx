import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userAPI } from '../utils/api';
import type { User, GameMode } from '../types';
import { GAME_MODE_COLORS } from '../types';
import Avatar from '../components/UI/Avatar';
import GameModeSelector from '../components/UI/GameModeSelector';
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* 用户基本信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* 头像 */}
          <div className="flex-shrink-0">
            <Avatar 
              userId={user.id} 
              username={user.username} 
              avatarUrl={user.avatar_url}
              size="2xl" 
            />
          </div>

          {/* 用户信息 */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h1>
              {user.country_code && (
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={`https://flagcdn.com/w20/${user.country_code.toLowerCase()}.png`}
                    alt={user.country_code}
                    className="w-5 h-auto"
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {user.country_code}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <span className="text-gray-600 dark:text-gray-400">用户 ID:</span>
                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                  {user.id}
                </span>
              </div>
              {user.join_date && (
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <span className="text-gray-600 dark:text-gray-400">加入时间:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {new Date(user.join_date).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 游戏模式选择器 */}
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              游戏模式
            </h2>
            <GameModeSelector
              selectedMode={selectedMode}
              onModeChange={handleModeChange}
            />
          </div>
        </div>
      </motion.div>

      {/* 统计信息 */}
      {user.statistics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  全球排名
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  #{user.statistics.global_rank?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${GAME_MODE_COLORS[selectedMode]}20` }}
              >
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: GAME_MODE_COLORS[selectedMode] }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  国家排名
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  #{user.statistics.country_rank?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${GAME_MODE_COLORS[selectedMode]}20` }}
              >
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: GAME_MODE_COLORS[selectedMode] }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  表现分数
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(user.statistics.pp || 0).toLocaleString()}pp
                </p>
              </div>
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${GAME_MODE_COLORS[selectedMode]}20` }}
              >
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: GAME_MODE_COLORS[selectedMode] }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  准确率
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.statistics.hit_accuracy?.toFixed(2) || '0.00'}%
                </p>
              </div>
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${GAME_MODE_COLORS[selectedMode]}20` }}
              >
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: GAME_MODE_COLORS[selectedMode] }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              游戏统计
            </h3>
            <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              等级信息
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">当前等级</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(user.statistics.level?.current || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: GAME_MODE_COLORS[selectedMode],
                    width: `${((user.statistics.level?.progress || 0) * 100)}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>进度: {((user.statistics.level?.progress || 0) * 100).toFixed(1)}%</span>
                <span>下一级还需: {Math.ceil((1 - (user.statistics.level?.progress || 0)) * 100)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserPage;
