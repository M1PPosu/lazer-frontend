import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiLoader, FiUsers, FiCalendar, FiAward, FiExternalLink } from 'react-icons/fi';
import { teamsAPI, handleApiError } from '../utils/api';
import UserRankingCard from '../components/Rankings/UserRankingCard';
import type { TeamDetailResponse, User } from '../types';

const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [teamDetail, setTeamDetail] = useState<TeamDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;

    const loadTeamDetail = async () => {
      setIsLoading(true);
      try {
        const response = await teamsAPI.getTeam(parseInt(teamId));
        setTeamDetail(response);
      } catch (error) {
        handleApiError(error);
        console.error('加载战队详情失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamDetail();
  }, [teamId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLeader = () => {
    if (!teamDetail) return null;
    return teamDetail.members.find(member => member.id === teamDetail.team.leader_id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">加载战队详情中...</p>
        </div>
      </div>
    );
  }

  if (!teamDetail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiUsers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            战队不存在
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            未找到该战队信息
          </p>
          <Link
            to="/teams"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            返回战队列表
          </Link>
        </div>
      </div>
    );
  }

  const { team, members } = teamDetail;
  const leader = getLeader();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/teams"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            返回战队列表
          </Link>
        </div>

        {/* 战队头部信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          {/* 封面图片 */}
          <div className="relative h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={team.cover_url}
              alt={`${team.name} cover`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
          </div>

          {/* 战队信息 */}
          <div className="relative px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* 战队旗帜 */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex-shrink-0 -mt-12 sm:-mt-16">
                <img
                  src={team.flag_url}
                  alt={`${team.name} flag`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* 战队基本信息 */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {team.name}
                    </h1>
                    {team.short_name !== team.name && (
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {team.short_name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>创建于 {formatDate(team.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUsers className="w-4 h-4" />
                      <span>{members.length} 名成员</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 队长信息 */}
        {leader && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FiAward className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">队长</h2>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <UserRankingCard
                ranking={{
                  user: leader,
                  ranked_score: leader.statistics?.ranked_score,
                  pp: leader.statistics?.pp
                }}
                rank={0}
                selectedMode="osu"
                rankingType="performance"
              />
            </div>
          </div>
        )}

        {/* 团队成员 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FiUsers className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">团队成员</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({members.length} 人)
            </span>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {members.map((member: User, index: number) => (
              <div key={member.id} className="relative">
                <UserRankingCard
                  ranking={{
                    user: member,
                    ranked_score: member.statistics?.ranked_score,
                    pp: member.statistics?.pp
                  }}
                  rank={index + 1}
                  selectedMode="osu"
                  rankingType="performance"
                />
                {member.id === team.leader_id && (
                  <div className="absolute top-4 right-4 sm:right-6">
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md text-xs font-medium">
                      <FiAward className="w-3 h-3" />
                      队长
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
