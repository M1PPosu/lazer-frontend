import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userAPI } from '../../utils/api';
import type { BestScore, GameMode, User } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import LazyBackgroundImage from '../UI/LazyBackgroundImage';

interface UserBestScoresProps {
  userId: number;
  selectedMode: GameMode;
  user?: User;
  className?: string;
}

// 时间格式化函数
const formatTimeAgo = (dateString: string, t: any): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return t('profile.activities.timeAgo.justNow');
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return t('profile.activities.timeAgo.minutesAgo', { count: minutes });
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return t('profile.activities.timeAgo.hoursAgo', { count: hours });
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return t('profile.activities.timeAgo.daysAgo', { count: days });
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return t('profile.activities.timeAgo.monthsAgo', { count: months });
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return t('profile.activities.timeAgo.yearsAgo', { count: years });
  }
};

// 评级图标映射
const getRankIcon = (rank: string) => {
  const rankImageMap: Record<string, string> = {
    // SS 系列
    XH: '/image/grades/GradeSmall-SS-Silver.svg', // 银 SS（SSH）
    X:  '/image/grades/GradeSmall-SS.svg',        // 金 SS（SS）

    // S 系列
    SH: '/image/grades/GradeSmall-S-Silver.svg',  // 银 S
    S:  '/image/grades/GradeSmall-S.svg',         // 金 S

    // 其他等级
    A:  '/image/grades/GradeSmall-A.svg',
    B:  '/image/grades/GradeSmall-B.svg',
    C:  '/image/grades/GradeSmall-C.svg',
    D:  '/image/grades/GradeSmall-D.svg',
    F:  '/image/grades/GradeSmall-F.svg', 
  };

  return rankImageMap[rank] || rankImageMap['F'];
};


// MOD 图标组件
const ModIcon: React.FC<{ mod: { acronym: string } }> = ({ mod }) => {
  return (
    <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
      {mod.acronym}
    </div>
  );
};

// 模组组件
const ModsDisplay: React.FC<{ mods: Array<{ acronym: string }> }> = ({ mods }) => {
  if (!mods || mods.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {mods.map((mod, index) => (
        <ModIcon key={index} mod={mod} />
      ))}
    </div>
  );
};

