import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userAPI } from '../../utils/api';
import type { BestScore, GameMode, User } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import LazyBackgroundImage from '../UI/LazyBackgroundImage';
import BeatmapLink from '../UI/BeatmapLink';

interface UserBestScoresProps {
  userId: number;
  selectedMode: GameMode;
  user?: User;
  className?: string;
}

// Time-ago formatter
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

// Rank icon map
const getRankIcon = (rank: string) => {
  const rankImageMap: Record<string, string> = {
    // SS
    XH: '/image/grades/GradeSmall-SS-Silver.svg',
    X:  '/image/grades/GradeSmall-SS.svg',
    // S
    SH: '/image/grades/GradeSmall-S-Silver.svg',
    S:  '/image/grades/GradeSmall-S.svg',
    // Others
    A:  '/image/grades/GradeSmall-A.svg',
    B:  '/image/grades/GradeSmall-B.svg',
    C:  '/image/grades/GradeSmall-C.svg',
    D:  '/image/grades/GradeSmall-D.svg',
    F:  '/image/grades/GradeSmall-F.svg',
  };

  return rankImageMap[rank] || rankImageMap['F'];
};


// MOD icon
const ModIcon: React.FC<{ mod: { acronym: string } }> = ({ mod }) => {
  return (
    <div className="h-5 px-2 rounded-md border border-white/30 dark:border-white/10 bg-white/40 dark:bg-gray-900/30 text-[10px] font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-center">
      {mod.acronym}
    </div>
  );
};

// MOD list
const ModsDisplay: React.FC<{ mods: Array<{ acronym: string }> }> = ({ mods }) => {
  if (!mods || mods.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {mods.map((mod, index) => (
        <ModIcon key={index} mod={mod} />
      ))}
    </div>
  );
};

