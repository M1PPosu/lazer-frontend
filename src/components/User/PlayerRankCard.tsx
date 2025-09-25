import React from "react";

interface Props {
  stats?: { pp?: number };
  playTime: string;
  user_achievements?: {
    achievement_id: number;
    achieved_at: string;
  }[];
  gradeCounts: {
    ssh: number;
    ss: number;
    sh: number;
    s: number;
    a: number;
  };
}

const PlayerRankCard: React.FC<Props> = ({ stats, playTime, user_achievements, gradeCounts }) => {
  const achievementCount = user_achievements
    ? new Set(user_achievements.map((a) => a.achievement_id)).size
    : 0;

  return (
    <div
      className="
        px-2 md:px-4 py-3
        flex flex-col md:flex-row gap-4 md:justify-between md:items-center
        rounded-lg
        bg-white/50 dark:bg-gray-800/40 backdrop-blur
        border border-white/30 dark:border-white/10
        shadow-[0_8px_24px_-10px_rgba(139,92,246,0.28)]
      "
    >
      {/* Left: Medals / PP / Last visit */}
      <div className="grid grid-cols-3 gap-3 md:gap-5 items-center md:items-start ml-0 md:ml-0">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-400/90">Medals</div>
          <div
            className="mt-1 text-sm md:text-base font-extrabold leading-tight bg-clip-text text-transparent tabular-nums whitespace-nowrap"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            {achievementCount}
          </div>
        </div>

        <div className="min-w-0 md:border-l md:border-white/10 md:pl-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-400/90">PP</div>
          <div
            className="mt-1 text-sm md:text-base font-extrabold leading-tight bg-clip-text text-transparent tabular-nums whitespace-nowrap"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            {Math.round(stats?.pp ?? 0)}
          </div>
        </div>

        <div className="min-w-0 md:border-l md:border-white/10 md:pl-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-400/90">Last visit time</div>
          <div
            className="mt-1 text-sm md:text-base font-extrabold leading-tight bg-clip-text text-transparent tabular-nums whitespace-nowrap"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            {playTime}
          </div>
        </div>
      </div>

      {/* Right: Rating badge */}
      <div className="flex gap-1 md:gap-2 items-center pr-2 md:pr-4 justify-center md:justify-end">
        <div className="flex flex-col items-center text-xs font-bold text-gray-700 dark:text-gray-200 p-1.5 rounded-md bg-white/40 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <img src="/image/grades/GradeSmall-SS-Silver.svg" alt="SSH" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="mt-1">{gradeCounts.ssh}</span>
        </div>
        <div className="flex flex-col items-center text-xs font-bold text-gray-700 dark:text-gray-200 p-1.5 rounded-md bg-white/40 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <img src="/image/grades/GradeSmall-SS.svg" alt="SS" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="mt-1">{gradeCounts.ss}</span>
        </div>
        <div className="flex flex-col items-center text-xs font-bold text-gray-700 dark:text-gray-200 p-1.5 rounded-md bg-white/40 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <img src="/image/grades/GradeSmall-S-Silver.svg" alt="SH" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="mt-1">{gradeCounts.sh}</span>
        </div>
        <div className="flex flex-col items-center text-xs font-bold text-gray-700 dark:text-gray-200 p-1.5 rounded-md bg-white/40 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <img src="/image/grades/GradeSmall-S.svg" alt="S" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="mt-1">{gradeCounts.s}</span>
        </div>
        <div className="flex flex-col items-center text-xs font-bold text-gray-700 dark:text-gray-200 p-1.5 rounded-md bg-white/40 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <img src="/image/grades/GradeSmall-A.svg" alt="A" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="mt-1">{gradeCounts.a}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerRankCard;
