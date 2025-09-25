import React from 'react';

const HomeFooter: React.FC = () => (
  <footer className="py-8 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto container-padding">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <img src="/image/logos/logo.svg" alt="M1Lazer" className="w-6 h-6 opacity-60" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">M1Lazer</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          © 2025 M1PPosu All Rights Reserved | Not Affiliated With ppy.sh or osu! | contact@m1pposu.dev | Front-end Design By Yomorei | All Possible Thanks To{' '}
          <a
            href="https://github.com/GooGuTeam"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
          GooGuTeam 
          </a>
            , and gashamkal!
        </p>
      </div>
    </div>
  </footer>
);

export default HomeFooter;