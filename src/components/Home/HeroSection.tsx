import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import ServerStatsCard from '../UI/ServerStatsCard';

const HeroSection: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-3"></div>
      
      {/* Modern geometric accents */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-200/20 dark:bg-pink-800/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-teal-200/20 dark:bg-teal-800/20 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto container-padding grid lg:grid-cols-2 gap-16 items-center">
        {/* Left side - Content */}
        <div className="text-center lg:text-left space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Logo and brand */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="w-20 h-20 flex items-center justify-center mr-5 p-2">
                <img src="/image/logo.svg" alt="咕哦！Logo" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="gradient-text">咕哦！</span>
              </h1>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-6 leading-tight max-w-3xl">
              为玩家提供全模式 RX / AP 与完整 PP 生态
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              标准 / 太鼓 / 接水果 / Mania 全面支持，实时计算与灵活改名，让你的节奏旅程更自由，立即连接你的客户端开始游戏。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
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
                  立即加入
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-10 py-4 min-w-[200px] rounded-xl">
                  使用 lazer 登录
                </Link>
              </>
            )}
          </motion.div>

          {/* Features badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            <div className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">
              🎵 四种游戏模式
            </div>
            <div className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
              📊 实时PP计算
            </div>
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              🏆 完整排行榜
            </div>
          </motion.div>

          {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="p-6 bg-white/70 dark:bg-gray-800/70 border border-pink-200/50 dark:border-pink-700/50 rounded-2xl inline-block backdrop-blur-sm shadow-lg"
            >
              <p className="text-lg text-gray-700 dark:text-gray-300">
                👋 欢迎回来，<span className="font-semibold text-pink-600 dark:text-pink-400">{user.username}</span>！
              </p>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
