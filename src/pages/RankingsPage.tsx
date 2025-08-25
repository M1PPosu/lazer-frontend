import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiGlobe, FiLoader, FiTrendingUp, FiUsers, FiStar, FiMapPin } from 'react-icons/fi';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { rankingsAPI, handleApiError } from '../utils/api';
import CountrySelect from '../components/UI/CountrySelect';
import RankBadge from '../components/UI/RankBadge';
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
      setShowSubModes(showSubModes === mainMode ? null : mainMode);
    } else {
      setSelectedMainMode(mainMode);
      setShowSubModes(mainMode);
      const firstSubMode = GAME_MODE_GROUPS[mainMode][0];
      setSelectedMode(firstSubMode);
    }
  };

  // 处理子模式选择
  const handleSubModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setShowSubModes(null);
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
        <div className="text-center py-20">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <FiAward className="text-4xl text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            暂无排行榜数据
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            当前筛选条件下没有找到数据
          </p>
        </div>
      );
    }

    const startRank = (currentPage - 1) * 50 + 1;

    return (
      <div className="space-y-3">
        {userRankings.ranking.map((ranking: UserRanking, index: number) => {
          const rank = startRank + index;
          const isTopThree = rank <= 3;
          
          return (
            <div
              key={ranking.user.id}
              className={`group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 
                         border border-gray-100 dark:border-gray-700 
                         hover:border-gray-200 dark:hover:border-gray-600
                         hover:shadow-lg transition-all duration-200
                         ${isTopThree ? 'ring-2 ring-yellow-400/20 bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10' : ''}`}
            >
              <div className="flex items-center gap-4 p-5">
                {/* 排名徽章 */}
                <div className="flex-shrink-0">
                  <RankBadge rank={rank} size="md" />
                </div>

                {/* 用户头像 */}
                <Link to={`/users/${ranking.user.id}`} className="flex-shrink-0">
                  <img
                    src={ranking.user.avatar_url || '/default.jpg'}
                    alt={ranking.user.username}
                    className="w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 
                             hover:border-blue-400 dark:hover:border-blue-500
                             transition-colors duration-200"
                  />
                </Link>

                {/* 用户信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link 
                      to={`/users/${ranking.user.id}`}
                      className="font-semibold text-lg text-gray-900 dark:text-white 
                               hover:text-blue-600 dark:hover:text-blue-400 
                               transition-colors truncate"
                    >
                      {ranking.user.username}
                    </Link>
                    {ranking.user.country_code && (
                      <img
                        src={`https://flagcdn.com/20x15/${ranking.user.country_code.toLowerCase()}.png`}
                        alt={ranking.user.country_code}
                        className="w-5 h-4 rounded-sm"
                        title={ranking.user.country?.name || ranking.user.country_code}
                      />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ranking.user.country?.name || ranking.user.country_code}
                  </div>
                </div>

                {/* 分数显示 */}
                <div className="text-right">
                  <div 
                    className="text-xl font-bold"
                    style={{ color: GAME_MODE_COLORS[selectedMode] }}
                  >
                    {rankingType === 'performance' 
                      ? `${Math.round(ranking.pp || 0).toLocaleString()}pp`
                      : `${(ranking.ranked_score || 0).toLocaleString()}`
                    }
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {rankingType === 'performance' ? '表现分数' : '总分'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCountryRankings = () => {
    if (!countryRankings || !countryRankings.ranking.length) {
      return (
        <div className="text-center py-20">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <FiGlobe className="text-4xl text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            暂无国家排行榜数据
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            当前模式下没有找到国家数据
          </p>
        </div>
      );
    }

    const startRank = (currentPage - 1) * 50 + 1;

    return (
      <div className="space-y-3">
        {countryRankings.ranking.map((ranking: CountryRanking, index: number) => {
          const rank = startRank + index;
          const isTopThree = rank <= 3;
          
          return (
            <div
              key={ranking.code}
              className={`group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 
                         border border-gray-100 dark:border-gray-700 
                         hover:border-gray-200 dark:hover:border-gray-600
                         hover:shadow-lg transition-all duration-200
                         ${isTopThree ? 'ring-2 ring-yellow-400/20 bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10' : ''}`}
            >
              <div className="flex items-center gap-4 p-5">
                {/* 排名徽章 */}
                <div className="flex-shrink-0">
                  <RankBadge rank={rank} size="md" />
                </div>

                {/* 国旗 */}
                <div className="flex-shrink-0">
                  <img
                    src={`https://flagcdn.com/48x36/${ranking.code.toLowerCase()}.png`}
                    alt={ranking.code}
                    className="w-12 h-9 rounded border border-gray-200 dark:border-gray-600"
                  />
                </div>

                {/* 国家信息 */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-gray-900 dark:text-white truncate mb-1">
                    {ranking.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ranking.active_users.toLocaleString()} 活跃用户 • {ranking.play_count.toLocaleString()} 游戏次数
                  </div>
                </div>

                {/* 统计数据 */}
                <div className="text-right">
                  <div 
                    className="text-xl font-bold"
                    style={{ color: GAME_MODE_COLORS[selectedMode] }}
                  >
                    {Math.round(ranking.performance).toLocaleString()}pp
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    总体表现
                  </div>
                </div>
              </div>
            </div>
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
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                   text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700
                   hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
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
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            i === currentPage
              ? 'bg-blue-600 text-white border border-blue-600'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
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
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                   text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700
                   hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            排行榜
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            查看全球顶尖玩家和国家的表现
          </p>
        </div>

        {/* 游戏模式选择 */}
        <div className="mb-6">
          <div className="flex justify-center" ref={modeSelectRef}>
            <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700">
              {(Object.keys(GAME_MODE_GROUPS) as MainGameMode[]).map((mainMode) => (
                <div key={mainMode} className="relative">
                  <button
                    onClick={() => handleMainModeChange(mainMode)}
                    className={`relative p-3 rounded-lg transition-all duration-200 focus:outline-none ${
                      selectedMainMode === mainMode
                        ? 'scale-105 shadow-md'
                        : 'hover:scale-102 opacity-70 hover:opacity-100'
                    }`}
                    data-tooltip-id={`main-mode-${mainMode}`}
                    data-tooltip-content={mainMode === 'osu' ? 'osu!' : 
                                        mainMode === 'taiko' ? 'osu!taiko' :
                                        mainMode === 'fruits' ? 'osu!catch' :
                                        'osu!mania'}
                  >
                    <div
                      className="absolute inset-0 rounded-lg transition-all duration-200"
                      style={{
                        background: selectedMainMode === mainMode
                          ? `linear-gradient(135deg, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]} 0%, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]}CC 100%)`
                          : 'transparent'
                      }}
                    />
                    <i
                      className={`${MAIN_MODE_ICONS[mainMode]} relative z-10 text-2xl transition-colors duration-200`}
                      style={{
                        color: selectedMainMode === mainMode ? '#fff' : 'var(--text-primary)'
                      }}
                    />
                  </button>

                  {/* 子模式弹出选项 */}
                  {showSubModes === mainMode && (
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2 min-w-32 shadow-xl z-30">
                      {GAME_MODE_GROUPS[mainMode].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleSubModeSelect(mode)}
                          className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm block ${
                            selectedMode === mode
                              ? 'text-white shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          style={{
                            backgroundColor: selectedMode === mode ? GAME_MODE_COLORS[mode] : 'transparent',
                          }}
                        >
                          {GAME_MODE_NAMES[mode]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tooltip */}
            {(Object.keys(GAME_MODE_GROUPS) as MainGameMode[]).map((mainMode) => (
              <ReactTooltip
                key={`tooltip-${mainMode}`}
                id={`main-mode-${mainMode}`}
                place="top"
                variant="dark"
                offset={10}
                delayShow={300}
              />
            ))}
          </div>
        </div>

        {/* 标签页和筛选选项 */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          {/* 标签页切换 */}
          <div className="flex-1">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setSelectedTab('users')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  selectedTab === 'users'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                用户排行榜
              </button>
              <button
                onClick={() => setSelectedTab('countries')}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  selectedTab === 'countries'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                国家排行榜
              </button>
            </div>
          </div>

          {/* 用户排行榜的筛选选项 */}
          {selectedTab === 'users' && (
            <div className="flex gap-4">
              <select
                value={rankingType}
                onChange={(e) => setRankingType(e.target.value as RankingType)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              >
                <option value="performance">表现分数 (pp)</option>
                <option value="score">总分</option>
              </select>

              <div className="w-64">
                <CountrySelect
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder="筛选国家"
                />
              </div>
            </div>
          )}
        </div>

        {/* 排行榜内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">加载排行榜数据中...</p>
              </div>
            </div>
          ) : selectedTab === 'users' ? (
            renderUserRankings()
          ) : (
            renderCountryRankings()
          )}

          {/* 分页 */}
          {!isLoading && renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;