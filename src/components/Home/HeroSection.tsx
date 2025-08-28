import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'motion/react';
import { useSpring, animated } from '@react-spring/web';
import { useAuth } from '../../hooks/useAuth';
import InfoCard from '../InfoCard';
import { features } from '../../data/features';
import { 
  FaDesktop,
  FaRocket, 
  FaHeart, 
  FaCog, 
  FaBug, 
  FaCodeBranch, 
  FaPaperPlane, 
  FaChartBar,
  FaQq, 
  FaDiscord, 
  FaGithub
} from 'react-icons/fa';

const HeroSection: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  
  // 监听页面滚动
  const { scrollY } = useScroll();
  
  const cardWidth = 320;
  const gap = 24;
  const totalWidth = cardWidth + gap;
  const scrollDistance = totalWidth * features.length;

  // 使用 react-spring 创建滚动动画
  const [springProps, api] = useSpring(() => ({
    from: { x: 0 },
    to: { x: -scrollDistance },
    config: { 
      duration: (features.length * 8000) / scrollSpeed
    },
    loop: true,
    pause: isHovered
  }));

  // 监听滚动变化并调整速度
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      // 根据滚动位置计算速度倍数 (1-2倍速)
      const speedMultiplier = Math.min(1 + (latest / 2000), 2);
      const roundedSpeed = Math.round(speedMultiplier * 10) / 10;
      
      if (Math.abs(roundedSpeed - scrollSpeed) > 0.1) {
        setScrollSpeed(roundedSpeed);
      }
    });

    return () => unsubscribe();
  }, [scrollY, scrollSpeed]);

  // 更新动画配置当速度改变时
  useEffect(() => {
    api.start({
      to: { x: -scrollDistance },
      config: { 
        duration: (features.length * 8000) / scrollSpeed
      },
      loop: true,
      pause: isHovered
    });
  }, [scrollSpeed, isHovered, api, scrollDistance]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center py-20 lg:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
      
      {/* Modern geometric accents */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-200/20 dark:bg-pink-800/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-teal-200/20 dark:bg-teal-800/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-200/15 dark:bg-blue-800/15 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-purple-200/15 dark:bg-purple-800/15 rounded-full blur-xl"></div>
      
      {/* Additional decorative elements for large screens */}
      <div className="hidden lg:block absolute top-10 right-10 w-2 h-2 bg-pink-400/30 rounded-full"></div>
      <div className="hidden lg:block absolute bottom-20 left-20 w-1 h-1 bg-teal-400/40 rounded-full"></div>
      <div className="hidden lg:block absolute top-1/3 left-10 w-1.5 h-1.5 bg-blue-400/35 rounded-full"></div>

      <div className="relative max-w-7xl mx-auto container-padding">
        {/* Main Content */}
        <div className="text-center space-y-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Logo and brand */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 flex items-center justify-center mr-5 p-2">
                <img src="/image/logo.svg" alt="咕哦！Logo" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="gradient-text">咕哦！</span>
              </h1>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-6 leading-tight max-w-4xl mx-auto">
              可能是最好的 osu! 私服
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              gsu! 是一个全新的<span className="font-bold text-pink-600 dark:text-pink-400">支持 lazer 客户端</span>的 osu! 第三方服务器。提供了 standard / taiko / catch / mania 四大模式支持，支持 RX/AP pp计算与无限制改名，让你的节奏旅程更自由。
            </p>

            {/* Server Status */}
            <div className="flex flex-col items-center space-y-2">
              <p className="text-pink-700 dark:text-pink-300 text-base font-bold flex items-center">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></span>
                  服务正常运行中
                </span>
                <span className="mx-2">·</span>
                <span>加入 QQ / Discord 社区获取支持与更新</span>
              </p>
              
              {/* Community Badges */}
              <div className="flex flex-wrap gap-3 justify-center">
                <a 
                  href="https://qm.qq.com/q/Uw8tOkgJSS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <div className="px-3 py-2 flex items-center">
                    <FaQq className="mr-2 text-base w-4 h-4" />
                    <span className="font-medium">QQ群</span>
                  </div>
                  <div className="px-3 py-2 bg-sky-600 group-hover:bg-sky-500 dark:bg-sky-700 dark:group-hover:bg-sky-600 text-white rounded-r-lg transition-colors duration-200">
                    <span className="font-semibold">1059561526</span>
                  </div>
                </a>
                
                <a 
                  href="https://discord.gg/rt94zPuE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <div className="px-3 py-2 flex items-center">
                    <FaDiscord className="mr-2 text-base w-4 h-4" />
                    <span className="font-medium">Discord</span>
                  </div>
                  <div className="px-3 py-2 bg-indigo-600 group-hover:bg-indigo-500 dark:bg-indigo-700 dark:group-hover:bg-indigo-600 text-white rounded-r-lg transition-colors duration-200">
                    <span className="font-semibold">rt94zPuE</span>
                  </div>
                </a>
                
                <a 
                  href="https://github.com/GooGuTeam" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <div className="px-3 py-2 flex items-center">
                    <FaGithub className="mr-2 text-base w-4 h-4" />
                    <span className="font-medium">GitHub</span>
                  </div>
                  <div className="px-3 py-2 bg-gray-800 group-hover:bg-gray-700 dark:bg-gray-600 dark:group-hover:bg-gray-500 text-white rounded-r-lg transition-colors duration-200">
                    <span className="font-semibold">GooGuTeam</span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="btn-primary text-lg px-10 py-4 min-w-[200px] rounded-xl shadow-lg">
                  查看资料
                </Link>
                <Link to="/rankings" className="btn-secondary text-lg px-10 py-4 min-w-[200px] rounded-xl">
                  查看排行榜
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-10 py-4 min-w-[200px] rounded-xl shadow-lg">
                  注册
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-10 py-4 min-w-[200px] rounded-xl">
                  登录
                </Link>
              </>
            )}
          </motion.div>


          {/* Feature Cards Scrolling Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div 
              className="overflow-hidden cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
              }}
            >
              <animated.div
                className="flex gap-6"
                style={{
                  ...springProps,
                  width: `${scrollDistance * 2}px`
                }}
              >
              {/* First set of cards */}
              {features.map((feature, index) => {
                const icons = [
                  <FaDesktop key="desktop" className="h-6 w-6" />,
                  <FaRocket key="rocket" className="h-6 w-6" />,
                  <FaHeart key="heart" className="h-6 w-6" />,
                  <FaCog key="cog" className="h-6 w-6" />,
                  <FaBug key="bug" className="h-6 w-6" />,
                  <FaCodeBranch key="code" className="h-6 w-6" />,
                  <FaPaperPlane key="plane" className="h-6 w-6" />,
                  <FaChartBar key="chart" className="h-6 w-6" />
                ];
                
                return (
                  <motion.div
                    key={`first-${feature.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="flex-shrink-0 w-80 sm:w-72 md:w-80"
                  >
                    <InfoCard
                      image={feature.image}
                      imageAlt={feature.imageAlt}
                      title={feature.title}
                      content={feature.content}
                      icon={icons[index]}
                    />
                  </motion.div>
                );
              })}
              
              {/* Second set of cards for seamless loop */}
              {features.map((feature, index) => {
                const icons = [
                  <FaDesktop key="desktop" className="h-6 w-6" />,
                  <FaRocket key="rocket" className="h-6 w-6" />,
                  <FaHeart key="heart" className="h-6 w-6" />,
                  <FaCog key="cog" className="h-6 w-6" />,
                  <FaBug key="bug" className="h-6 w-6" />,
                  <FaCodeBranch key="code" className="h-6 w-6" />,
                  <FaPaperPlane key="plane" className="h-6 w-6" />,
                  <FaChartBar key="chart" className="h-6 w-6" />
                ];
                
                return (
                  <motion.div
                    key={`second-${feature.id}`}
                    className="flex-shrink-0 w-80 sm:w-72 md:w-80"
                  >
                    <InfoCard
                      image={feature.image}
                      imageAlt={feature.imageAlt}
                      title={feature.title}
                      content={feature.content}
                      icon={icons[index]}
                    />
                  </motion.div>
                );
              })}
            </animated.div>
            </div>
          </motion.div>

          {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="p-6 bg-white/70 dark:bg-gray-800/70 border border-pink-200/50 dark:border-pink-700/50 rounded-2xl inline-block backdrop-blur-sm shadow-lg"
            >
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center justify-center">
                欢迎回来，<span className="font-semibold text-pink-600 dark:text-pink-400 ml-1">{user.username}</span>！
              </p>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
