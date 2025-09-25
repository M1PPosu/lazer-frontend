import React from "react";

interface Stats {
  hit_accuracy?: number;
  pp?: number;
  ranked_score?: number;
  total_score?: number;
  play_count?: number;
  total_hits?: number;
  maximum_combo?: number;
  replays_watched_by_others?: number;
}

interface StatsCardProps {
  stats?: Stats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  // Hits per game = total_hits / play_count
  const avgHitsPerPlay =
    stats?.play_count && stats.play_count > 0
      ? Math.round((stats.total_hits ?? 0) / stats.play_count)
      : 0;

  // Compact labels + subtle underline (doesn't affect layout)
  const labelClass =
    "relative text-[10px] md:text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400/90 " +
    "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-8 after:rounded " +
    "after:bg-white/20 dark:after:bg-white/10";
  const valueClass =
    "text-xs md:text-sm font-extrabold text-transparent bg-clip-text " +
    "bg-gradient-to-r from-[#8b5cf6] to-[#ed8ea6] tabular-nums";

  const fmt = (n?: number) => (n ?? 0).toLocaleString();

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Total score", value: fmt(stats?.total_score) },
    { label: "Accuracy", value: `${(stats?.hit_accuracy ?? 0).toFixed(2)}%` },
    { label: "Playcount", value: fmt(stats?.play_count) },
    { label: "Ranked score", value: fmt(stats?.ranked_score) },
    { label: "Total hits", value: fmt(stats?.total_hits) },
    { label: "Hits per game", value: avgHitsPerPlay.toLocaleString() },
    { label: "Maximum combo", value: fmt(stats?.maximum_combo) },
    { label: "Replays watched", value: fmt(stats?.replays_watched_by_others) },
  ];

  return (
    <div className="h-full">
      {/* Stretch to full height and distribute rows evenly */}
      <ul className="h-full my-0 flex flex-col justify-between gap-1.5 sm:gap-2">
        {rows.map((r) => (
          <li
            key={r.label}
            className="flex items-center justify-between rounded-md px-1 py-0.5 first:pt-0 last:pb-0 transition-colors hover:bg-white/25 dark:hover:bg-white/5"
          >
            <span className={labelClass}>{r.label}</span>
            <span className={valueClass}>{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsCard;
