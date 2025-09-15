import React from 'react';

const HomeFooter: React.FC = () => (
  <footer className="py-8 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto container-padding">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <img src="/image/logos/logo.svg" alt="咕哦！" className="w-6 h-6 opacity-60" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">咕哦！</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          © 2025 g0v0.top. 为节奏游戏玩家提供最佳体验
        </p>
      </div>
    </div>
  </footer>
);

export default HomeFooter;
