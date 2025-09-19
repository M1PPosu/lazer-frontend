import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import type { UserActivity } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FaTrophy, FaCrown, FaUpload, FaEdit, FaHeart, FaUser } from 'react-icons/fa';

interface UserRecentActivityProps {
  userId: number;
  className?: string;
}

// 时间格式化函数
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分钟前`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}小时前`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}天前`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}个月前`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}年前`;
  }
};

// 成就图标组件
const AchievementIcon: React.FC<{ slug: string; alt: string; className?: string }> = ({ slug, alt, className = "w-6 h-6" }) => {
  const [imgSrc, setImgSrc] = useState(`/image/achievement_images/${slug}@2x.png`);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      // 尝试普通版本
      setImgSrc(`/image/achievement_images/${slug}.png`);
      setHasError(true);
    }
  };

  return (
    <img 
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

// 评级图标映射
const getRankIcon = (rank: string) => {
  const rankImageMap: Record<string, string> = {
    'SSH': '/image/grades/GradeSmall-SS-Silver.svg',  // SS-Silver
    'SS': '/image/grades/GradeSmall-SS.svg',
    'SH': '/image/grades/GradeSmall-S-Silver.svg',   // S-Silver
    'S': '/image/grades/GradeSmall-S.svg',
    'A': '/image/grades/GradeSmall-A.svg',
    'B': '/image/grades/GradeSmall-B.svg',
    'C': '/image/grades/GradeSmall-C.svg',
    'D': '/image/grades/GradeSmall-D.svg',
    'F': '/image/grades/GradeSmall-F.svg',
  };
  return rankImageMap[rank] || rankImageMap['F'];
};

// 活动类型图标映射
const getActivityIcon = (type: string) => {
  const iconClass = "w-3 h-3";
  switch (type) {
    case 'rank':
      return <FaTrophy className={`text-yellow-500 ${iconClass}`} />;
    case 'rank_lost':
      return <FaTrophy className={`text-gray-400 ${iconClass}`} />;
    case 'achievement':
      return <FaCrown className={`text-purple-500 ${iconClass}`} />;
    case 'beatmapset_upload':
      return <FaUpload className={`text-blue-500 ${iconClass}`} />;
    case 'beatmapset_approve':
    case 'beatmapset_revive':
    case 'beatmapset_update':
      return <FaEdit className={`text-green-500 ${iconClass}`} />;
    case 'user_support_again':
    case 'user_support_first':
    case 'user_support_gift':
      return <FaHeart className={`text-red-500 ${iconClass}`} />;
    case 'username_change':
    case 'userpageUpdate':
      return <FaUser className={`text-blue-400 ${iconClass}`} />;
    default:
      return <FaTrophy className={`text-gray-500 ${iconClass}`} />;
  }
};

// 获取活动描述
const getActivityDescription = (activity: UserActivity) => {
  switch (activity.type) {
    case 'rank':
      return (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">在</span>
          <a 
            href={activity.beatmap?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
            title={activity.beatmap?.title}
          >
            {activity.beatmap?.title}
          </a>
          <span className="text-xs sm:text-sm">中获得了</span>
          {activity.scorerank && (
            <img 
              src={getRankIcon(activity.scorerank || 'C')} 
              alt={activity.scorerank}
              className="w-5 h-5"
            />
          )}
          <span className="text-xs sm:text-sm">评级</span>
          {activity.rank && (
            <>
              <span className="text-xs sm:text-sm">排名第</span>
              <span className="font-bold text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm">#{activity.rank}</span>
            </>
          )}
        </div>
      );
    case 'rank_lost':
      return (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">在</span>
          <a 
            href={activity.beatmap?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
            title={activity.beatmap?.title}
          >
            {activity.beatmap?.title}
          </a>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">中失去了第一名</span>
        </div>
      );
    case 'achievement':
      return (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">获得了成就</span>
          {activity.achievement && (
            <>
              <AchievementIcon 
                slug={activity.achievement.slug}
                alt={activity.achievement.name || activity.achievement.slug}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <a
                href={`https://inex.osekai.net/medals/${activity.achievement.name || activity.achievement.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none"
                title={activity.achievement.name || activity.achievement.slug}
              >
                {activity.achievement.name || activity.achievement.slug}
              </a>
            </>
          )}
        </div>
      );
    case 'beatmapset_upload':
      return (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">上传了谱面</span>
          {activity.beatmap && (
            <a 
              href={activity.beatmap.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
              title={activity.beatmap.title}
            >
              {activity.beatmap.title}
            </a>
          )}
        </div>
      );
    case 'beatmapset_approve':
      return (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">谱面被ranked：</span>
          {activity.beatmap && (
            <a 
              href={activity.beatmap.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
              title={activity.beatmap.title}
            >
              {activity.beatmap.title}
            </a>
          )}
        </div>
      );
    case 'username_change':
      return <span className="text-xs sm:text-sm">更改了用户名</span>;
    case 'user_support_again':
      return <span className="text-xs sm:text-sm">再次成为了Supporter</span>;
    case 'user_support_first':
      return <span className="text-xs sm:text-sm">首次成为了Supporter</span>;
    case 'user_support_gift':
      return <span className="text-xs sm:text-sm">获得了Supporter赠送</span>;
    default:
      return <span className="text-xs sm:text-sm">进行了活动</span>;
  }
};

const UserRecentActivity: React.FC<UserRecentActivityProps> = ({ userId, className = '' }) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const loadActivities = async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;
      
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await userAPI.getRecentActivity(userId, 6, currentOffset);
      
      // 假设 API 返回一个数组，没有 has_more 字段时，判断返回的数据是否小于请求的数量
      const newActivities = Array.isArray(response) ? response : [];
      const hasMoreData = newActivities.length === 6; // 如果返回的数量等于请求的数量，可能还有更多

      if (reset) {
        setActivities(newActivities);
        setOffset(newActivities.length);
      } else {
        setActivities(prev => [...prev, ...newActivities]);
        setOffset(prev => prev + newActivities.length);
      }

      setHasMore(hasMoreData);
    } catch (err) {
      console.error('Failed to load user activities:', err);
      setError('加载用户活动失败');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (userId) {
      setOffset(0);
      loadActivities(true);
    }
  }, [userId]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadActivities(false);
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-osu-pink rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              最近活动
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
              最近活动
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
            最近活动
          </h3>
        </div>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
          暂无最近活动
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-2 p-2 rounded border border-gray-200/50 dark:border-gray-600/30"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="text-gray-900 dark:text-gray-100">
                  {getActivityDescription(activity)}
                </div>
                {/* 手机端时间显示在描述下方 */}
                <div className="flex items-center gap-2 mt-1 sm:hidden">
                  {activity.mode && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                      {activity.mode}
                    </span>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(activity.createdAt)}
                  </div>
                </div>
              </div>

              {/* 桌面端时间显示在右侧 */}
              <div className="flex-shrink-0 items-center gap-2 hidden sm:flex">
                {activity.mode && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                    {activity.mode}
                  </span>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(activity.createdAt)}
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="min-w-[80px] sm:min-w-[100px] h-[32px] px-3 py-1.5 bg-osu-pink hover:bg-osu-pink/90 disabled:bg-gray-400 text-white rounded text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {loadingMore ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>加载中...</span>
                  </>
                ) : (
                  <span>加载更多</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserRecentActivity;