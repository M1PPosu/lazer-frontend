import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { FiBarChart2 } from 'react-icons/fi'; // 引入图标

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
  fullBleed?: boolean; // 是否左右顶满
}

const RankHistoryChart: React.FC<RankHistoryChartProps> = ({
  rankHistory,
  isUpdatingMode = false,
  selectedModeColor = '#e91e63',
  delay = 0.4,
  height = '16rem',
  fullBleed = true,
}) => {
  // 数据本身就是按时间顺序排列（最后一个是最新），不需要反转
  const chartData = React.useMemo(() => {
    const src = rankHistory?.data ?? [];
    if (src.length === 0) return [];
        
    // 先过滤掉无效数据，然后重新分配索引
    const validData = src
      .map((rank, originalIdx) => ({
        originalIdx,
        rank: rank === 0 ? null : rank, // 0 当作缺失
      }))
      .filter(d => d.rank !== null);
    
    // 重新分配连续的索引
    return validData.map((item, newIdx) => ({
      idx: newIdx, // 连续的索引，从0开始
      rank: item.rank,
    }));
  }, [rankHistory?.data]);

  const total = chartData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/95 dark:bg-gray-900/85 rounded-2xl p-6 outline-none focus:outline-none ring-0 focus:ring-0"
      style={{ outline: 'none' }}
    >
      <div className={fullBleed ? '-mx-6' : ''} style={{ height }}>
        {isUpdatingMode ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-500 text-center">
              <FiBarChart2 className="mx-auto text-4xl mb-2" />
              <p>数据加载中...</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }} // 左右贴边
            >
              <XAxis dataKey="idx" hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
                labelFormatter={(label) => {
                  const idx = Number(label);
                  // 计算天数：最右边(最大idx)为最新数据(刚刚)
                  const daysAgo = total - 1 - idx;
                  return daysAgo === 0 ? '刚刚' : `${daysAgo} 天前`;
                }}
                formatter={(value) => [`#${value}`, '全球排名']}
              />
              <Line
                type="monotone"
                dataKey="rank"
                stroke={selectedModeColor}
                strokeWidth={3}
                dot={false}
                activeDot={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FiBarChart2 className="mx-auto text-4xl mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400">暂无排名历史数据</p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        *:focus {
            outline: none;
        }
        textarea:focus, input:focus{
            outline: none;
        }
      `}</style>
    </motion.div>
  );
};

export default RankHistoryChart;