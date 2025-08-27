import React from 'react';

interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface RankStyle {
  bg: string;
  text: string;
  border?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({ 
  rank, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'min-w-[24px] h-6 text-xs px-2',
    md: 'min-w-[28px] h-7 text-sm px-2',
    lg: 'min-w-[32px] h-8 text-base px-2',
  } as const;

  const getRankStyle = (): RankStyle => {
    if (rank <= 3) {
      switch (rank) {
        case 1:
          return {
            bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
            text: 'text-white',
            border: 'shadow-md',
          };
        case 2:
          return {
            bg: 'bg-gradient-to-r from-gray-300 to-gray-400',
            text: 'text-white',
            border: 'shadow-md',
          };
        case 3:
          return {
            bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
            text: 'text-white',
            border: 'shadow-md',
          };
      }
    }
    
    return {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-600 dark:text-gray-300',
    };
  };

  const style = getRankStyle();

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full font-bold
        ${sizeClasses[size]} 
        ${style.bg} 
        ${style.text}
        ${style.border || ''}
        transition-all duration-200
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      #{rank}
    </div>
  );
};

export default RankBadge;