import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';

interface AvatarProps {
  userId?: number;
  username: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  userId, 
  username, 
  avatarUrl, 
  size = 'md', 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  // 尺寸映射
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl',
  };

  // 当参数变化时，重置状态并设置新的图片URL
  useEffect(() => {
    // 获取头像URL的优先级：
    // 1. 用户提供的avatarUrl（如果存在且不为空）
    // 2. 通过userId构建的API头像URL
    // 3. 默认头像 /default.jpg
    const getImageUrl = () => {
      if (avatarUrl && avatarUrl.trim() !== '') {
        return avatarUrl;
      }
      if (userId) {
        return userAPI.getAvatarUrl(userId);
      }
      return '/default.jpg'; // 使用默认头像
    };

    setImageError(false);
    setIsLoading(true);
    setCurrentImageUrl(getImageUrl());
  }, [userId, username, avatarUrl]);

  const shouldShowImage = currentImageUrl && !imageError;
  const fallbackLetter = username.charAt(0).toUpperCase();

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    // 如果当前不是默认头像，尝试使用默认头像
    if (currentImageUrl !== '/default.jpg') {
      setCurrentImageUrl('/default.jpg');
      setImageError(false);
      setIsLoading(true);
    } else {
      // 如果默认头像也加载失败，则显示字母头像
      setImageError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {shouldShowImage ? (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full" />
          )}
          <img
            src={currentImageUrl}
            alt={`${username}的头像`}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-osu-pink to-osu-purple flex items-center justify-center text-white font-bold">
          {fallbackLetter}
        </div>
      )}
    </div>
  );
};

export default Avatar;
