import React, { useState, useEffect, useRef } from 'react';
import { FiLoader } from 'react-icons/fi';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { rankingsAPI, handleApiError } from '../utils/api';
import CountrySelect from '../components/UI/CountrySelect';
import UserRankingsList from '../components/Rankings/UserRankingsList';
import CountryRankingsList from '../components/Rankings/CountryRankingsList';
import PaginationControls from '../components/Rankings/PaginationControls';
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
    } catch (error) {
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
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 页面标题 */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            排行榜
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            查看全球顶尖玩家和国家的表现
          </p>
        </div>

        {/* 控制面板：模式选择 + 标签页和筛选选项 */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          
          {/* 游戏模式选择 */}
          <div className="flex justify-start" ref={modeSelectRef}>
            <div className="inline-flex gap-1 sm:gap-2 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-200 dark:border-gray-700 min-h-[44px] sm:min-h-[48px] items-center">
              {(Object.keys(GAME_MODE_GROUPS) as MainGameMode[]).map((mainMode) => (
                <div key={mainMode} className="relative">
                  <button
                    onClick={() => handleMainModeChange(mainMode)}
                    className={`relative px-3 py-2 sm:px-4 sm:py-2.5 rounded-md sm:rounded-lg transition-all duration-200 focus:outline-none flex items-center justify-center min-h-[32px] sm:min-h-[36px] ${
                      selectedMainMode === mainMode
                        ? 'shadow-sm sm:shadow-md'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    data-tooltip-id={`main-mode-${mainMode}`}
                    data-tooltip-content={mainMode === 'osu' ? 'osu!' : 
                                        mainMode === 'taiko' ? 'osu!taiko' :
                                        mainMode === 'fruits' ? 'osu!catch' :
                                        'osu!mania'}
                  >
                    <div
                      className="absolute inset-0 rounded-md sm:rounded-lg transition-all duration-200"
                      style={{
                        background: selectedMainMode === mainMode
                          ? `linear-gradient(135deg, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]} 0%, ${GAME_MODE_COLORS[GAME_MODE_GROUPS[mainMode][0]]}CC 100%)`
                          : 'transparent'
                      }}
                    />
                    <i
                      className={`${MAIN_MODE_ICONS[mainMode]} relative z-10 text-xl sm:text-2xl transition-colors duration-200`}
                      style={{
                        color: selectedMainMode === mainMode ? '#fff' : 'var(--text-primary)'
                      }}
                    />
                  </button>

                  {/* 子模式弹出选项 */}
                  {showSubModes === mainMode && (
                    <div className="absolute top-full mt-1 sm:mt-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl p-1.5 sm:p-2 min-w-28 sm:min-w-32 shadow-lg sm:shadow-xl z-30">
                      {GAME_MODE_GROUPS[mainMode].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleSubModeSelect(mode)}
                          className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm block ${
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

          {/* 标签页和筛选选项 */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 xl:flex-1">
          {/* 标签页切换 */}
          <div className="flex-1">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-200 dark:border-gray-700 min-h-[44px] sm:min-h-[48px] items-center">
              <button
                onClick={() => setSelectedTab('users')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  selectedTab === 'users'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                用户排行榜
              </button>
              <button
                onClick={() => setSelectedTab('countries')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  selectedTab === 'countries'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                国家排行榜
              </button>
            </div>
          </div>

          {/* 用户排行榜的筛选选项 */}
          {selectedTab === 'users' && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={rankingType}
                onChange={(e) => setRankingType(e.target.value as RankingType)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm min-h-[44px] sm:min-h-[48px]
                         focus:ring-2 focus:ring-osu-pink focus:border-transparent font-medium text-sm sm:text-base"
              >
                <option value="performance">表现分数 (pp)</option>
                <option value="score">总分</option>
              </select>

              <div className="w-full sm:w-64">
                <CountrySelect
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder="筛选国家"
                />
              </div>
            </div>
          )}
          </div>
        </div>

        {/* 排行榜内容 */}
        <div className="-mx-4 sm:mx-0 sm:bg-white sm:dark:bg-gray-800 sm:rounded-xl sm:shadow-sm sm:border sm:border-gray-200 sm:dark:border-gray-700 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 px-4 sm:px-0">
              <div className="text-center">
                <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">加载排行榜数据中...</p>
              </div>
            </div>
          ) : selectedTab === 'users' ? (
            <UserRankingsList
              rankings={userRankings}
              currentPage={currentPage}
              selectedMode={selectedMode}
              rankingType={rankingType}
            />
          ) : (
            <CountryRankingsList
              rankings={countryRankings}
              currentPage={currentPage}
              selectedMode={selectedMode}
            />
          )}

          {/* 分页 */}
          {!isLoading && (
            <PaginationControls
              total={selectedTab === 'users' ? userRankings?.total || 0 : countryRankings?.total || 0}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;