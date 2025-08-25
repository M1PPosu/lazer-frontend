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
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
        <div
          className="h-72 relative"
          style={{
            backgroundImage: user.cover_url || user.cover?.url ? `url(${user.cover_url || user.cover?.url})` : undefined,
            backgroundSize: 'cover',
          }}
        >
          <GameModeSelector
            selectedMode={selectedMode}
            onModeChange={onModeChange}
            variant="compact"
            className="absolute top-4 right-4"
          />
        </div>

        {/* Avatar and basic info */}
        <div className="bg-white px-8 py-8 flex items-center gap-6 border-b border-gray-200 relative">
          <div className="w-32 h-32 rounded-2xl border-4 border-white avatar-gradient shadow-lg flex-shrink-0 -mt-16 overflow-hidden">
            <Avatar userId={user.id} username={user.username} avatarUrl={user.avatar_url} size="2xl" className="!border-0 rounded-2xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-gray-800 break-all">{user.username}</h1>
            {user.country && (
              <div className="flex items-center gap-4">
                <img src={`https://flagcdn.com/w20/${user.country.code.toLowerCase()}.png`} alt={user.country.code} className="w-6 h-4 rounded-sm" />
                <span className="text-gray-600">{user.country.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main stats area */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex gap-4">
            {/* Left side */}
            <div className="flex-[3] flex flex-col gap-3">
              <div className="flex gap-8 bg-gray-50 p-3 rounded-lg">
                <div className="text-center">
                  <div className="text-gray-500 mb-1 text-[12px]">全球排名</div>
                  <div className="font-bold text-primary text-[30px]">
                    {stats?.global_rank ? `#${stats.global_rank.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 mb-1 text-[12px]">地区排名</div>
                  <div className="font-bold text-primary text-[30px]">
                    {stats?.country_rank ? `#${stats.country_rank.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Chart placeholder */}
              <div className="relative w-full h-32 bg-gray-50 rounded-lg overflow-hidden">
                <div className="chart-line absolute bottom-0 left-0 right-0 h-20" />
              </div>

              {/* Extra info */}
              <div className="bg-gray-50 px-4 py-3 rounded-lg flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="text-center">
                    <div className="text-gray-500 text-xs mb-1">PP</div>
                    <div className="text-gray-800 font-bold text-base">
                      {stats?.pp ? Math.round(stats.pp).toLocaleString() : '0'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs mb-1">游戏时间</div>
                    <div className="text-gray-800 font-bold text-base">{playTime}</div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <div className="w-10 h-10 bg-primary rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white">
                    <div>SSH</div>
                    <div className="text-xs mt-1">{gradeCounts.ssh}</div>
                  </div>
                  <div className="w-10 h-10 bg-primary rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white">
                    <div>SS</div>
                    <div className="text-xs mt-1">{gradeCounts.ss}</div>
                  </div>
                  <div className="w-10 h-10 bg-secondary rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white">
                    <div>SH</div>
                    <div className="text-xs mt-1">{gradeCounts.sh}</div>
                  </div>
                  <div className="w-10 h-10 bg-secondary rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white">
                    <div>S</div>
                    <div className="text-xs mt-1">{gradeCounts.s}</div>
                  </div>
                  <div className="w-10 h-10 bg-yellow-400 text-black rounded-lg flex flex-col items-center justify-center font-bold text-xs">
                    <div>A</div>
                    <div className="text-xs mt-1">{gradeCounts.a}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side stats */}
            <div className="flex-1">
              <div className="bg-gray-50 p-3 rounded-lg h-full flex flex-col justify-center">
                <div className="text-gray-500 text-xs mb-2 font-medium">统计信息</div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">每日游戏</span>
                    <span className="text-gray-800 font-bold text-xs">
                      {Math.round((stats?.play_time || 0) / 86400)}天
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">计分成绩点</span>
                    <span className="text-primary font-bold text-xs">
                      {(stats?.ranked_score || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">准确率</span>
                    <span className="text-gray-800 font-bold text-xs">
                      {(stats?.hit_accuracy || 0).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">游戏次数</span>
                    <span className="text-gray-800 font-bold text-xs">
                      {(stats?.play_count || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">总分</span>
                    <span className="text-gray-800 font-bold text-xs">
                      {(stats?.total_score || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">总命中次数</span>
                    <span className="text-gray-800 font-bold text-xs">
                      {(stats?.total_hits || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">每次游戏击打数</span>
                    <span className="text-gray-800 font-bold text-xs">{hitsPerPlay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">最大连击</span>
                    <span className="text-gray-800 font-bold text-xs">
                      {(stats?.maximum_combo || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">回放被观看次数</span>
                    <span className="text-gray-800 font-bold text-xs">
                      {(stats?.replays_watched_by_others || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <div className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700">
                <span>好友</span>
                <span>{user.follower_count?.toLocaleString() || 0}</span>
              </div>
              <div className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700">
                <span>🔔</span>
                <span>{user.unread_pm_count?.toLocaleString() || 0}</span>
              </div>
            </div>
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: `conic-gradient(${GAME_MODE_COLORS[selectedMode]} ${levelProgress * 3.6}deg, rgba(0,0,0,0.1) ${levelProgress * 3.6}deg)` }}
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-gray-200">
                  <span className="font-bold text-xl text-gray-800">{levelCurrent}</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                {levelProgress}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfileLayout;

