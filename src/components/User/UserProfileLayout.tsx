import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Avatar from '../UI/Avatar';
import GameModeSelector from '../UI/GameModeSelector';
import RankHistoryChart from '../UI/RankHistoryChart';
import PlayerRankCard from '../User/PlayerRankCard';
import StatsCard from '../User/StatsCard';
import LevelProgress from '../UI/LevelProgress';
import { type User, type GameMode } from '../../types';
import FriendStats from './FriendStats';
import UserRecentActivity from './UserRecentActivity';
import UserBestScores from './UserBestScores';
import UserPageDisplay from './UserPageDisplay';
import { BiSolidPencil } from 'react-icons/bi';
import { FaTools } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { useAuth } from '../../hooks/useAuth';

interface UserProfileLayoutProps {
  user: User;
  selectedMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onUserUpdate?: (user: User) => void;
}

const formatPlayTime = (seconds: number | undefined): string => {
  if (!seconds) return '0m';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.join(' ') || '0m';
};

/** Cover with lazy/blur */
const CoverImage: React.FC<{ src?: string; alt?: string }> = ({ src, alt = 'cover' }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden h-[180px] md:h-[288px]">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-white/0 dark:bg-black/10" />
      </div>

      {inView && src && !error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
    </div>
  );
};

const UserProfileLayout: React.FC<UserProfileLayoutProps> = ({ user, selectedMode, onModeChange, onUserUpdate }) => {
  const { t } = useTranslation();
  const { refreshUser, user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const stats = user.statistics;
  const gradeCounts = stats?.grade_counts ?? { ssh: 0, ss: 0, sh: 0, s: 0, a: 0 };
  const levelProgress = stats?.level?.progress ?? 0;
  const levelCurrent = stats?.level?.current ?? 0;
  const playTime = formatPlayTime(stats?.play_time);
  const user_achievements = Array.isArray(user.user_achievements)
    ? user.user_achievements.filter(
        (a): a is { achievement_id: number; achieved_at: string } =>
          typeof a === 'object' &&
          a !== null &&
          typeof (a as any).achievement_id === 'number' &&
          typeof (a as any).achieved_at === 'string'
      )
    : undefined;

  const coverUrlRaw = user.cover_url || user.cover?.url || undefined;
  const coverUrl =
    coverUrlRaw === "https://assets.ppy.sh/user-profile-covers/default.jpeg"
      ? "/image/backgrounds/bgcover.jpg"
      : coverUrlRaw;
  const [isUpdatingMode] = useState(false);

  // can edit only on own page
  const canEdit = currentUser?.id === user.id;

  const handleEditClick = () => {
    navigate('/settings');
  };

  const handleAvatarUpdate = async (newAvatarUrl: string) => {
    if (newAvatarUrl) { /* acknowledge */ }
    setTimeout(async () => {
      await refreshUser();
    }, 3000);
  };

  // THEME: unified surface for key cards
  const cardShell =
  "rounded-lg border border-gray-200/60 dark:border-white/10 ring-1 ring-[#6f13f0]/15 " +
  "bg-gradient-to-r from-[#f6f2ff]/90 to-[#ffeaf4]/90 " +   // light
  "dark:from-[#1b203a]/90 dark:to-[#2a2233]/90 " +          // dark
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_-16px_rgba(0,0,0,0.45),0_0_28px_0_rgba(111,19,240,0.22)]";

  return (
    <main className="max-w-6xl mx-auto px-0 md:px-4 lg:px-8 py-4 md:py-6">
      {/* main card */}
      <div className="bg-transparent md:bg-white/95 md:dark:bg-gray-900/85 md:main-card-shadow md:rounded-t-2xl md:rounded-b-2xl overflow-hidden md:border md:border-gray-100/70 md:dark:border-white/10">
        {/* header + modes */}
        <div className="relative overflow-visible">
          <div className="relative z-20 bg-white/95 dark:bg-gray-900/85 text-gray-900 dark:text-gray-100 px-3 md:px-4 py-2 flex items-center justify-between md:rounded-t-2xl border-b border-gray-100/70 dark:border-white/10 overflow-visible">
            <div className="text-base md:text-lg font-bold">{t('profile.info.title')}</div>
            <div className="flex items-center gap-2 md:gap-3">
              <GameModeSelector
               selectedMode={selectedMode}
               onModeChange={onModeChange}
               variant="compact"
               className="relative z-50"
             />
            </div>
          </div>

          {/* cover */}
          <CoverImage src={coverUrl} alt={`${user.username} cover`} />

          {/* edit (self only) */}
          {canEdit && (
            <button 
              onClick={handleEditClick}
              className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black/55 text-white grid place-items-center edit-button-shadow text-xs md:text-sm hover:bg-black/70 transition-colors" 
              aria-label={t('profile.userPage.editCover')}
            >
              <BiSolidPencil />
            </button>
          )}
        </div>

        {/* identity row */}
        <div className="bg-white/90 dark:bg-gray-900/80 px-3 md:px-8 py-4 md:py-6 flex items-center gap-4 md:gap-6 border-b border-gray-200/60 dark:border-white/10 relative">
          <div className="-mt-16">
            <Avatar
              userId={user.id}
              username={user.username}
              avatarUrl={user.avatar_url}
              size="xl"
              shape="rounded"
              editable={false}
              className="mt-[10px]  md:mt-[1px] md:!w-32 md:!h-32 md:!min-w-32 md:!min-h-32"
              onAvatarUpdate={handleAvatarUpdate}
            />
          </div>
          <div className="flex-1">
            <h1 className="mt-[-12px] md:mt-[-15px] ml-0 md:ml-[-10px] text-xl md:text-3xl font-bold mb-3 md:mb-2 text-gray-900 dark:text-gray-100">
              {user.username}
            </h1>
            <div className="flex mt-[-10px] items-center gap-2 md:gap-4 md:mt-[10px] md:ml-[-8px] flex-wrap">
              {/* country */}
              {user.country?.code && (
                <div className="flex items-center gap-2">
                  <img
                    src={`/image/flag/${user.country.code.toLowerCase()}.svg`}
                    alt={user.country.name}
                    className="h-[20px] md:h-[25px] w-auto rounded-sm object-contain cursor-help"
                    loading="lazy"
                    decoding="async"
                    data-tooltip-id="country-tooltip"
                    data-tooltip-content={user.country?.name || 'Country'}
                  />
                  <span className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    {user.country?.code || 'Country'}
                  </span>
                </div>
              )}

              {/* team */}
              {user.team && (
                <div className="flex items-center gap-2">
                  <img
                    src={user.team.flag_url}
                    alt="Team flag"
                    className="h-[20px] md:h-[25px] w-auto rounded-sm object-contain cursor-help"
                    loading="lazy"
                    decoding="async"
                    data-tooltip-id="team-tooltip"
                    data-tooltip-content={user.team.name}
                  />
                  <span className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    {user.team.short_name || user.team.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* tooltips */}
        <Tooltip id="country-tooltip" />
        <Tooltip id="team-tooltip" />

        {/* main content */}
        <div className="bg-white/90 dark:bg-gray-900/80 px-3 md:px-6 py-4 border-b border-gray-200/60 dark:border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* left column */}
            <div className="flex-[3] flex flex-col gap-3">
              {/* rank summary */}
              <div className={`flex gap-8 p-3 md:rounded-lg md:rank-card-shadow ${cardShell}`}>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-300 text-[12px]">{t('profile.info.globalRank')}</div>
                  <div className="font-bold text-osu-pink text-[20px]">#{stats?.global_rank ?? '—'}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 dark:text-gray-300 text-[12px]">{t('profile.info.countryRank')}</div>
                  <div className="font-bold text-osu-pink text-[20px]">#{stats?.country_rank ?? '—'}</div>
                </div>
              </div>

              {/* chart — removed negative margins to avoid overlap */}
              <div className={`w-full p-3 md:rounded-lg ${cardShell}`}>
                <RankHistoryChart
                  rankHistory={user.rank_history}
                  isUpdatingMode={isUpdatingMode}
                  selectedModeColor="#6f13f0"
                  delay={0.4}
                  height="6rem"
                />
              </div>

              {/* PP / playtime / grade counts — spacing fixed */}
              <div className={`w-full p-0 md:rounded-lg ${cardShell}`}>
                <PlayerRankCard
                  stats={stats}
                  playTime={playTime}
                  user_achievements={user_achievements}
                  gradeCounts={gradeCounts}
                />
              </div>
            </div>

            {/* right column */}
            <div className="flex-1">
              <div className={`p-3 md:rounded-lg h-full flex flex-col justify-center md:stats-card-shadow ${cardShell}`}>
                <StatsCard stats={stats} />
              </div>
            </div>
          </div>
        </div>

        {/* friends + level */}
        <div className="bg-white/90 dark:bg-gray-900/80 px-3 md:px-6 lg:px-8 py-4 md:py-6 relative border-b border-gray-200/60 dark:border-white/10">
          <div className="flex items-center justify-between relative">
            <FriendStats user={user} />
            <div className="flex items-center gap-4">
              <LevelProgress
                levelCurrent={levelCurrent}
                levelProgress={levelProgress}
                className="flex-1"
                tint="linear-gradient(90deg,#6f13f0 0%, #8B5CF6 40%, #ED8EA6 100%)"
               />
            </div>
          </div>
        </div>

        {/* about me */}
        <div className="bg-white/90 dark:bg-gray-900/80 px-3 md:px-6 lg:px-8 py-3 md:py-4 border-b border-gray-200/60 dark:border-white/10">
          <UserPageDisplay
            user={user}
            onUserUpdate={onUserUpdate}
          />
        </div>

          {/* best scores */}
        <div className="bg-white/90 dark:bg-gray-900/80 px-3 md:px-6 lg:px-8 py-3 md:py-4 border-b border-gray-200/60 dark:border-white/10">
          <UserBestScores userId={user.id} selectedMode={selectedMode} user={user} />
        </div>


         {/* recent activity */}
        <div className="bg-white/90 dark:bg-gray-900/80 px-3 md:px-6 lg:px-8 py-3 md:py-4 border-b border-gray-200/60 dark:border-white/10">
          <UserRecentActivity userId={user.id} />
        </div>

        {/* construction */}
        <div className="bg-gradient-to-r from-[#f6f2ff]/80 to-[#ffeaf4]/80 dark:from-[#1b203a]/70 dark:to-[#2a2233]/70 p-3 md:rounded-lg h-[500px] flex flex-col justify-center">
          <div className="flex justify-center items-center h-full">
            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaTools className="text-lg text-osu-pink/90" />
              {t('profile.info.underConstruction')}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};

export default UserProfileLayout;
