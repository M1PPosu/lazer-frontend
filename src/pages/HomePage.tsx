import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FiPlay, FiTrendingUp, FiUsers, FiMusic } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <FiPlay size={32} />,
      title: '游戏体验',
      description: '连接我们的私服，享受无限的游戏乐趣',
      color: 'from-pink-500 to-purple-600',
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: '进度追踪',
      description: '监控你的游戏表现，攻顶排行榜',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: <FiUsers size={32} />,
      title: '社区交流',
      description: '加入活跃的 osu! 玩家社区',
      color: 'from-green-500 to-teal-600',
    },
    {
      icon: <FiMusic size={32} />,
      title: '谱面下载',
      description: '发现并下载数千首精彩谱面',
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="gradient-text">GuSou!</span>
                <br />
                <span className="text-gray-800 dark:text-gray-200">
                  私人服务器
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                体验前所未有的 osu! 游戏。加入我们的私人服务器，享受增强的游戏体验、
                自定义功能和精彩的社区。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="btn-primary text-lg px-8 py-4">
                    查看资料
                  </Link>
                  <Link to="/rankings" className="btn-secondary text-lg px-8 py-4">
                    查看排行榜
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4">
                    立即加入
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                    登录
                  </Link>
                </>
              )}
            </motion.div>

            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8"
              >
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  欢迎回来，<span className="font-semibold text-osu-pink">{user.username}</span>！
                </p>
              </motion.div>
            )}
          </div>
        </div>


      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              为什么选择 GuSou？
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              我们的私人服务器提供独特的功能和增强功能，让你的 osu! 体验更加出色。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-16">
              服务器统计
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-osu-pink mb-2">1,337</div>
                <div className="text-gray-600 dark:text-gray-300 text-lg">注册玩家</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-osu-blue mb-2">42,069</div>
                <div className="text-gray-600 dark:text-gray-300 text-lg">提交分数</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-osu-purple mb-2">8,888</div>
                <div className="text-gray-600 dark:text-gray-300 text-lg">可用谱面</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-osu-pink to-osu-purple">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              准备好开始游戏了吗？
            </h2>
            <p className="text-xl text-pink-100 mb-8">
              加入成千上万正在享受我们增强 osu! 体验的玩家。
            </p>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="bg-white text-osu-pink px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
              >
                创建账户
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
