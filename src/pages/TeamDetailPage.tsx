import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiLoader, FiUsers, FiCalendar, FiAward } from 'react-icons/fi';
import { teamsAPI, handleApiError } from '../utils/api';
import TeamDetailUserCard from '../components/Rankings/TeamDetailUserCard';
import TeamActions from '../components/Teams/TeamActions';
import MemberActions from '../components/Teams/MemberActions';
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
        console.error('Failed to load team details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamDetail();
  }, [teamId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLeader = () => {
    if (!teamDetail) return null;
    return teamDetail.members.find(member => member.id === teamDetail.team.leader_id);
  };

  const getNonLeaderMembers = () => {
    if (!teamDetail) return [];
    return teamDetail.members.filter(member => member.id !== teamDetail.team.leader_id);
  };

  const handleTeamUpdate = () => {
    if (!teamId) return;
    const loadTeamDetail = async () => {
      setIsLoading(true);
      try {
        const response = await teamsAPI.getTeam(parseInt(teamId));
        setTeamDetail(response);
      } catch (error) {
        handleApiError(error);
        console.error('Failed to load team details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeamDetail();
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading team details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!teamDetail) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiUsers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              The team does not exist!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No information on this team was found.
            </p>
            <Link
              to="/teams"
              className="relative inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}
            >
              <FiArrowLeft className="mr-2" />
              Return to the team list
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(237,142,166,0.10)' }}
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { team, members } = teamDetail;
  const leader = getLeader();
  const nonLeaderMembers = getNonLeaderMembers();

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
        {/* Return button */}
        <div className="mb-6">
          <Link
            to="/teams"
            className="relative inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-medium transition-all text-sm sm:text-base text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}
          >
            <FiArrowLeft className="mr-2" />
            Return to the team list
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(237,142,166,0.10)' }}
            />
          </Link>
        </div>

        {/* Team head information */}
        <div
          className="-mx-4 sm:mx-0 sm:rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,.28)] mb-8"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,24,35,.60), rgba(20,24,35,.60)) padding-box, ' +
              'linear-gradient(135deg, rgba(139,92,246,.35), rgba(237,142,166,.35)) border-box',
            border: '1px solid transparent',
            borderRadius: '1rem'
          }}
        >
          {/* Cover image */}
          <div className="relative h-32 sm:h-48 sm:rounded-t-2xl overflow-hidden">
            <img
              src={team.cover_url}
              alt={`${team.name} cover`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Team information */}
          <div className="relative px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Team Flag - 2:1 Proportion (240:120) */}
              <div className="w-32 h-16 sm:w-40 sm:h-20 rounded-xl overflow-hidden border-4 border-white/80 dark:border-gray-800/80 bg-gray-100/70 dark:bg-gray-700/60 flex-shrink-0 -mt-12 sm:-mt-16">
                <img
                  src={team.flag_url}
                  alt={`${team.name} flag`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Team basic information */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {team.name}
                    </h1>
                    {team.short_name !== team.name && (
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        {team.short_name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-200 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>Created in {formatDate(team.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers className="w-4 h-4" />
                        <span>{members.length} Members</span>
                      </div>
                    </div>

                    {/* Team operation button container (keep visible pull-down) */}
                    <div className="relative overflow-visible">
                      <TeamActions
                        team={team}
                        members={members}
                        onTeamUpdate={handleTeamUpdate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Captain information */}
        {leader && (
          <div
            className="sm:rounded-2xl sm:p-6 mb-8 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,.28)]"
            style={{
              background:
                'linear-gradient(180deg, rgba(20,24,35,.60), rgba(20,24,35,.60)) padding-box, ' +
                'linear-gradient(135deg, rgba(139,92,246,.35), rgba(237,142,166,.35)) border-box',
              border: '1px solid transparent',
              borderRadius: '1rem'
            }}
          >
            <div className="flex items-center gap-3 mb-4 px-4 sm:px-0">
              <FiAward className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Team Leader</h2>
            </div>
            <div className="-mx-4 sm:-mx-6 sm:border sm:border-white/10 overflow-hidden rounded-xl">
              <TeamDetailUserCard
                ranking={{
                  user: leader,
                  ranked_score: leader.statistics?.ranked_score,
                  pp: leader.statistics?.pp
                }}
                selectedMode="osu"
                rankingType="performance"
              />
            </div>
          </div>
        )}

        {/* Team Members */}
        {nonLeaderMembers.length > 0 && (
          <div
            className="sm:rounded-2xl sm:p-6 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,.28)]"
            style={{
              background:
                'linear-gradient(180deg, rgba(20,24,35,.60), rgba(20,24,35,.60)) padding-box, ' +
                'linear-gradient(135deg, rgba(139,92,246,.35), rgba(237,142,166,.35)) border-box',
              border: '1px solid transparent',
              borderRadius: '1rem'
            }}
          >
            <div className="flex items-center gap-3 mb-6 px-4 sm:px-0">
              <FiUsers className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Team Members</h2>
              <span className="text-sm text-gray-200">
                ({nonLeaderMembers.length} people)
              </span>
            </div>

            <div className="-mx-4 sm:-mx-6 sm:divide-y divide-white/10 sm:border sm:border-white/10 overflow-hidden rounded-xl">
              {nonLeaderMembers.map((member: User) => (
                <div key={member.id} className="relative">
                  <TeamDetailUserCard
                    ranking={{
                      user: member,
                      ranked_score: member.statistics?.ranked_score,
                      pp: member.statistics?.pp
                    }}
                    selectedMode="osu"
                    rankingType="performance"
                  />

                  {/* Member action button (pull down is not clipped) */}
                  <div className="absolute top-4 right-4 sm:right-6">
                    <MemberActions
                      member={member}
                      team={team}
                      onMemberRemoved={handleTeamUpdate}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetailPage;