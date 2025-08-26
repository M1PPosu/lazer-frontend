import React from 'react';
import Avatar from '../UI/Avatar';
import GameModeSelector from '../UI/GameModeSelector';
import { GAME_MODE_COLORS, type User, type GameMode } from '../../types';

interface UserProfileLayoutProps {
  user: User;
  selectedMode: GameMode;
  onModeChange: (mode: GameMode) => void;
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

const UserProfileLayout: React.FC<UserProfileLayoutProps> = ({ user, selectedMode, onModeChange }) => {
  const stats = user.statistics;
  const gradeCounts = stats?.grade_counts ?? { ssh: 0, ss: 0, sh: 0, s: 0, a: 0 };
  const levelProgress = stats?.level?.progress ?? 0;
  const levelCurrent = stats?.level?.current ?? 0;
  const playTime = formatPlayTime(stats?.play_time);
  const hitsPerPlay = stats && stats.play_count ? Math.round((stats.total_hits || 0) / stats.play_count) : 0;

  return (
    <main className="max-w-6xl mx-auto px-8 py-6">
      <div className="bg-white main-card-shadow rounded-t-2xl overflow-hidden border border-gray-100">
              <div className="relative overflow-hidden">
                  <div className="bg-white text-black px-4 py-2 flex items-center justify-between rounded-t-2xl">
                      <div className="text-lg font-bold">玩家信息</div>
                      <div className="flex items-center gap-3">
                          <button className="w-10 h-10 rounded-full ring-2 ring-black/30 grid place-items-center button-hover-shadow">
                              <span className="w-3.5 h-3.5 rounded-full bg-primary block"></span>
                          </button>
                          <button className="w-10 h-10 grid place-items-center rounded-full bg-pink-500/20 button-hover-shadow">◎</button>
                          <button className="w-10 h-10 grid place-items-center rounded-full bg-pink-500/20 button-hover-shadow">◎</button>
                          <button className="w-10 h-10 grid place-items-center rounded-full bg-pink-500/20 button-hover-shadow">◎</button>
                      </div>
                  </div>
                  <div className="h-72 cover-bg -mx-0"></div>
                  <button className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white grid place-items-center edit-button-shadow">
                      ✎
                  </button>
            </div>
      </div>
     
    </main>
  );
};

export default UserProfileLayout;

