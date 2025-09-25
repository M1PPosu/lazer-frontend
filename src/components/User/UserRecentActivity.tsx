import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import type { UserActivity } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FaTrophy, FaCrown, FaUpload, FaEdit, FaHeart, FaUser } from 'react-icons/fa';

interface UserRecentActivityProps {
  userId: number;
  className?: string;
}

// Time formatting function
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}Minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}Hours ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} Days ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}Months ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}Years ago`;
  }
};

// Achievement Icon Component
const AchievementIcon: React.FC<{ slug: string; alt: string; className?: string }> = ({ slug, alt, className = "w-6 h-6" }) => {
  const [imgSrc, setImgSrc] = useState(`/image/achievement_images/${slug}@2x.png`);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      // Try the normal version
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

// Rating icon mapping
const getRankIcon = (rank: string) => {
  const rankImageMap: Record<string, string> = {
    'SS': '/image/grades/GradeSmall-SS.svg',
    'S': '/image/grades/GradeSmall-S.svg',
    'A': '/image/grades/GradeSmall-A.svg',
    'B': '/image/grades/GradeSmall-B.svg',
    'C': '/image/grades/GradeSmall-C.svg',
    'D': '/image/grades/GradeSmall-D.svg',
    'F': '/image/grades/GradeSmall-F.svg',
  };
  return rankImageMap[rank] || rankImageMap['F'];
};

// Activity type icon mapping
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

// Get the activity description (unchanged text)
const getActivityDescription = (activity: UserActivity) => {
  switch (activity.type) {
    case 'rank':
      return (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">Score</span>
          <a
            href={activity.beatmap?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
            title={activity.beatmap?.title}
          >
            {activity.beatmap?.title}
          </a>
          <span className="text-xs sm:text-sm">Obtained in</span>
          {activity.scorerank && (
            <img
              src={getRankIcon(activity.scorerank || 'C')}
              alt={activity.scorerank}
              className="w-5 h-5"
            />
          )}
          <span className="text-xs sm:text-sm">Rating</span>
          {activity.rank && (
            <>
              <span className="text-xs sm:text-sm">Ranked No. 1</span>
              <span className="font-bold text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm">#{activity.rank}</span>
            </>
          )}
        </div>
      );
    case 'rank_lost':
      return (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">Place</span>
          <a
            href={activity.beatmap?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
            title={activity.beatmap?.title}
          >
            {activity.beatmap?.title}
          </a>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Lost first place</span>
        </div>
      );
    case 'achievement':
      return (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">Achievements</span>
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
          <span className="text-xs sm:text-sm">Uploaded the score</span>
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
          <span className="text-xs sm:text-sm">Spectrumranked:</span>
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
      return <span className="text-xs sm:text-sm">Change username</span>;
    case 'user_support_again':
      return <span className="text-xs sm:text-sm">Become a Supporter</span>;
    case 'user_support_first':
      return <span className="text-xs sm:text-sm">Become for the first time Supporter</span>;
    case 'user_support_gift':
      return <span className="text-xs sm:text-sm">ObtainedSupporterGift</span>;
    default:
      return <span className="text-xs sm:text-sm">Activity carried out</span>;
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

      // Assumptions API Return an array, no has_more In the field, determine whether the returned data is less than the requested number
      const newActivities = Array.isArray(response) ? response : [];
      const hasMoreData = newActivities.length === 6; // If the number returned is equal to the number of requests, there may be more

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
      setError('Failed to load user activity');
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
              Recent Events
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
              Recent Events
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
            Recent Events
          </h3>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
          None yet.
        </div>
      ) : (
        <div className="shadow-sm overflow-hidden rounded-lg">
          {/* top cap to match other cards */}
          <div className="bg-white dark:bg-gray-800 h-[30px] rounded-t-lg border-x border-t border-gray-200/50 dark:border-gray-600/30 flex items-center justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#ED8EA6] rounded-full"></div>
          </div>

          {/* list */}
          <div className="bg-white/60 dark:bg-gray-800/50 border-x border-gray-200/50 dark:border-gray-600/30">
            <div className="space-y-2 p-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-2 p-2 rounded-md
                             bg-white/40 dark:bg-gray-900/30 backdrop-blur-sm
                             border border-white/20 dark:border-white/10
                             hover:bg-white/50 dark:hover:bg-gray-900/40
                             transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="text-gray-900 dark:text-gray-100">
                      {getActivityDescription(activity)}
                    </div>
                    {/* Mobile time displayexistDescription below */}
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

                  {/* Desktop time displayexistRight side */}
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
                    className="min-w-[100px] h-[34px] px-4 rounded-md text-white text-xs sm:text-sm
                               bg-gradient-to-r from-[#8B5CF6] to-[#ED8EA6]
                               shadow-[0_8px_22px_rgba(139,92,246,0.28)]
                               hover:brightness-105 disabled:opacity-60
                               transition flex items-center justify-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>loading...</span>
                      </>
                    ) : (
                      <span>Load more</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* bottom cap */}
          <div className="bg-white dark:bg-gray-800 h-[30px] rounded-b-lg border-x border-b border-gray-200/50 dark:border-gray-600/30" />
        </div>
      )}
    </div>
  );
};

export default UserRecentActivity;
