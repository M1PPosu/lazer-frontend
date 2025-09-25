import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { FiBarChart2 } from 'react-icons/fi';

interface RankHistoryData {
  data: number[];
}

interface RankHistoryChartProps {
  rankHistory?: RankHistoryData;
  isUpdatingMode?: boolean;
  selectedModeColor?: string;
  title?: string;
  delay?: number;
  height?: string | number;
  showTitle?: boolean;
  fullBleed?: boolean; // whether to stretch edge-to-edge horizontally
}

const RankHistoryChart: React.FC<RankHistoryChartProps> = ({
  rankHistory,
  isUpdatingMode = false,
//selectedModeColor = '#6f13f0',
  delay = 0.4,
  height = '16rem',
  fullBleed = true,
}) => {
  // Preprocess data: treat 0 as missing, keep chronological order
  const chartData = React.useMemo(() => {
    const src = rankHistory?.data ?? [];
    if (src.length === 0) return [];

    const validData = src
      .map((rank, originalIdx) => ({
        originalIdx,
        rank: rank === 0 ? null : rank,
      }))
      .filter(d => d.rank !== null) as Array<{ originalIdx: number; rank: number }>;

    return validData.map((item, newIdx) => ({
      idx: newIdx,
      rank: item.rank,
    }));
  }, [rankHistory?.data]);

  const total = chartData.length;

  // Add top/bottom padding to Y domain so extreme values aren't clipped
  const yDomain = React.useMemo<[number | 'auto', number | 'auto']>(() => {
    if (chartData.length === 0) return ['auto', 'auto'];
    const values = chartData.map(d => d.rank as number);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const pad = Math.max(1, Math.round((dataMax - dataMin) * 0.05)); // at least 1
    return [dataMin - pad, dataMax + pad];
  }, [chartData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl p-4 outline-none focus:outline-none ring-0 focus:ring-0 bg-transparent"
      style={{ outline: 'none' }}
    >
      <div className={fullBleed ? '-mx-4' : ''} style={{ height }}>
        {isUpdatingMode ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-500 text-center">
              <FiBarChart2 className="mx-auto text-4xl mb-2" />
              <p>Loading data...</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              // Small vertical margins; works together with yDomain padding
              margin={{ top: 12, right: 0, left: 0, bottom: 12 }}
            >
              <defs>
                <linearGradient id="rankLineGrad" x1="0" y1="0" x2="1" y2="0">
                  {/* lavender → pink, like your sample */}
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ed8ea6" />
                </linearGradient>
              </defs>

              <XAxis dataKey="idx" hide />
              {/* Smaller value on top: reverse Y axis; use padded domain */}
              <YAxis
                type="number"
                dataKey="rank"
                hide
                reversed
                domain={yDomain}
                allowDecimals={false}
                // In case of sudden spikes, allow temporary overflow to render
                allowDataOverflow
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
                labelFormatter={(label) => {
                  const idx = Number(label);
                  const daysAgo = total - 1 - idx; // rightmost is latest
                  return daysAgo === 0 ? 'Just now' : `${daysAgo} days ago`;
                }}
                formatter={(value) => [`#${value}`, 'Global Rank']}
              />
              <Line
                type="monotone"
                dataKey="rank"
                stroke="url(#rankLineGrad)"
                strokeWidth={3}
                dot={false}
                activeDot={false}
                connectNulls={false}
                // Rounded line caps look nicer at edges
                strokeLinecap="round"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FiBarChart2 className="mx-auto text-4xl mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400">No rank history yet</p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        *:focus { outline: none; }
        textarea:focus, input:focus { outline: none; }
      `}</style>
    </motion.div>
  );
};

export default RankHistoryChart;
