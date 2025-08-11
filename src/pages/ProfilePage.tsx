import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FiMapPin, FiCalendar, FiAward, FiClock } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import GameModeSelector from '../components/UI/GameModeSelector';
import Avatar from '../components/UI/Avatar';
import type { GameMode } from '../types';
import { GAME_MODE_COLORS } from '../types';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, updateUserMode } = useAuth();
  const [selectedMode, setSelectedMode] = useState<GameMode>('osu');

  // 初始加载时设置默认模式，不要在每次模式改变时都重新获取用户数据
  useEffect(() => {
    if (user && !user.statistics) {
      updateUserMode(selectedMode);
    }
  }, [user, updateUserMode]); // 移除selectedMode依赖

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            无法加载个人资料
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            请尝试刷新页面
          </p>
        </div>
      </div>
    );
  }

  const stats = user.statistics;
  const formatNumber = (num?: number) => num?.toLocaleString() ?? '0';
  const formatTime = (seconds?: number) => {
    if (!seconds) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'text-gray-500';
    if (accuracy >= 98) return 'text-green-500';
    if (accuracy >= 95) return 'text-blue-500';
    if (accuracy >= 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <Avatar
              userId={user.id}
              username={user.username}
              avatarUrl={user.avatar_url}
              size="xl"
              className="md:w-32 md:h-32"
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {user.username}
              </h1>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 dark:text-gray-300 mb-4">
                              <div className="flex items-center">
                <FiMapPin className="mr-2" />
                {user.country_code}
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                加入于 {formatDate(user.join_date)}
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2" />
                最后上线 {formatDate(user.last_visit)}
              </div>
              </div>

              {user.is_supporter && (
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <FiAward className="mr-1" />
                支持者
              </div>
              )}
            </div>

            {/* Global Rank */}
            {stats?.global_rank && (
              <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                #{formatNumber(stats.global_rank)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">全球排名</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Game Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            游戏模式
          </h2>
          <GameModeSelector
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
          />
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Performance Points */}
          <div className="card text-center">
            <div 
              className="text-3xl font-bold mb-2"
              style={{ color: GAME_MODE_COLORS[selectedMode] }}
            >
              {formatNumber(stats?.pp)}pp
            </div>
            <div className="text-gray-600 dark:text-gray-300">表现分</div>
          </div>

          {/* Accuracy */}
          <div className="card text-center">
            <div className={`text-3xl font-bold mb-2 ${getAccuracyColor(stats?.accuracy)}`}>
              {stats?.accuracy?.toFixed(2)}%
            </div>
            <div className="text-gray-600 dark:text-gray-300">准确率</div>
          </div>

          {/* Play Count */}
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {formatNumber(stats?.play_count)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">游戏次数</div>
          </div>

          {/* Play Time */}
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {formatTime(stats?.play_time)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">游戏时间</div>
          </div>
        </motion.div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              分数统计
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">排名分数</span>
                <span className="font-semibold">{formatNumber(stats?.ranked_score)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">总分数</span>
                <span className="font-semibold">{formatNumber(stats?.total_score)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">最大连击</span>
                <span className="font-semibold">{formatNumber(stats?.maximum_combo)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">总命中数</span>
                <span className="font-semibold">{formatNumber(stats?.total_hits)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">回放观看数</span>
                <span className="font-semibold">{formatNumber(stats?.replays_watched)}</span>
              </div>
            </div>
          </motion.div>

          {/* Hit Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              命中统计
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">300分</span>
                <span className="font-semibold text-blue-500">{formatNumber(stats?.count_300)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">100分</span>
                <span className="font-semibold text-green-500">{formatNumber(stats?.count_100)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">50分</span>
                <span className="font-semibold text-yellow-500">{formatNumber(stats?.count_50)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">未命中</span>
                <span className="font-semibold text-red-500">{formatNumber(stats?.count_miss)}</span>
              </div>
            </div>
          </motion.div>

          {/* Grade Statistics */}
          {stats?.grade_counts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="card lg:col-span-2"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                等级统计
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {formatNumber(stats.grade_counts.ssh)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">SSH</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300 mb-1">
                    {formatNumber(stats.grade_counts.ss)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">SS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-300 mb-1">
                    {formatNumber(stats.grade_counts.sh)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">SH</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400 mb-1">
                    {formatNumber(stats.grade_counts.s)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">S</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">
                    {formatNumber(stats.grade_counts.a)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">A</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
