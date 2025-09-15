import React, { useEffect, useRef } from 'react';
import '../../styles/bbcode.css';

interface BBCodeRendererProps {
  html: string;
  className?: string;
}

/**
 * BBCode HTML 渲染组件
 * 安全地渲染BBCode解析器生成的HTML，并添加交互功能
 */
const BBCodeRenderer: React.FC<BBCodeRendererProps> = ({ html, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // 初始化折叠框功能
    const initializeSpoilerBoxes = () => {
      const spoilerLinks = container.querySelectorAll('.js-spoilerbox__link');
      
      spoilerLinks.forEach((link) => {
        const handleClick = (e: Event) => {
          e.preventDefault();
          const spoilerBox = link.closest('.js-spoilerbox');
          const body = spoilerBox?.querySelector('.js-spoilerbox__body');
          
          if (body) {
            const isVisible = body.classList.contains('is-visible');
            body.classList.toggle('is-visible', !isVisible);
            link.setAttribute('aria-expanded', String(!isVisible));
            
            // 触发自定义事件
            spoilerBox?.dispatchEvent(new CustomEvent('spoilerToggle', {
              detail: { expanded: !isVisible }
            }));
          }
        };

        link.addEventListener('click', handleClick);
        
        // 设置初始状态
        link.setAttribute('role', 'button');
        link.setAttribute('aria-expanded', 'false');
        link.setAttribute('tabindex', '0');
        
        // 支持键盘操作
        link.addEventListener('keydown', (e) => {
          const keyEvent = e as KeyboardEvent;
          if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
            e.preventDefault();
            handleClick(e);
          }
        });

        // 清理函数将在组件卸载时移除事件监听器
        return () => {
          link.removeEventListener('click', handleClick);
        };
      });
    };

    // 初始化剧透条功能
    const initializeSpoilers = () => {
      const spoilers = container.querySelectorAll('.spoiler');
      
      spoilers.forEach((spoiler) => {
        const handleReveal = () => {
          spoiler.classList.add('revealed');
        };

        // 点击显示
        spoiler.addEventListener('click', handleReveal);
        
        // 鼠标悬停显示
        spoiler.addEventListener('mouseenter', handleReveal);
        
        // 支持键盘操作
        spoiler.setAttribute('tabindex', '0');
        spoiler.setAttribute('role', 'button');
        spoiler.setAttribute('aria-label', '点击显示隐藏内容');
        
        spoiler.addEventListener('keydown', (e) => {
          const keyEvent = e as KeyboardEvent;
          if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
            e.preventDefault();
            handleReveal();
          }
        });
      });
    };

    // 初始化图片映射功能
    const initializeImageMaps = () => {
      const imageMaps = container.querySelectorAll('.imagemap');
      
      imageMaps.forEach((imageMap) => {
        const links = imageMap.querySelectorAll('.imagemap__link');
        
        links.forEach((link) => {
          // 添加悬停效果
          link.addEventListener('mouseenter', () => {
            link.classList.add('hover');
          });
          
          link.addEventListener('mouseleave', () => {
            link.classList.remove('hover');
          });
          
          // 如果是信息区域（没有href），添加提示
          if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
            link.addEventListener('click', (e) => {
              e.preventDefault();
            });
          }
        });
      });
    };

    // 初始化所有交互功能
    initializeSpoilerBoxes();
    initializeSpoilers();
    initializeImageMaps();

    // 处理外部链接
    const externalLinks = container.querySelectorAll('a[href^="http"]');
    externalLinks.forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    // 图片懒加载
    const images = container.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));

      return () => {
        imageObserver.disconnect();
      };
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={`bbcode-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      aria-live="polite"
    />
  );
};

export default BBCodeRenderer;