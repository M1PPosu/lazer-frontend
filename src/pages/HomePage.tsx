import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto container-padding grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo and brand */}
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-teal-400 rounded-2xl flex items-center justify-center mr-4 shadow-lg p-2">
                  <img 
                    src="/image/logo.svg" 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="gradient-text">咕哦！</span>
                </h1>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 leading-tight">
                为玩家提供全模式 RX / AP 与完整 PP 生态
              </h2>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                标准 / 太鼓 / 接水果 / Mania 全面支持，实时计算与灵活改名，让你的节奏旅程更自由，立即连接你的客户端开始游戏。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8"
            >
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="btn-primary text-lg px-8 py-4 min-w-[180px]">
                    查看资料
                  </Link>
                  <Link to="/rankings" className="btn-secondary text-lg px-8 py-4 min-w-[180px]">
                    查看排行榜
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4 min-w-[180px]">
                    立即加入
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-4 min-w-[180px]">
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
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
            </motion.div>

            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="p-4 bg-gradient-to-r from-pink-50 to-teal-50 dark:from-pink-900/20 dark:to-teal-900/20 border border-pink-200 dark:border-pink-700 rounded-2xl inline-block"
              >
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  欢迎回来，<span className="font-semibold" style={{ color: '#ED8EA6' }}>{user.username}</span>！
                </p>
              </motion.div>
            )}
          </div>

          {/* Right side - Illustration/Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main circle avatar with lazer image */}
       {/*        <div className="w-80 h-80 mx-auto bg-gradient-to-br from-pink-300 via-teal-300 to-cyan-300 rounded-full flex items-center justify-center shadow-2xl shadow-pink-300/20 p-4">
                <div className="w-72 h-72 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/image/lazer.png" 
                    alt="Lazer Logo" 
                    className="w-60 h-60 object-contain"
                  />
                </div>
              </div> */}
              

            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © 2025 g0v0.top. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
