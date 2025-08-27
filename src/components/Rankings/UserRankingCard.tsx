import React from 'react';
import { Link } from 'react-router-dom';
import RankBadge from '../UI/RankBadge';
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

  return (
    <div
      className={`relative overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
        isTopThree ? 'bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-900/10' : ''
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 px-4 py-3">
        {/* 排名徽章 */}
        <div className="flex-shrink-0">
          <RankBadge rank={rank} size="sm" />
        </div>

        {/* 用户头像 */}
        <Link to={`/users/${ranking.user.id}`} className="flex-shrink-0">
          <img
            src={ranking.user.avatar_url || '/default.jpg'}
            alt={ranking.user.username}
            className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200"
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
              <img
                src={`/image/flag/${ranking.user.country_code.toLowerCase()}.svg`}
                alt={ranking.user.country_code}
                className="w-3 h-2 sm:w-4 sm:h-3 rounded-sm flex-shrink-0"
                title={ranking.user.country?.name || ranking.user.country_code}
              />
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {ranking.user.country?.name || ranking.user.country_code}
            </span>
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
};

export default UserRankingCard;