// 单个成绩卡片组件 - 基于 osu! 官方设计
const ScoreCard: React.FC<{ score: BestScore; t: any }> = ({ score, t }) => {
  // 必取字段处理
  const rank = score.rank; // 等级徽章（S/A/B/C/D/F）
  const title = score.beatmapset?.title_unicode || score.beatmapset?.title || 'Unknown Title';
  const artist = score.beatmapset?.artist_unicode || score.beatmapset?.artist || 'Unknown Artist';
  const version = score.beatmap?.version || 'Unknown'; // 难度名
  const endedAt = formatTimeAgo(score.ended_at, t); // 相对时间
  const accuracy = (score.accuracy * 100).toFixed(2); // 命中率（百分比）
  const originalPp = Math.round(score.pp || 0); // 原始pp
  const mods = score.mods || []; // MOD列表

  const beatmapUrl = score.beatmap?.url || '#';
  const coverImage = score.beatmapset?.covers?.['cover@2x'] || score.beatmapset?.covers?.cover;

  return (
    <LazyBackgroundImage 
      src={coverImage}
      className="relative overflow-hidden border-b border-gray-100 dark:border-gray-700/50 last:border-b-0"
    >
      {/* 渐变遮罩层确保文字可读性 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/70 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-800/70" />
      
      <div className="relative bg-transparent hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-150 group">
        {/* 桌面端布局 */}
        <div className="hidden sm:block">
          {/* 主要内容区域 */}
          <div className="flex items-center h-12 pl-5 pr-24">
            {/* 等级徽章 */}
            <div className="flex-shrink-0 mr-3">
              <img 
                src={getRankIcon(rank)} 
                alt={rank}
                className="w-12 h-6 object-contain"
              />
            </div>

            {/* 谱面信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col -space-y-0.5">
                {/* 标题和艺术家 */}
                <div className="flex items-baseline gap-1 text-sm leading-tight">
                  <a 
                    href={beatmapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors"
                    title={title}
                  >
                    {title}
                  </a>
                  <span className="text-gray-600 dark:text-gray-400 text-xs flex-shrink-0">
                    {t('profile.bestScores.by')}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
                    {artist}
                  </span>
                </div>
                
                {/* 难度名和时间 */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    {version}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {endedAt}
                  </span>
                </div>
              </div>
            </div>

            {/* 中间成绩数据 */}
            <div className="flex-shrink-0 flex items-center gap-2 mr-6">
              {/* MOD图标 + 准确率 */}
              <ModsDisplay mods={mods} />
              <div className="text-sm font-bold text-osu-blue dark:text-blue-400 ml-2">
                {accuracy}%
              </div>
            </div>
          </div>

          {/* 右侧性能区域 */}
          <div className="absolute right-0 top-0 h-full w-20 flex items-center justify-center">
            {/* PP 值 */}
            <div className="text-sm font-bold text-osu-pink dark:text-pink-400">
              {originalPp} PP
            </div>
          </div>
        </div>

        {/* 手机端布局 */}
        <div className="block sm:hidden p-4">
          <div className="flex items-start gap-3">
            {/* 等级徽章 */}
            <div className="flex-shrink-0">
              <img 
                src={getRankIcon(rank)} 
                alt={rank}
                className="w-10 h-5 object-contain"
              />
            </div>

            {/* 主要内容 */}
            <div className="flex-1 min-w-0">
              {/* 第一行：标题和艺术家 */}
              <div className="flex items-baseline gap-1 text-sm leading-tight mb-1">
                <a 
                  href={beatmapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors"
                  title={title}
                >
                  {title}
                </a>
                <span className="text-gray-600 dark:text-gray-400 text-xs flex-shrink-0">
                  {t('profile.bestScores.by')}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  {artist}
                </span>
              </div>
              
              {/* 第二行：难度名和时间 */}
              <div className="flex items-center gap-3 text-xs mb-2">
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  {version}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {endedAt}
                </span>
              </div>

              {/* 第三行：MOD、准确率和PP */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ModsDisplay mods={mods} />
                  <div className="text-sm font-bold text-osu-blue dark:text-blue-400">
                    {accuracy}%
                  </div>
                </div>
                <div className="text-sm font-bold text-osu-pink dark:text-pink-400">
                  {originalPp} PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LazyBackgroundImage>
  );
};

const UserBestScores: React.FC<UserBestScoresProps> = ({ userId, selectedMode, user, className = '' }) => {
  const { t } = useTranslation();
  const [scores, setScores] = useState<BestScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const loadScores = async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;
      
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await userAPI.getBestScores(userId, selectedMode, 6, currentOffset);
      
      // 处理 API 响应 - 根据 osu! API，应该直接返回 SoloScoreInfo[] 数组
      const newScores = Array.isArray(response) ? response : [];
      
      // 根据总成绩数量判断是否还有更多数据
      const totalScores = user?.scores_best_count || 0;
      const currentTotal = reset ? newScores.length : scores.length + newScores.length;
      const hasMoreData = currentTotal < totalScores && newScores.length === 6;

      if (reset) {
        setScores(newScores);
        setOffset(newScores.length);
      } else {
        setScores(prev => [...prev, ...newScores]);
        setOffset(prev => prev + newScores.length);
      }

      setHasMore(hasMoreData);
    } catch (err) {
      console.error('Failed to load user best scores:', err);
      setError(t('profile.bestScores.loadFailed'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (userId) {
      setOffset(0);
      loadScores(true);
    }
  }, [userId, selectedMode]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadScores(false);
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-osu-pink rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('profile.bestScores.title')}
            </h3>
          </div>
        </div>
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-osu-pink rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('profile.bestScores.title')}
            </h3>
          </div>
        </div>
        <div className="text-center text-red-500 dark:text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-osu-pink rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t('profile.bestScores.title')}
          </h3>
          {user?.scores_best_count && (
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({user.scores_best_count})
            </span>
          )}
        </div>
      </div>
      
      {scores.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
          {t('profile.bestScores.noScores')}
        </div>
      ) : (
        <div className="shadow-sm overflow-hidden rounded-lg">
          {/* 头部圆角div */}
          <div className="bg-white dark:bg-gray-800 h-[30px] rounded-t-lg border-x border-t border-gray-200/50 dark:border-gray-600/30 flex items-center justify-center">
            <div className="w-16 h-1 bg-osu-pink rounded-full"></div>
          </div>
          
          {/* 主要内容区域 - 无圆角 */}
          <div className="bg-white dark:bg-gray-800 border-x border-gray-200/50 dark:border-gray-600/30">
            {scores.map((score) => (
              <ScoreCard key={score.id} score={score} t={t} />
            ))}

            {hasMore && (
              <div className="flex justify-center p-4 border-t border-gray-100 dark:border-gray-700/50">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="min-w-[80px] sm:min-w-[100px] h-[32px] px-3 py-1.5 bg-osu-pink hover:bg-osu-pink/90 disabled:bg-gray-400 text-white rounded text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  {loadingMore ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>{t('profile.bestScores.loading')}</span>
                    </>
                  ) : (
                    <span>{t('profile.bestScores.loadMore')}</span>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* 尾部圆角div */}
          <div className="bg-white dark:bg-gray-800 h-[30px] rounded-b-lg border-x border-b border-gray-200/50 dark:border-gray-600/30 flex items-center justify-center">
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBestScores;
