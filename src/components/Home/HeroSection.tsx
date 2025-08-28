import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';

const HeroSection: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

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
              为玩家提供全模式 RX / AP 与完整 PP 生态
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              标准 / 太鼓 / 接水果 / Mania 全面支持，实时计算与灵活改名，让你的节奏旅程更自由，立即连接你的客户端开始游戏。
            </p>
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
            className="flex flex-wrap gap-3 justify-center"
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

          {/* Feature Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          >
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">精准计分</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">实时PP计算，精确排名系统</p>
            </div>

            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">快速响应</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">低延迟服务器，畅快游戏体验</p>
            </div>

            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">安全稳定</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">数据加密保护，稳定运行保障</p>
            </div>

            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">社区活跃</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">活跃玩家社区，一起享受音乐</p>
            </div>
          </motion.div>

          {/* Game Modes Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
              支持的游戏模式
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-2">⭕</div>
                <div className="font-semibold text-pink-700 dark:text-pink-300">osu!</div>
                <div className="text-xs text-pink-600/70 dark:text-pink-400/70">标准模式</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-2">🥁</div>
                <div className="font-semibold text-orange-700 dark:text-orange-300">Taiko</div>
                <div className="text-xs text-orange-600/70 dark:text-orange-400/70">太鼓模式</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-2">🍎</div>
                <div className="font-semibold text-blue-700 dark:text-blue-300">Catch</div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">接水果</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-2">🎹</div>
                <div className="font-semibold text-purple-700 dark:text-purple-300">Mania</div>
                <div className="text-xs text-purple-600/70 dark:text-purple-400/70">钢琴模式</div>
              </div>
            </div>
          </motion.div>

          {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
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