// Single score row
const ScoreCard: React.FC<{ score: BestScore; t: any }> = ({ score, t }) => {
  // Required fields
  const rank = score.rank;
  const title = score.beatmapset?.title_unicode || score.beatmapset?.title || 'Unknown Title';
  const artist = score.beatmapset?.artist_unicode || score.beatmapset?.artist || 'Unknown Artist';
  const version = score.beatmap?.version || 'Unknown';
  const endedAt = formatTimeAgo(score.ended_at, t);
  const accuracy = (score.accuracy * 100).toFixed(2);
  const originalPp = Math.round(score.pp || 0);
  const mods = score.mods || [];

  const beatmapUrl = score.beatmap?.url || '#';
  const coverImage = score.beatmapset?.covers?.['cover@2x'] || score.beatmapset?.covers?.cover;

  return (
    <LazyBackgroundImage 
      src={coverImage}
      className="relative overflow-hidden border-b border-white/20 dark:border-white/10 last:border-b-0"
    >
      {/* Softer overlay for better blend with profile theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/15 to-white/10 dark:from-[#0e1224]/85 dark:via-[#0e1224]/70 dark:to-[#0e1224]/55" />
      
      <div className="relative bg-transparent hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-150 group">
        {/* Desktop */}
        <div className="hidden sm:block">
          {/* Main area */}
          <div className="flex items-center h-12 pl-5 pr-24">
            {/* Rank icon */}
            <div className="flex-shrink-0 mr-3">
              <img 
                src={getRankIcon(rank)} 
                alt={rank}
                className="w-12 h-6 object-contain"
              />
            </div>

            {/* Beatmap info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col -space-y-0.5">
                {/* Title + artist */}
                <div className="flex items-baseline gap-1 text-sm leading-tight">
                  <BeatmapLink
                    beatmapUrl={beatmapUrl}
                    className="font-semibold text-gray-900 dark:text-white hover:text-[#6f13f0] dark:hover:text-[#b69cff] truncate transition-colors"
                    title={title}
                  >
                    {title}
                  </BeatmapLink>
                  <span className="text-gray-600 dark:text-gray-400 text-xs flex-shrink-0">
                    {t('profile.bestScores.by')}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
                    {artist}
                  </span>
                </div>
                
                {/* Diff + time */}
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

            {/* Mods + accuracy */}
            <div className="flex-shrink-0 flex items-center gap-2 mr-6">
              <ModsDisplay mods={mods} />
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6] ml-2">
                {accuracy}%
              </div>
            </div>
          </div>

          {/* Right PP */}
          <div className="absolute right-0 top-0 h-full w-20 flex items-center justify-center">
            <div className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6]">
              {originalPp} PP
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="block sm:hidden p-4">
          <div className="flex items-start gap-3">
            {/* Rank icon */}
            <div className="flex-shrink-0">
              <img 
                src={getRankIcon(rank)} 
                alt={rank}
                className="w-10 h-5 object-contain"
              />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Title + artist */}
              <div className="flex items-baseline gap-1 text-sm leading-tight mb-1">
                <BeatmapLink
                  beatmapUrl={beatmapUrl}
                  className="font-semibold text-gray-900 dark:text-white hover:text-[#6f13f0] dark:hover:text-[#b69cff] truncate transition-colors"
                  title={title}
                >
                  {title}
                </BeatmapLink>
                <span className="text-gray-600 dark:text-gray-400 text-xs flex-shrink-0">
                  {t('profile.bestScores.by')}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  {artist}
                </span>
              </div>
              
              {/* Diff + time */}
              <div className="flex items-center gap-3 text-xs mb-2">
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  {version}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {endedAt}
                </span>
              </div>

              {/* Mods + acc + PP */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ModsDisplay mods={mods} />
                  <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6]">
                    {accuracy}%
                  </div>
                </div>
                <div className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6]">
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
        // When resetting, also reset hasMore
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const response = await userAPI.getBestScores(userId, selectedMode, 6, currentOffset);
      
      // According to osu! API, the response should be an array of scores
      const newScores = Array.isArray(response) ? response : [];
      
      // Determine if more data exists
      let hasMoreData: boolean;
      
      if (reset) {
        hasMoreData = newScores.length === 6;
        setScores(newScores);
        setOffset(newScores.length);
      } else {
        const totalScores = user?.scores_best_count || 0;
        const currentTotal = scores.length + newScores.length;
        hasMoreData = newScores.length === 6 && currentTotal < totalScores;
        setScores(prev => [...prev, ...newScores]);
        setOffset(prev => prev + newScores.length);
      }

      setHasMore(hasMoreData);
    } catch (err) {
      console.error('Failed to load user best scores:', err);
      setError(t('profile.bestScores.loadFailed'));
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (userId) {
      // Reset all relevant state
      setOffset(0);
      setScores([]);
      setError(null);
      setHasMore(true);
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
        <div className="shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_40px_-20px_rgba(0,0,0,0.45)] overflow-hidden rounded-lg border border-white/10">
          {/* top cap */}
          <div className="bg-white/20 dark:bg-white/5 h-[30px] rounded-t-lg border-x border-t border-white/20 dark:border-white/10 flex items-center justify-center">
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6]"></div>
          </div>
          
          {/* main content (no rounded corners) */}
          <div className="bg-white/10 dark:bg-white/5 border-x border-white/20 dark:border-white/10">
            {scores.map((score) => (
              <ScoreCard key={score.id} score={score} t={t} />
            ))}

            {hasMore && (
              <div className="flex justify-center p-4 border-t border-white/20 dark:border-white/10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="min-w-[80px] sm:min-w-[100px] h-[32px] px-3 py-1.5 rounded text-xs sm:text-sm text-white
                             bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6]
                             shadow-[0_10px_24px_-10px_rgba(139,92,246,0.45)]
                             hover:brightness-110 active:brightness-95 disabled:opacity-60
                             transition-all flex items-center justify-center gap-1.5"
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
          
          {/* bottom cap */}
          <div className="bg-white/20 dark:bg-white/5 h-[30px] rounded-b-lg border-x border-b border-white/20 dark:border-white/10 flex items-center justify-center">
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBestScores;
