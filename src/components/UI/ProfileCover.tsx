import React, { useState } from 'react';

interface ProfileCoverProps {
  coverUrl?: string;
  fallbackUrl?: string;
  children: React.ReactNode;
  className?: string;
}

const ProfileCover: React.FC<ProfileCoverProps> = ({
  coverUrl,
  fallbackUrl,
  children,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const backgroundImage = () => {
    if (imageError || (!coverUrl && !fallbackUrl)) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    return `url(${coverUrl || fallbackUrl})`;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 固定宽高比容器 */}
      <div className="relative w-full aspect-[16/6]">
        {/* 背景图片 */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: backgroundImage()
          }}
        >
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        {/* 加载状态背景 */}
        {!imageLoaded && (coverUrl || fallbackUrl) && (
          <div className="absolute inset-0 cover-loading">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400/70 via-gray-400/50 to-gray-400/30"></div>
          </div>
        )}

        {/* 预加载图片 */}
        {(coverUrl || fallbackUrl) && (
          <img
            src={coverUrl || fallbackUrl}
            alt="Profile cover"
            className="hidden"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* 内容 */}
        <div className="absolute inset-0 z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProfileCover;
