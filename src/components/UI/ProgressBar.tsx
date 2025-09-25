import React from 'react';

interface ProgressBarProps {
  progress: number;
  color: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  height = 'h-3',
  showLabel = false,
  animated = true,
  className = ''
}) => {
  // 确保进度值在0-100之间
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${animated ? 'animate-pulse' : ''}`}
          style={{ 
            backgroundColor: color,
            width: `${clampedProgress}%`,
            transition: animated ? 'width 0.5s ease-out' : 'none'
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>进度: {clampedProgress.toFixed(1)}%</span>
          <span>剩余: {(100 - clampedProgress).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
