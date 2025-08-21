import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiAward, FiGlobe, FiLoader } from 'react-icons/fi';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { rankingsAPI, handleApiError } from '../utils/api';
import CountrySelect from '../components/UI/CountrySelect';
import { 
  GAME_MODE_NAMES,
  GAME_MODE_COLORS,
  GAME_MODE_GROUPS,
  MAIN_MODE_ICONS
} from '../types';
import type { 
  GameMode,
  MainGameMode,
  TopUsersResponse, 
  CountryResponse, 
  UserRanking, 
  CountryRanking,
  TabType,
  RankingType
} from '../types';

const RankingsPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('osu');
  const [selectedMainMode, setSelectedMainMode] = useState<MainGameMode>('osu');
  const [showSubModes, setShowSubModes] = useState<MainGameMode | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('users');
  const [rankingType, setRankingType] = useState<RankingType>('performance');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const modeSelectRef = useRef<HTMLDivElement>(null);
  
  const [userRankings, setUserRankings] = useState<TopUsersResponse | null>(null);
  const [countryRankings, setCountryRankings] = useState<CountryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 点击外部关闭子模式菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modeSelectRef.current && !modeSelectRef.current.contains(event.target as Node)) {
        setShowSubModes(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理主模式切换
  const handleMainModeChange = (mainMode: MainGameMode) => {
    if (selectedMainMode === mainMode) {
      // 如果点击的是当前选中的模式，切换子模式显示状态
      setShowSubModes(showSubModes === mainMode ? null : mainMode);
    } else {
      // 如果点击的是不同的模式，选择该模式并显示其子模式
      setSelectedMainMode(mainMode);
      setShowSubModes(mainMode);
      // 默认选择该主模式的第一个子模式
      const firstSubMode = GAME_MODE_GROUPS[mainMode][0];
      setSelectedMode(firstSubMode);
    }
  };

  // 处理子模式选择
  const handleSubModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setShowSubModes(null); // 选择后隐藏子模式选项
  };
  
  // 加载用户排行榜
  const loadUserRankings = async () => {
    setIsLoading(true);
    try {
      const response = await rankingsAPI.getUserRankings(
        selectedMode, 
        rankingType, 
        selectedCountry || undefined, 
        currentPage
      );
      setUserRankings(response);
    } catch (error: any) {
      handleApiError(error);
      console.error('加载用户排行榜失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载国家排行榜
  const loadCountryRankings = async () => {
    setIsLoading(true);
    try {
      const response = await rankingsAPI.getCountryRankings(selectedMode, currentPage);
      setCountryRankings(response);
    } catch (error: any) {
      handleApiError(error);
      console.error('加载国家排行榜失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置分页并加载数据
  const resetAndLoad = () => {
    setCurrentPage(1);
    if (selectedTab === 'users') {
      loadUserRankings();
    } else {
      loadCountryRankings();
    }
  };

  // 模式改变时重置并加载数据
  useEffect(() => {
    resetAndLoad();
  }, [selectedMode, selectedTab, rankingType, selectedCountry]);

  // 分页改变时加载数据
  useEffect(() => {
    if (selectedTab === 'users') {
      loadUserRankings();
    } else {
      loadCountryRankings();
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderUserRankings = () => {
    if (!userRankings || !userRankings.ranking.length) {
      return (
        <div className="text-center py-12">
          <FiAward className="text-4xl mb-4 text-gray-400 dark:text-gray-500 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">暂无排行榜数据</p>
        </div>
      );
    }

    const startRank = (currentPage - 1) * 50 + 1;

    return (
      <div className="space-y-2">
        {userRankings.ranking.map((ranking: UserRanking, index: number) => {
          const rank = startRank + index;
          const isTopThree = rank <= 3;
          
          return (
            <motion.div
              key={ranking.user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 ${
                isTopThree ? 'border-l-4 border-l-yellow-400' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* 排名 */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                  rank === 2 ? 'bg-gray-400 text-gray-900' :
                  rank === 3 ? 'bg-amber-600 text-white' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                </div>

                {/* 用户头像 */}
                <Link to={`/users/${ranking.user.id}`} className="flex-shrink-0">
                  <img
                    src={ranking.user.avatar_url || '/default.jpg'}
                    alt={ranking.user.username}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-colors"
                  />
                </Link>

                {/* 用户信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/users/${ranking.user.id}`}
                      className="font-bold text-gray-900 dark:text-white hover:text-blue-500 transition-colors truncate"
                    >
                      {ranking.user.username}
                    </Link>
                    {ranking.user.country_code && (
                      <img
                        src={`https://flagcdn.com/24x18/${ranking.user.country_code.toLowerCase()}.png`}
                        alt={ranking.user.country_code}
                        className="w-6 h-4 rounded-sm"
                        title={ranking.user.country?.name || ranking.user.country_code}
                      />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ranking.user.country?.name || ranking.user.country_code}
                  </div>
                </div>

                {/* 数值显示 */}
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: GAME_MODE_COLORS[selectedMode] }}>
                    {rankingType === 'performance' 
                      ? `${Math.round(ranking.pp || 0).toLocaleString()}pp`
                      : `${(ranking.score || 0).toLocaleString()}`
                    }
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {rankingType === 'performance' ? '表现分数' : '总分'}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderCountryRankings = () => {
    if (!countryRankings || !countryRankings.ranking.length) {
      return (
        <div className="text-center py-12">
          <FiGlobe className="text-4xl mb-4 text-gray-400 dark:text-gray-500 mx-auto" />
          <p className="text-gray-500 dark:text-gray-400">暂无国家排行榜数据</p>
        </div>
      );
    }

    const startRank = (currentPage - 1) * 50 + 1;

    return (
      <div className="space-y-2">
        {countryRankings.ranking.map((ranking: CountryRanking, index: number) => {
          const rank = startRank + index;
          const isTopThree = rank <= 3;
          
          return (
            <motion.div
              key={ranking.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 ${
                isTopThree ? 'border-l-4 border-l-yellow-400' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* 排名 */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                  rank === 2 ? 'bg-gray-400 text-gray-900' :
                  rank === 3 ? 'bg-amber-600 text-white' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                </div>

                {/* 国旗 */}
                <img
                  src={`https://flagcdn.com/48x36/${ranking.code.toLowerCase()}.png`}
                  alt={ranking.code}
                  className="w-12 h-9 rounded border border-gray-200 dark:border-gray-600"
                />

                {/* 国家信息 */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white truncate">
                    {ranking.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ranking.active_users.toLocaleString()} 活跃用户
                  </div>
                </div>

                {/* 统计数据 */}
                <div className="text-right space-y-1">
                  <div className="font-bold text-lg" style={{ color: GAME_MODE_COLORS[selectedMode] }}>
                    {Math.round(ranking.performance).toLocaleString()}pp
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ranking.play_count.toLocaleString()} 游戏次数
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderPagination = () => {
    const totalPages = selectedTab === 'users' 
      ? Math.ceil((userRankings?.total || 0) / 50)
      : Math.ceil((countryRankings?.total || 0) / 50);
    
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 上一页
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          ←
        </button>
      );
    }

    // 页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-md transition-colors ${
            i === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    // 下一页
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          →
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        {pages}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          排行榜
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          查看全球顶尖玩家和国家的表现
        </p>
      </motion.div>

      {/* 控制面板 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
      >
        {/* 游戏模式选择 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            游戏模式
          </h3>
          <div className="flex justify-center" ref={modeSelectRef}>
            {/* 主模式图标 */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
              {(Object.keys(GAME_MODE_GROUPS) as MainGameMode[]).map((mainMode) => (
                <div key={mainMode} className="relative">
                  <button
                    onClick={() => handleMainModeChange(mainMode)}
                    className={`relative p-3 rounded-lg transition-all duration-300 group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      selectedMainMode === mainMode
                        ? 'scale-110 shadow-lg'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    data-tooltip-id={`main-mode-${mainMode}`}
                    data-tooltip-content={mainMode === 'osu' ? 'osu!' : 
                                        mainMode === 'taiko' ? 'osu!taiko' :
                                        mainMode === 'fruits' ? 'osu!catch' :
                                        'osu!mania'}
                  >
                    <span
                      className="absolute inset-0 rounded-lg transition-all duration-300"
                      style={{
                        background: selectedMainMode === mainMode
                          ? `linear-gradient(135deg, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]} 0%, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]}CC 100%)`
                          : 'transparent',
                        boxShadow: selectedMainMode === mainMode ? '0 4px 14px rgba(0,0,0,0.2)' : 'none'
                      }}
                    />
                    <span
                      className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]} 0%, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]}80 100%)`
                      }}
                    />
                    {selectedMainMode === mainMode && (
                      <span
                        className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-offset-2 animate-[pulse_2.4s_ease-in-out_infinite]"
                        style={{ 
                          borderColor: GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]],
                          backgroundColor: 'transparent'
                        }}
                      />
                    )}
                    <i
                      className={`${MAIN_MODE_ICONS[mainMode]} relative z-10 text-2xl transition-colors duration-300`}
                      style={{
                        color: selectedMainMode === mainMode ? '#fff' : 'var(--text-primary)'
                      }}
                    />
                  </button>

                  {/* 子模式弹出选项 */}
                  {showSubModes === mainMode && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-2 min-w-32 shadow-xl z-30"
                    >
                      {GAME_MODE_GROUPS[mainMode].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleSubModeSelect(mode)}
                          className={`w-full text-left px-3 py-2 rounded-md font-medium transition-all duration-200 text-sm block ${
                            selectedMode === mode
                              ? 'text-white shadow-md'
                              : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          style={{
                            backgroundColor: selectedMode === mode ? GAME_MODE_COLORS[mode] : 'transparent',
                          }}
                        >
                          {GAME_MODE_NAMES[mode]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* 模式图标的 Tooltip */}
            {(Object.keys(GAME_MODE_GROUPS) as MainGameMode[]).map((mainMode) => (
              <ReactTooltip
                key={`tooltip-${mainMode}`}
                id={`main-mode-${mainMode}`}
                place="top"
                variant="dark"
                offset={10}
                delayShow={300}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '8px 12px',
                  zIndex: 99999,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* 标签页切换 */}
        <div className="mb-6">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab('users')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                selectedTab === 'users'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              用户排行榜
            </button>
            <button
              onClick={() => setSelectedTab('countries')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                selectedTab === 'countries'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              国家排行榜
            </button>
          </div>
        </div>

        {/* 用户排行榜的额外选项 */}
        {selectedTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 排名类型选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                排名类型
              </label>
              <select
                value={rankingType}
                onChange={(e) => setRankingType(e.target.value as RankingType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="performance">表现分数 (pp)</option>
                <option value="score">总分</option>
              </select>
            </div>

            {/* 国家筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                国家筛选
              </label>
              <CountrySelect
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="选择国家或输入国家代码"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* 排行榜内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">加载排行榜数据中...</p>
            </div>
          </div>
        ) : selectedTab === 'users' ? (
          renderUserRankings()
        ) : (
          renderCountryRankings()
        )}

        {/* 分页 */}
        {!isLoading && renderPagination()}
      </motion.div>
    </div>
  );
};

export default RankingsPage;
