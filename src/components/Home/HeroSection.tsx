import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { useAuth } from '../../hooks/useAuth';

import 'swiper/swiper-bundle.css';
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
  const { isAuthenticated } = useAuth();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (swiper && swiper.autoplay) {
      swiper.autoplay.pause();
    }
  }, [swiper]);

  const handleMouseLeave = useCallback(() => {
    if (swiper && swiper.autoplay && !isUserInteracting) {
      swiper.autoplay.resume();
    }
  }, [swiper, isUserInteracting]);

  // 处理触摸/拖动开始
  const handleTouchStart = useCallback(() => {
    setIsUserInteracting(true);
    if (swiper && swiper.autoplay) {
      swiper.autoplay.pause();
    }
  }, [swiper]);

  // 处理触摸/拖动结束后恢复自动播放
  const handleTouchEnd = useCallback(() => {
    setIsUserInteracting(false);
    if (swiper && swiper.autoplay) {
      // 延迟一点时间再恢复自动播放，确保用户操作完成
      setTimeout(() => {
        if (swiper && swiper.autoplay) {
          swiper.autoplay.resume();
        }
      }, 800);
    }
  }, [swiper]);

  // 处理拖动过程中的状态
  const handleSliderMove = useCallback(() => {
    // 在拖动过程中确保自动播放暂停
    if (swiper && swiper.autoplay && !swiper.autoplay.paused) {
      swiper.autoplay.pause();
    }
  }, [swiper]);

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-128px)] md:min-h-screen flex items-center py-8 sm:py-12 md:py-20 lg:py-32">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="w-[94vw] ml-[-15px] md:w-full text-center space-y-6 sm:space-y-8 md:space-y-12 mt-4 sm:mt-8 md:mt-[-150px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="px-4">
            {/* Logo and brand */}
            <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center mr-2 sm:mr-3 md:mr-5 p-1 sm:p-2">
                <img src="/image/logo.svg" alt="咕哦！Logo" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight">
                <span className="gradient-text">咕哦！</span>
              </h1>
            </div>

            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4 md:mb-6 leading-tight max-w-4xl mx-auto">
              可能是最好的 osu! 私服
            </h2>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              g0v0! 是一个全新的<span className="font-bold text-pink-600 dark:text-pink-400">支持 lazer 客户端</span>的 osu! 第三方服务器。提供了 standard / taiko / catch / mania 四大模式支持，支持 RX/AP pp计算与无限制改名，让你的节奏旅程更自由。
            </p>

            {/* Server Status */}
            <div className="mt-3 sm:mt-4 md:mt-8">
              <div className="text-pink-700 dark:text-pink-300 text-xs sm:text-sm md:text-base font-bold">
                <div className="mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
                    服务正常运行中
                  </span>

                  {/* 可选分隔线：不要就删掉这一行 */}
                  <span className="hidden sm:block h-3 sm:h-4 w-px bg-pink-300/60 dark:bg-pink-200/40" />

                  <span className="text-xs sm:text-sm whitespace-nowrap">
                    加入 QQ / Discord 社区获取支持与更新
                  </span>
                </div>
              </div>


              
             {/* Community Badges */}
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2 md:gap-3 w-full max-w-xs sm:max-w-2xl mx-auto">
                  <a
                    href="https://qm.qq.com/q/Uw8tOkgJSS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex flex-nowrap items-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs sm:text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 flex items-center whitespace-nowrap">
                      <FaQq className="mr-1 sm:mr-2 text-sm sm:text-base w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">QQ群</span>
                    </div>
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-sky-600 group-hover:bg-sky-500 dark:bg-sky-700 dark:group-hover:bg-sky-600 text-white rounded-r-lg transition-colors duration-200 whitespace-nowrap w-full">
                      <span className="font-semibold text-xs sm:text-sm">1059561526</span>
                    </div>
                  </a>

                  <a
                    href="https://discord.gg/AhzJXXWYfF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex flex-nowrap items-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs sm:text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 flex items-center whitespace-nowrap">
                      <FaDiscord className="mr-1 sm:mr-2 text-sm sm:text-base w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">Discord</span>
                    </div>
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-indigo-600 group-hover:bg-indigo-500 dark:bg-indigo-700 dark:group-hover:bg-indigo-600 text-white rounded-r-lg transition-colors duration-200 whitespace-nowrap w-full">
                      <span className="font-semibold text-xs sm:text-sm">咕哦!</span>
                    </div>
                  </a>

                  <a
                    href="https://github.com/GooGuTeam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex flex-nowrap items-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs sm:text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 flex items-center whitespace-nowrap">
                      <FaGithub className="mr-1 sm:mr-2 text-sm sm:text-base w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">GitHub</span>
                    </div>
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 group-hover:bg-gray-700 dark:bg-gray-600 dark:group-hover:bg-gray-500 text-white rounded-r-lg transition-colors duration-200 whitespace-nowrap w-full">
                      <span className="font-semibold text-xs sm:text-sm">GooGuTeam</span>
                    </div>
                  </a>
                </div>
              </div>
              </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 px-4 max-w-sm sm:max-w-lg md:max-w-2xl mx-auto"
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="btn-primary text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-4 w-full rounded-lg sm:rounded-xl shadow-lg text-center"
                >
                  查看资料
                </Link>
                <Link
                  to="/rankings"
                  className="btn-secondary text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-4 w-full rounded-lg sm:rounded-xl text-center"
                >
                  查看排行榜
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-4 w-full rounded-lg sm:rounded-xl shadow-lg text-center"
                >
                  注册
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-4 w-full rounded-lg sm:rounded-xl text-center"
                >
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
            className="ml-[8px] mt-8 sm:mt-12 md:mt-16 relative w-full"
          >
            <div className="flex justify-center w-full">
              <div 
                className="overflow-hidden cursor-pointer w-full max-w-6xl lg:max-w-7xl"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)'
                }}
              >
              <Swiper
                onSwiper={setSwiper}
                modules={[Autoplay]}
                slidesPerView="auto"
                spaceBetween={24}
                loop={true}
                centeredSlides={true}
                initialSlide={0}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                  reverseDirection: false,
                  waitForTransition: true,
                  stopOnLastSlide: false
                }}
                speed={1500}
                allowTouchMove={true}
                resistanceRatio={0.85}
                longSwipesRatio={0.25}
                loopAdditionalSlides={2}
                watchSlidesProgress={true}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onSliderMove={handleSliderMove}
                className="!px-4"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  
                }}
              >
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
                    <SwiperSlide key={feature.id} className="!w-80">
                      <div className="flex justify-center items-center w-full">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="w-full max-w-sm"
                        >
                          <InfoCard
                            image={feature.image}
                            imageAlt={feature.imageAlt}
                            title={feature.title}
                            content={feature.content}
                            icon={icons[index]}
                          />
                        </motion.div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              </div>
            </div>
          </motion.div>

          {/* {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="px-4 max-w-lg mx-auto"
            >
              <div className="p-3 sm:p-4 lg:p-6 bg-white/70 dark:bg-gray-800/70 border border-pink-200/50 dark:border-pink-700/50 rounded-2xl inline-block backdrop-blur-sm shadow-lg">
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center justify-center">
                  欢迎回来，<span className="font-semibold text-pink-600 dark:text-pink-400 sm:ml-1">{user.username}</span>！
                </p>
              </div>
            </motion.div>
          )} */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
