import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage, FiFlag, FiUsers, FiLoader } from 'react-icons/fi';
import { teamsAPI, handleApiError } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import ImageUploadWithCrop from '../components/UI/ImageUploadWithCrop';
import toast from 'react-hot-toast';
import type { User, TeamDetailResponse } from '../types';

/** Glass card style (same look as Rankings/Teams containers) */
const glassCardProps = {
  className:
    'rounded-xl p-6 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,.25)] border border-transparent',
  style: {
    background:
      'linear-gradient(180deg, rgba(20,24,35,.60), rgba(20,24,35,.60)) padding-box, ' +
      'linear-gradient(135deg, rgba(139,92,246,.35), rgba(237,142,166,.35)) border-box',
  } as React.CSSProperties,
};

/** Themed select (drop-down) like Rankings */
const ThemedSelect: React.FC<{
  value: number | null;
  onChange: (v: number | null) => void;
  options: Array<{ value: number; label: string }>;
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const label =
    (value != null ? options.find(o => o.value === value)?.label : undefined) ??
    placeholder;

  return (
    <div ref={ref} className="relative">
      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full justify-between inline-flex items-center gap-2 px-4 py-3 rounded-xl min-h-[48px]
                   font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,.25)]"
        style={{
          background:
            'linear-gradient(to bottom right, rgba(28,32,40,.60), rgba(28,32,40,.60)) padding-box, ' +
            'linear-gradient(135deg, rgba(139,92,246,.45), rgba(237,142,166,.45)) border-box',
          border: '1px solid transparent',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{label}</span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* menu */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 z-50 w-full rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl border border-transparent"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,24,35,.85), rgba(20,24,35,.85)) padding-box, ' +
              'linear-gradient(135deg, rgba(139,92,246,.45), rgba(237,142,166,.45)) border-box',
          }}
          role="listbox"
        >
          <button
            className={`w-full text-left px-4 py-2.5 text-sm sm:text-base font-medium transition-colors text-gray-200 hover:bg-white/10`}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            role="option"
            aria-selected={value === null}
          >
            {placeholder}
          </button>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={value === opt.value}
              className={`w-full text-left px-4 py-2.5 text-sm sm:text-base font-medium transition-colors ${
                value === opt.value ? 'text-white bg-white/10' : 'text-gray-200 hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const isEditing = Boolean(teamId);

  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    leader_id: null as number | null,
  });
  const [flagFile, setFlagFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [flagPreview, setFlagPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamDetail, setTeamDetail] = useState<TeamDetailResponse | null>(null);
  const [members, setMembers] = useState<User[]>([]);

  // Loading team data (edit mode)
  useEffect(() => {
    if (!isEditing || !teamId) return;

    const loadTeamData = async () => {
      setIsLoading(true);
      try {
        const response = await teamsAPI.getTeam(parseInt(teamId));
        const { team, members: teamMembers } = response;
        setTeamDetail(response);
        setMembers(teamMembers);
        setFormData({
          name: team.name,
          short_name: team.short_name,
          leader_id: team.leader_id,
        });
        setFlagPreview(team.flag_url);
        setCoverPreview(team.cover_url);
      } catch (error) {
        handleApiError(error);
        navigate('/teams');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, [isEditing, teamId, navigate]);

  // Process form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle captain selection
  const handleLeaderChange = (leaderId: number | null) => {
    setFormData(prev => ({ ...prev, leader_id: leaderId }));
  };

  // Processing banner file selection
  const handleFlagSelect = (file: File) => {
    setFlagFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setFlagPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Process cover file selection
  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Submit a form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter the team name.');
      return;
    }
    if (!formData.short_name.trim()) {
      toast.error('Please enter the team short name.');
      return;
    }
    if (!isEditing && (!flagFile || !coverFile)) {
      toast.error('Please upload the team flag and cover.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();

      if (isEditing) {
        if (formData.name.trim() !== teamDetail?.team.name) {
          data.append('name', formData.name.trim());
        }
        if (formData.short_name.trim() !== teamDetail?.team.short_name) {
          data.append('short_name', formData.short_name.trim());
        }
        if (formData.leader_id !== null && formData.leader_id !== teamDetail?.team.leader_id) {
          data.append('leader_id', formData.leader_id.toString());
        }
      } else {
        data.append('name', formData.name.trim());
        data.append('short_name', formData.short_name.trim());
      }

      if (flagFile) data.append('flag', flagFile);
      if (coverFile) data.append('cover', coverFile);

      if (isEditing) {
        await teamsAPI.updateTeam(parseInt(teamId!), data);
        toast.success('Team information updated successfully!');
        navigate(`/teams/${teamId}`);
      } else {
        const result = await teamsAPI.createTeam(data);
        toast.success('Team created successfully!');
        navigate(`/teams/${result.id}`);
      }
    } catch (error) {
      handleApiError(error);
      console.error('Operation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaderOptions = useMemo(
  () =>
    members
      .filter(m => m.id !== teamDetail?.team.leader_id)
      .map(m => ({ value: m.id, label: m.username })),
  [members, teamDetail]
);

if (!user) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Please log in first</h3>
        <p className="text-gray-500 dark:text-gray-400">You need to log in to create or edit a team.</p>
      </div>
    </div>
  );
}

if (isEditing && isLoading) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading team information...</p>
      </div>
    </div>
  );
}

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Same bg as rankings */}
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
          filter: 'saturate(1.04)',
        }}
      />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Return button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-white transition-colors
                       px-3 py-2 rounded-xl"
            style={{
              background:
                'linear-gradient(to bottom right, rgba(28,32,40,.40), rgba(28,32,40,.40)) padding-box, ' +
                'linear-gradient(135deg, rgba(139,92,246,.35), rgba(237,142,166,.35)) border-box',
              border: '1px solid transparent',
            }}
          >
            <FiArrowLeft />
            return
          </button>
        </div>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isEditing ? 'Editorial Team' : 'Create a team'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {isEditing ? 'Modify your team information' : 'Create a new team and invite friends to play together'}
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic information */}
            <div {...glassCardProps}>
              <h2 className="text-xl font-bold text-white mb-6">Basic information</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    Team name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50
                               border border-transparent ring-1 ring-white/10 focus:ring-2 focus:ring-osu-pink/60"
                    placeholder="enterTeam name"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label htmlFor="short_name" className="block text-sm font-medium text-gray-200 mb-2">
                    Team shortcut *
                  </label>
                  <input
                    type="text"
                    id="short_name"
                    name="short_name"
                    value={formData.short_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/50
                               border border-transparent ring-1 ring-white/10 focus:ring-2 focus:ring-osu-pink/60"
                    placeholder="enterTeam abbreviation"
                    maxLength={10}
                  />
                  <p className="mt-1 text-sm text-gray-300">
                    The short name will be displayed in the leaderboard, it is recommended to use it 2-5 Characters.
                  </p>
                </div>
              </div>
            </div>

            {/* Flag upload */}
            <div {...glassCardProps}>
              <h2 className="text-xl font-bold text-white mb-6">Team Flag</h2>
              <ImageUploadWithCrop
                onImageSelect={handleFlagSelect}
                preview={flagPreview}
                aspectRatio={2}
                maxWidth={240}
                maxHeight={120}
                maxFileSize={2}
                placeholder="Select a banner"
                description="Standard size: 240×120px,maximum 2MB, support crop adjustment"
                icon={<FiFlag className="mr-2" />}
                acceptedTypes={['image/png', 'image/jpeg', 'image/gif', 'image/webp']}
                isUploading={isSubmitting}
                uploadingText={isEditing ? 'Saving...' : 'Create a teammiddle...'}
              />
            </div>

            {/* Cover upload */}
            <div {...glassCardProps}>
              <h2 className="text-xl font-bold text-white mb-6">Team cover</h2>
              <ImageUploadWithCrop
                onImageSelect={handleCoverSelect}
                preview={coverPreview}
                aspectRatio={1.5}
                maxWidth={1920}
                maxHeight={1280}
                maxFileSize={10}
                placeholder="Select a cover"
                description="Recommended size: 1920×1280px,maximum 10MB, support crop adjustment"
                icon={<FiImage className="mr-2" />}
                acceptedTypes={['image/png', 'image/jpeg', 'image/gif', 'image/webp']}
                isUploading={isSubmitting}
                uploadingText={isEditing ? 'Saving...' : 'Create a teammiddle...'}
              />
            </div>

            {/* Team member management - Shown in edit mode only */}
            {isEditing && members.length > 0 && (
              <div {...glassCardProps}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiUsers />
                  Team member management
                </h2>

                {/* Captain transfer (themed dropdown) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Captain transfer (Optional)
                  </label>
                  <ThemedSelect
                    value={
                      formData.leader_id === teamDetail?.team.leader_id
                        ? null
                        : formData.leader_id
                    }
                    onChange={handleLeaderChange}
                    options={leaderOptions}
                    placeholder="Keep the current captain"
                  />
                  <p className="mt-2 text-sm text-gray-300">
                    Select a new captain, if notKeep the current captain constant. After transferring the captain's permissions, you will lose the administrative permissions.
                  </p>
                </div>

                {/* Team member list */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Current team member ({members.length} people)
                  </h3>
                  <div className="space-y-3">
                    {members.map(member => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-transparent"
                        style={{
                          background:
                            'linear-gradient(to bottom right, rgba(28,32,40,.50), rgba(28,32,40,.50)) padding-box, ' +
                            'linear-gradient(135deg, rgba(139,92,246,.35), rgba(237,142,166,.35)) border-box',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar_url}
                            alt={member.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-white">{member.username}</p>
                            {member.id === teamDetail?.team.leader_id && (
                              <p className="text-xs text-yellow-300">Current Captain</p>
                            )}
                            {member.id === formData.leader_id &&
                              formData.leader_id !== teamDetail?.team.leader_id && (
                                <p className="text-xs text-green-300">Will become the new captain</p>
                              )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300">
                            {member.country?.name || 'unknown'}
                          </span>
                          {member.country?.code && (
                            <img
                              src={`/public/image/flag/${member.country.code.toLowerCase()}.svg`}
                              alt={member.country.name}
                              className="w-5 h-3"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl text-white shadow-[0_10px_30px_rgba(0,0,0,.25)]"
                style={{
                  background:
                    'linear-gradient(to bottom right, rgba(28,32,40,.45), rgba(28,32,40,.45)) padding-box, ' +
                    'linear-gradient(135deg, rgba(139,92,246,.35), rgba(237,142,166,.35)) border-box',
                  border: '1px solid transparent',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(0,0,0,.25)]"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                }}
              >
                <FiSave className="mr-2" />
                {isSubmitting ? 'Saving...' : (isEditing ? 'Save Modify' : 'Create a team')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamPage;