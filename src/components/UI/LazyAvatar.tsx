import React, { useState, useRef, useEffect } from 'react';

interface LazyAvatarProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LazyAvatar: React.FC<LazyAvatarProps> = ({
  src,
  alt,
  fallbackSrc = '/default.jpg',
  className = '',
  size = 'md'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      setImageSrc(src);
    }
  }, [isInView, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setImageSrc(fallbackSrc);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`${sizeClasses[size]} rounded-full overflow-hidden relative ${className}`}
    >
      {/* 占位背景 */}
      <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* 实际图片 */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export default LazyAvatar;
