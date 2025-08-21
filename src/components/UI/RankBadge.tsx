import React from 'react';
import { FiAward } from 'react-icons/fi';

interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'md' }) => {
  const isTopThree = rank <= 3;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  const getRankStyle = () => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
          text: 'text-yellow-900',
          shadow: 'shadow-yellow-400/50'
        };
      case 2:
        return {
          bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
          text: 'text-gray-900',
          shadow: 'shadow-gray-400/50'
        };
      case 3:
        return {
          bg: 'bg-gradient-to-br from-amber-600 to-amber-800',
          text: 'text-white',
          shadow: 'shadow-amber-600/50'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-600 dark:text-gray-300',
          shadow: ''
        };
    }
  };

  const style = getRankStyle();

  return (
    <div 
      className={`
        flex-shrink-0 rounded-full flex items-center justify-center font-bold relative
        ${sizeClasses[size]} ${style.bg} ${style.text} 
        ${isTopThree ? `shadow-lg ${style.shadow}` : ''}
        ${isTopThree ? 'ring-2 ring-white/30' : ''}
      `}
    >
      {isTopThree && (
        <div className="absolute -top-1 -right-1">
          <FiAward className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
        </div>
      )}
      <span className="relative z-10">
        #{rank}
      </span>
    </div>
  );
};

export default RankBadge;
