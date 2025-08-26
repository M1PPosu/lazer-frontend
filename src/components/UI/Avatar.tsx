import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';

const debugLog = (message: string, data?: unknown) => {
  if (import.meta.env.DEV) console.log(message, data);
};

interface AvatarProps {
  userId?: number;
  username: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  shape?: 'circle' | 'rounded';  // 圆形 or 圆角矩形
}

const Avatar: React.FC<AvatarProps> = ({ 
  userId, 
  username, 
  avatarUrl, 
  size = 'md', 
  className = '',
  shape = 'rounded',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const sizeClasses = {
    sm: 'w-8 h-8 min-w-8 min-h-8 text-sm',
    md: 'w-12 h-12 min-w-12 min-h-12 text-base',
    lg: 'w-16 h-16 min-w-16 min-h-16 text-lg',
    xl: 'w-24 h-24 min-w-24 min-h-24 text-xl',
    '2xl': 'w-32 h-32 min-w-32 min-h-32 text-2xl',
  };


  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  useEffect(() => {
    const getImageUrl = () => {
      debugLog('Avatar getImageUrl - avatarUrl:', { avatarUrl, userId, username });
      if (avatarUrl && avatarUrl.trim() !== '') return avatarUrl;
      if (userId) return userAPI.getAvatarUrl(userId);
      return '/default.jpg';
    };
    setImageError(false);
    setIsLoading(true);
    setCurrentImageUrl(getImageUrl());
  }, [userId, username, avatarUrl]);

  const shouldShowImage = currentImageUrl && !imageError;
  const fallbackLetter = (username || '?').charAt(0).toUpperCase();

  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    if (currentImageUrl !== '/default.jpg') {
      setCurrentImageUrl('/default.jpg');
      setImageError(false);
      setIsLoading(true);
    } else {
      setImageError(true);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={[
        sizeClasses[size],
        radius,
        'overflow-hidden flex-shrink-0 shadow-md',
        className,
      ].join(' ')}
      style={{ display: 'inline-block' }}
    >
      {shouldShowImage ? (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse" />
          )}
          <img
            src={currentImageUrl}
            alt={`${username}的头像`}
            loading="lazy"
            decoding="async"
            className={`block w-full h-full object-cover transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'} ${radius}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-gray-400 text-white font-bold ${radius}`}>
          {fallbackLetter}
        </div>
      )}
    </div>
  );
};

export default Avatar;
