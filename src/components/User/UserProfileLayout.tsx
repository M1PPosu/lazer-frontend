import React, { useEffect, useMemo, useRef, useState } from 'react';
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

/** 头图懒加载 + blur 过渡 */
const CoverImage: React.FC<{ src?: string; alt?: string; height?: number; tint?: string }> = ({ src, alt = 'cover', height = 288, tint = '#ED8EA6' }) => {
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
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height }}>
      {/* 骨架 or 渐变背景兜底 */}
      <div className="absolute inset-0 cover-bg">
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

      {/* 黑色顶层渐变，保证文字可读 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
    </div>
  );
};

const UserProfileLayout: React.FC<UserProfileLayoutProps> = ({ user, selectedMode, onModeChange }) => {
  const stats = user.statistics;
  const gradeCounts = stats?.grade_counts ?? { ssh: 0, ss: 0, sh: 0, s: 0, a: 0 };
  const levelProgress = stats?.level?.progress ?? 0;
  const levelCurrent = stats?.level?.current ?? 0;
  const playTime = formatPlayTime(stats?.play_time);
  const hitsPerPlay = stats && stats.play_count ? Math.round((stats.total_hits || 0) / stats.play_count) : 0;

  const coverUrl = user.cover_url || user.cover?.url || undefined;
  const tint = useMemo(() => GAME_MODE_COLORS[selectedMode] || '#ED8EA6', [selectedMode]);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-6">
      {/* 主卡片 */}
      <div className="bg-white/95 dark:bg-gray-900/85 main-card-shadow rounded-t-2xl overflow-hidden border border-gray-100/70 dark:border-white/10">
        {/* 头部栏 + 模式选择（与头图同容器） */}
        <div className="relative overflow-hidden">
          <div className="bg-white/95 dark:bg-gray-900/85 text-gray-900 dark:text-gray-100 px-4 py-2 flex items-center justify-between rounded-t-2xl border-b border-gray-100/70 dark:border-white/10">
            <div className="text-lg font-bold">玩家信息</div>
            <div className="flex items-center gap-3">
              {/* 右侧模式按钮们（来自你的 GameModeSelector） */}
              <GameModeSelector
                selectedMode={selectedMode}
                onModeChange={onModeChange}
                variant="compact"
                className=""
              />
            </div>
          </div>

          {/* 头图懒加载 */}
          <CoverImage src={coverUrl} alt={`${user.username} cover`} height={288} tint={tint} />

          {/* 编辑按钮 */}
          <button className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white grid place-items-center edit-button-shadow" aria-label="编辑封面">
            ✎
          </button>
        </div>

        {/* 头像与基本信息条 */}
        <div className="bg-white/95 dark:bg-gray-900/85 px-6 md:px-8 py-2 flex items-center gap-6 border-b border-gray-200/60 dark:border-white/10 relative">
          {/* 头像：渐变边 + 阴影，左下沉覆盖 */}
          <div className="-mt-16">
            <Avatar
              userId={user.id}
              username={user.username}
              avatarUrl={user.avatar_url}
              size="2xl"
              shape="rounded"
              className=""
            />
          </div>
          {/* 用户名 + 国家 + 团队旗帜 */}
          <div className="flex-1">
            <h1 className="mt-[-15px] ml-[-10px] text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {user.username}
            </h1>
            <div className="flex items-center gap-4">
              {/* 国旗（使用 flagcdn 动态加载） */}
              {user.country?.code && (
                <img
                  src={`https://flagcdn.com/${user.country.code.toLowerCase()}.svg`}
                  alt={user.country.name}
                  className="ml-[-8px] h-[25px] rounded-sm object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}

              <span className="text-gray-600 dark:text-gray-300 ml-[-6px]">
                {user.country?.name || '国家'}
              </span>

              {/* 团队旗帜 */}
              {user.team && (
                <span className="inline-flex items-center">
                  <img
                    src={user.team.flag_url}
                    alt="团队旗帜"
                    className="h-[25px] w-auto rounded-sm object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="text-gray-600 dark:text-gray-300 ml-[10px]">
                    {user.team.name}
                  </span>
                </span>
              )}
            </div>
          </div>
          </div>



        {/* 中部：左 3/4（排名+折线+信息），右 1/4（统计） */}
        <div className="bg-white/95 dark:bg-gray-900/85 px-4 md:px-6 py-4 border-b border-gray-200/60 dark:border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 左侧 3/4 */}
            <div className="flex-[3] flex flex-col gap-3">
              {/* 排名 */}
              <div className="flex gap-8 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg rank-card-shadow">
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-1 text-[12px]">全球排名</div>
                  <div className="font-bold text-primary text-[30px]">#{stats?.global_rank ?? '—'}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-1 text-[12px]">地区排名</div>
                  <div className="font-bold text-primary text-[30px]">#{stats?.country_rank ?? '—'}</div>
                </div>
              </div>

              {/* 折线图占位（你可替换成真实图表） */}
              <div className="relative w-full h-32 bg-gray-50 dark:bg-gray-800/60 rounded-lg overflow-hidden rank-card-shadow">
                <div className="chart-line absolute bottom-0 left-0 right-0 h-20" />
              </div>

              {/* 附加信息（PP / 游戏时间 / 成绩徽章） */}
              <div className="bg-gray-50 dark:bg-gray-800/60 px-4 py-3 rounded-lg flex justify-between items-center rank-card-shadow">
                <div className="flex gap-4 items-center">
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">PP</div>
                    <div className="text-gray-800 dark:text-gray-100 font-bold text-base">{stats?.pp ?? 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">游戏时间</div>
                    <div className="text-gray-800 dark:text-gray-100 font-bold text-base">{playTime}</div>
                  </div>
                  {hitsPerPlay ? (
                    <div className="text-center">
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">每次游戏击打</div>
                      <div className="text-gray-800 dark:text-gray-100 font-bold text-base">{hitsPerPlay}</div>
                    </div>
                  ) : null}
                </div>

                <div className="flex gap-1">
                  <div className="w-10 h-10 bg-primary rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white badge-shadow">
                    <div>SSH</div>
                    <div className="text-[10px] mt-1">{gradeCounts.ssh}</div>
                  </div>
                  <div className="w-10 h-10 bg-primary rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white badge-shadow">
                    <div>SS</div>
                    <div className="text-[10px] mt-1">{gradeCounts.ss}</div>
                  </div>
                  <div className="w-10 h-10 bg-secondary rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white badge-shadow">
                    <div>SH</div>
                    <div className="text-[10px] mt-1">{gradeCounts.sh}</div>
                  </div>
                  <div className="w-10 h-10 bg-secondary rounded-lg flex flex-col items-center justify-center font-bold text-xs text-white badge-shadow">
                    <div>S</div>
                    <div className="text-[10px] mt-1">{gradeCounts.s}</div>
                  </div>
                  <div className="w-10 h-10 bg-yellow-400 text-black rounded-lg flex flex-col items-center justify-center font-bold text-xs badge-shadow">
                    <div>A</div>
                    <div className="text-[10px] mt-1">{gradeCounts.a}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧 1/4：统计信息 */}
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg h-full flex flex-col justify-center stats-card-shadow">
                <div className="text-gray-500 dark:text-gray-400 text-xs mb-2 font-medium">统计信息</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">准确率</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold">{(stats?.hit_accuracy ?? 0).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">PP</span>
                    <span className="text-primary font-bold">{stats?.pp ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">计分成绩点</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold">{stats?.ranked_score?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">总分</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold">{stats?.total_score?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">游戏次数</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold">{stats?.play_count?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">总命中次数</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold">{stats?.total_hits?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">最大连击</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold">{stats?.maximum_combo?.toLocaleString() ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">回放被观看</span>
                    <span className="text-gray-800 dark:text-gray-100 font-bold">{stats?.replays_watched_by_others?.toLocaleString() ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部：好友/消息 + 等级进度 */}
        <div className="bg-white/95 dark:bg-gray-900/85 px-6 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 friend-button-shadow">
                <span>好友</span>
                <span>{user.follower_count ?? 0}</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 friend-button-shadow">
                <span>🔔</span>
                <span>{user.unread_pm_count ?? 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* 进度条（左） */}
              <div className="relative w-48 h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden inner-card-shadow">
                <div
                  className="absolute top-0 left-0 h-full inner-card-shadow"
                  style={{ width: `${levelProgress}%`, backgroundColor: tint }}
                />
              </div>
              {/* 标签（右） */}
              <span className="text-gray-800 dark:text-gray-100 font-semibold">Lv.{levelCurrent} · {levelProgress}%</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfileLayout;
