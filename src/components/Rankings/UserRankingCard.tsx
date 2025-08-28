import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import RankBadge from '../UI/RankBadge';
import LazyBackgroundImage from '../UI/LazyBackgroundImage';
import LazyAvatar from '../UI/LazyAvatar';
import LazyFlag from '../UI/LazyFlag';
import { GAME_MODE_COLORS } from '../../types';
import type { UserRanking, GameMode, RankingType } from '../../types';

interface Props {
  ranking: UserRanking;
  rank: number;
  selectedMode: GameMode;
  rankingType: RankingType;
}

const UserRankingCard: React.FC<Props> = ({ ranking, rank, selectedMode, rankingType }) => {
  const isTopThree = rank <= 3;
  
  // 过滤掉默认封面URL
  const rawCoverUrl = ranking.user.cover_url || ranking.user.cover?.url;
  const defaultCoverUrls = [
    'https://assets-ppy.g0v0.top/user-profile-covers/default.jpeg',
    'https://assets.ppy.sh/user-profile-covers/default.jpeg',
    // 其他可能的默认URL变体
  ];
  const coverUrl = rawCoverUrl && !defaultCoverUrls.includes(rawCoverUrl) ? rawCoverUrl : undefined;

  // 根据是否有背景图片决定渲染方式
  if (!coverUrl) {
    // 没有背景图片时，使用普通 div 和默认背景
    return (
      <div
        className={`relative overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
          isTopThree 
            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/10' 
            : 'bg-white dark:bg-gray-800'
        }`}
      >
        <div className="relative flex items-center gap-3 sm:gap-4 px-4 py-3">
          {/* 排名徽章 */}
          <div className="flex-shrink-0">
            <RankBadge rank={rank} size="sm" />
          </div>

                  {/* 用户头像 */}
        <Link to={`/users/${ranking.user.id}`} className="flex-shrink-0">
          <LazyAvatar
            src={ranking.user.avatar_url}
            alt={ranking.user.username}
            size="md"
            className="hover:border-blue-400 dark:hover:border-blue-500"
          />
        </Link>

          {/* 用户信息 */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/users/${ranking.user.id}`}
              className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
            >
              {ranking.user.username}
            </Link>
            <div className="flex items-center gap-1 mt-0.5">
              {ranking.user.country_code && (
                <>
                  <LazyFlag
                    src={`/image/flag/${ranking.user.country_code.toLowerCase()}.svg`}
                    alt={ranking.user.country_code}
                    className="w-3 h-2 sm:w-4 sm:h-3 rounded-sm flex-shrink-0"
                    //title={ranking.user.country?.name || ranking.user.country_code}
                    data-tooltip-id={`country-tooltip-${ranking.user.id}`}
                    data-tooltip-content={ranking.user.country?.name || ranking.user.country_code}
                  />
                  <Tooltip 
                    id={`country-tooltip-${ranking.user.id}`} 
                    place="bottom" 
                    float={true}
                    style={{ zIndex: 9999 }}
                  />
                </>
              )}
              {ranking.user.team && (
                <>
                  <LazyFlag
                    src={ranking.user.team.flag_url}
                    alt={ranking.user.team.short_name}
                    className="w-3 h-2 sm:w-4 sm:h-3 rounded-sm flex-shrink-0 ml-1"
                    //title={ranking.user.team.short_name}
                    data-tooltip-id={`team-tooltip-${ranking.user.id}`}
                    data-tooltip-content={ranking.user.team.short_name}
                  />
                  <Tooltip 
                    id={`team-tooltip-${ranking.user.id}`} 
                    place="bottom" 
                    float={true}
                    style={{ zIndex: 9999 }}
                  />
                </>
              )}
            </div>
          </div>

          {/* 分数显示 */}
          <div className="text-right flex-shrink-0">
            <div className="text-base sm:text-lg font-bold" style={{ color: GAME_MODE_COLORS[selectedMode] }}>
              {rankingType === 'performance'
                ? `${Math.round(ranking.pp || 0).toLocaleString()}pp`
                : `${(ranking.ranked_score || 0).toLocaleString()}`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 有背景图片时，使用 LazyBackgroundImage
  return (
    <LazyBackgroundImage 
      src={coverUrl} 
      className="overflow-hidden transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      {/* 背景遮罩层 */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/85 to-white/80 dark:from-gray-900/90 dark:via-gray-900/85 dark:to-gray-900/80 hover:from-white/85 hover:via-white/80 hover:to-white/75 dark:hover:from-gray-900/85 dark:hover:via-gray-900/80 dark:hover:to-gray-900/75 transition-all duration-300" />
      
      {/* TOP 3 特效遮罩 */}
      {isTopThree && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/5 to-transparent" />
      )}
      
      <div className="relative flex items-center gap-3 sm:gap-4 px-4 py-3">
        {/* 排名徽章 */}
        <div className="flex-shrink-0">
          <RankBadge rank={rank} size="sm" />
        </div>

        {/* 用户头像 */}
        <Link to={`/users/${ranking.user.id}`} className="flex-shrink-0">
          <LazyAvatar
            src={ranking.user.avatar_url}
            alt={ranking.user.username}
            size="md"
            className="hover:border-blue-400 dark:hover:border-blue-500"
          />
        </Link>

        {/* 用户信息 */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/users/${ranking.user.id}`}
            className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
          >
            {ranking.user.username}
          </Link>
          <div className="flex items-center gap-1 mt-0.5">
            {ranking.user.country_code && (
              <>
                <LazyFlag
                  src={`/image/flag/${ranking.user.country_code.toLowerCase()}.svg`}
                  alt={ranking.user.country_code}
                  className="w-3 h-2 sm:w-4 sm:h-3 rounded-sm flex-shrink-0"
                  //title={ranking.user.country?.name || ranking.user.country_code}
                  data-tooltip-id={`country-tooltip-bg-${ranking.user.id}`}
                  data-tooltip-content={ranking.user.country?.name || ranking.user.country_code}
                />
                <Tooltip 
                  id={`country-tooltip-bg-${ranking.user.id}`} 
                  place="bottom" 
                  float={true}
                  style={{ zIndex: 9999 }}
                />
              </>
            )}
            {ranking.user.team && (
              <>
                <LazyFlag
                  src={ranking.user.team.flag_url}
                  alt={ranking.user.team.short_name}
                  className="w-3 h-2 sm:w-4 sm:h-3 rounded-sm flex-shrink-0 ml-1"
                  //title={ranking.user.team.short_name}
                  data-tooltip-id={`team-tooltip-bg-${ranking.user.id}`}
                  data-tooltip-content={ranking.user.team.short_name}
                />
                <Tooltip 
                  id={`team-tooltip-bg-${ranking.user.id}`} 
                  place="bottom" 
                  float={true}
                  style={{ zIndex: 9999 }}
                />
              </>
            )}
          </div>
        </div>

        {/* 分数显示 */}
        <div className="text-right flex-shrink-0">
          <div className="text-base sm:text-lg font-bold" style={{ color: GAME_MODE_COLORS[selectedMode] }}>
            {rankingType === 'performance'
              ? `${Math.round(ranking.pp || 0).toLocaleString()}pp`
              : `${(ranking.ranked_score || 0).toLocaleString()}`}
          </div>
        </div>
      </div>
    </LazyBackgroundImage>
  );
};

export default UserRankingCard;
