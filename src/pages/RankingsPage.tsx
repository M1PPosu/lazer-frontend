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
import { motion } from 'framer-motion';

/** Themed custom dropdown to avoid native white popup */
const RankingTypeSelect: React.FC<{
  value: RankingType;
  onChange: (v: RankingType) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const label = value === 'performance' ? 'Performance score (pp)' : 'Total points';

  return (
    <div ref={ref} className="relative">
      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-[220px] justify-between inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl
                   min-h-[44px] sm:min-h-[48px] font-medium text-sm sm:text-base text-white backdrop-blur-xl
                   shadow-[0_10px_30px_rgba(0,0,0,.25)]"
        style={{
          background:
            'linear-gradient(to bottom right, rgba(28,32,40,.60), rgba(28,32,40,.60)) padding-box, ' +
            'linear-gradient(135deg, rgba(139,92,246,.45), rgba(237,142,166,.45)) border-box',
          border: '1px solid transparent'
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{label}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* menu */}
      {open && (
        <div
          className="absolute top-full right-0 mt-1.5 z-50 w-[240px] rounded-xl overflow-hidden shadow-2xl
                     backdrop-blur-xl border border-transparent"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,24,35,.80), rgba(20,24,35,.80)) padding-box, ' +
              'linear-gradient(135deg, rgba(139,92,246,.45), rgba(237,142,166,.45)) border-box'
          }}
          role="listbox"
        >
          {(['performance', 'score'] as RankingType[]).map((opt) => {
            const isActive = value === opt;
            return (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                role="option"
                aria-selected={isActive}
                className={`w-full text-left px-3 sm:px-4 py-2.5 text-sm sm:text-base font-medium transition-colors
                           ${isActive
                             ? 'text-white bg-white/10'
                             : 'text-gray-200 hover:bg-white/10'
                           }`}
              >
                {opt === 'performance' ? 'Performance score (pp)' : 'Total points'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

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

  // Click externally to close the submode menu
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

  // Handle the main mode switching
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

  // Process sub-mode selection
  const handleSubModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setShowSubModes(null);
  };
  
  // Load user ranking list
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
      console.error('Load user ranking listfail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading country rankings
  const loadCountryRankings = async () => {
    setIsLoading(true);
    try {
      const response = await rankingsAPI.getCountryRankings(selectedMode, currentPage);
      setCountryRankings(response);
    } catch (error) {
      handleApiError(error);
      console.error('Loading country rankingsfail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the page and load the data
  const resetAndLoad = () => {
    setCurrentPage(1);
    if (selectedTab === 'users') {
      loadUserRankings();
    } else {
      loadCountryRankings();
    }
  };

  // Reset and load data when the mode changes
  useEffect(() => {
    resetAndLoad();
  }, [selectedMode, selectedTab, rankingType, selectedCountry]);

  // Loading data when paging changes
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
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Vibrant M1PP background overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(139, 92, 246, 0.10) 0%, rgba(237, 142, 166, 0.10) 100%),
            radial-gradient(900px 600px at 18% 6%,  rgba(139, 92, 246, 0.20), transparent 60%),
            radial-gradient(900px 600px at 82% 10%, rgba(237, 142, 166, 0.18), transparent 60%),
            radial-gradient(1200px 800px at 50% 120%, rgba(17, 24, 39, 0.25), transparent 70%)
          `,
          filter: 'saturate(1.04)'
        }}
      />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Leaderboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            View the performance of top players and countries around the world.
          </p>
        </div>

        {/* Control Panel: Mode Selection + Tags and filter options */}
        <div className="relative z-20 flex flex-col xl:flex-row xl:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Game Mode Selection */}
          <div className="relative z-20 flex justify-start" ref={modeSelectRef}>
            <div
          className="inline-flex gap-1 sm:gap-2 rounded-xl p-1.5 sm:p-2 min-h-[44px] sm:min-h-[48px] items-center backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,.25)]"
          style={{
         background:
        'linear-gradient(to bottom right, rgba(28,32,40,.60), rgba(28,32,40,.60)) padding-box, ' +
        'linear-gradient(135deg, rgba(139,92,246,.45), rgba(237,142,166,.45)) border-box',
         border: '1px solid transparent',
         borderRadius: '0.75rem'
      }}
>
              {(Object.keys(GAME_MODE_GROUPS) as MainGameMode[]).map((mainMode) => {
                const active = selectedMainMode === mainMode;
                return (
                  <div key={mainMode} className="relative">
                    <motion.button
                      onClick={() => handleMainModeChange(mainMode)}
                      whileHover={{ y: -0.5, scale: 1.025 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ type: 'tween', duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl transition-all group overflow-hidden transform-gpu will-change-transform
                        ${active
                          ? 'text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:text-osu-pink hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                      style={{
                        // M1Lazer theme gradient fill when active
                        background: active
                          ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                          : undefined
                      }}
                      data-tooltip-id={`main-mode-${mainMode}`}
                      data-tooltip-content={mainMode === 'osu' ? 'osu!' : 
                                          mainMode === 'taiko' ? 'osu!taiko' :
                                          mainMode === 'fruits' ? 'osu!catch' :
                                          'osu!mania'}
                      aria-label={mainMode}
                    >
                      {/* icon wiggle on hover (subtle) */}
                      <motion.i
                        className={`${MAIN_MODE_ICONS[mainMode]} text-[18px]`}
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: active ? 0 : 4 }}
                        transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
                      />

                      {/* subtle hover wash for inactive */}
                      {!active && (
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'rgba(237, 142, 166, 0.10)' }} // theme-tinted wash
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.14, ease: 'easeOut' }}
                        />
                      )}

                      {/* active glow (theme colors) */}
                      {active && (
                        <motion.div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          layoutId="rankModeActiveGlow"
                          style={{
                            boxShadow:
                              '0 0 0 2px rgba(139,92,246,0.38), 0 12px 30px rgba(237,142,166,0.25)'
                          }}
                          transition={{ type: 'tween', duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                    </motion.button>

                    {/* Submode popup options */}
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
                );
              })}
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

          {/* Tags and filter options */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 xl:flex-1">
          {/* Tag page switching */}
          <div className="flex-1">
            <div
           className="inline-flex rounded-xl p-1.5 sm:p-2 min-h-[44px] sm:min-h-[48px] items-center backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,.25)]"
           style={{
           background:
          'linear-gradient(to bottom right, rgba(28,32,40,.60), rgba(28,32,40,.60)) padding-box, ' +
          'linear-gradient(135deg, rgba(139,92,246,.45), rgba(237,142,166,.45)) border-box',
           border: '1px solid transparent',
          borderRadius: '0.75rem'
        }}
>
              <button
                onClick={() => setSelectedTab('users')}
                className={`relative inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-medium transition-all text-sm sm:text-base ${selectedTab === 'users' ? 'text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:text-osu-pink'}`}
                style={{
                  background: selectedTab === 'users' ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : undefined
                }}
              >
                Players
                {selectedTab !== 'users' && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(237,142,166,0.10)' }}
                  />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('countries')}
                className={`relative inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-medium transition-all text-sm sm:text-base ${selectedTab === 'countries' ? 'text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:text-osu-pink'}`}
                style={{
                  background: selectedTab === 'countries' ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : undefined
                }}
              >
                Countries
                {selectedTab !== 'countries' && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(237,142,166,0.10)' }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* userRanking listFilter options */}
          {selectedTab === 'users' && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* themed pp filter */}
              <RankingTypeSelect value={rankingType} onChange={setRankingType} />

              <div className="w-full sm:w-64 relative z-30">
                <div
                  className="relative z-40 overflow-visible rounded-xl p-1.5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,.25)]"
                  style={{
                    background:
                      'linear-gradient(to bottom right, rgba(28,32,40,.60), rgba(28,32,40,.60)) padding-box, ' +
                      'linear-gradient(135deg, rgba(139,92,246,.45), rgba(237,142,166,.45)) border-box',
                    border: '1px solid transparent'
                  }}
                >
                  <CountrySelect
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    placeholder="Filter countries"
                  />
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Ranking listcontent */}
        <div
         className="-mx-4 sm:mx-0 sm:rounded-2xl sm:p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,.28)]"
         style={{
         background:
        'linear-gradient(180deg, rgba(20,24,35,.60), rgba(20,24,35,.60)) padding-box, ' +
        'linear-gradient(135deg, rgba(139,92,246,.35), rgba(237,142,166,.35)) border-box',
         border: '1px solid transparent',
         borderRadius: '1rem'
       }}
>
          {isLoading ? (
            <div className="flex items-center justify-center py-16 px-4 sm:px-0">
              <div className="text-center">
                <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">loadRanking listIn the data...</p>
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

          {/* Pagination */}
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