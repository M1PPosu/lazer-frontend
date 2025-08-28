import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage, FiFlag, FiUsers, FiLoader } from 'react-icons/fi';
import { teamsAPI, handleApiError } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import ImageUploadWithCrop from '../components/UI/ImageUploadWithCrop';
import toast from 'react-hot-toast';
import type { User, TeamDetailResponse } from '../types';

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

  // 加载团队数据（编辑模式）
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



  // 处理表单输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理队长选择
  const handleLeaderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leaderId = e.target.value ? parseInt(e.target.value) : null;
    setFormData(prev => ({ ...prev, leader_id: leaderId }));
  };

  // 处理旗帜文件选择
  const handleFlagSelect = (file: File) => {
    setFlagFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setFlagPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // 处理封面文件选择
  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('请输入战队名称');
      return;
    }

    if (!formData.short_name.trim()) {
      toast.error('请输入战队简称');
      return;
    }

    if (!isEditing && (!flagFile || !coverFile)) {
      toast.error('请上传战队旗帜和封面');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      if (isEditing) {
        // 编辑模式：只有当名称或简称发生变化时才添加到FormData
        if (formData.name.trim() !== teamDetail?.team.name) {
          data.append('name', formData.name.trim());
        }
        if (formData.short_name.trim() !== teamDetail?.team.short_name) {
          data.append('short_name', formData.short_name.trim());
        }
        
        // 只有在选择了新队长时才添加leader_id
        if (formData.leader_id !== null && formData.leader_id !== teamDetail?.team.leader_id) {
          data.append('leader_id', formData.leader_id.toString());
        }
      } else {
        // 创建模式：始终添加名称和简称
        data.append('name', formData.name.trim());
        data.append('short_name', formData.short_name.trim());
      }
      
      if (flagFile) {
        data.append('flag', flagFile);
      }
      
      if (coverFile) {
        data.append('cover', coverFile);
      }

      if (isEditing) {
        await teamsAPI.updateTeam(parseInt(teamId!), data);
        toast.success('战队信息更新成功');
      } else {
        const result = await teamsAPI.createTeam(data);
        toast.success('战队创建成功');
        navigate(`/teams/${result.id}`);
        return;
      }
      
      navigate(`/teams/${teamId}`);
    } catch (error) {
      handleApiError(error);
      console.error('操作失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            请先登录
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            您需要登录后才能创建或编辑战队
          </p>
        </div>
      </div>
    );
  }

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">加载战队信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            返回
          </button>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isEditing ? '编辑战队' : '创建战队'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {isEditing ? '修改您的战队信息' : '创建一个新的战队，邀请朋友一起游戏'}
          </p>
        </div>

        {/* 表单 */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">基本信息</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    战队名称 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-osu-pink focus:border-transparent"
                    placeholder="输入战队名称"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label htmlFor="short_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    战队简称 *
                  </label>
                  <input
                    type="text"
                    id="short_name"
                    name="short_name"
                    value={formData.short_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-osu-pink focus:border-transparent"
                    placeholder="输入战队简称"
                    maxLength={10}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    简称将显示在排行榜中，建议使用 2-5 个字符
                  </p>
                </div>
              </div>
            </div>

            {/* 旗帜上传 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">战队旗帜</h2>
              
              <ImageUploadWithCrop
                onImageSelect={handleFlagSelect}
                preview={flagPreview}
                aspectRatio={2} // 2:1 比例 (240:120)
                maxWidth={240}
                maxHeight={120}
                maxFileSize={2}
                placeholder="选择旗帜"
                description="标准尺寸: 240×120px，最大 2MB，支持裁剪调整"
                icon={<FiFlag className="mr-2" />}
                acceptedTypes={['image/png', 'image/jpeg', 'image/gif', 'image/webp']}
                isUploading={isSubmitting}
                uploadingText="创建战队中..."
              />
            </div>

            {/* 封面上传 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">战队封面</h2>
              
              <ImageUploadWithCrop
                onImageSelect={handleCoverSelect}
                preview={coverPreview}
                aspectRatio={1.5} // 3:2 比例
                maxWidth={1920}
                maxHeight={1280}
                maxFileSize={10}
                placeholder="选择封面"
                description="推荐尺寸: 1920×1280px，最大 10MB，支持裁剪调整"
                icon={<FiImage className="mr-2" />}
                acceptedTypes={['image/png', 'image/jpeg', 'image/gif', 'image/webp']}
                isUploading={isSubmitting}
                uploadingText="创建战队中..."
              />
            </div>

            {/* 队员管理 - 仅在编辑模式下显示 */}
            {isEditing && members.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FiUsers className="mr-3" />
                  队员管理
                </h2>
                
                {/* 队长转让选择 */}
                <div className="mb-6">
                  <label htmlFor="leader_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    队长转让 (可选)
                  </label>
                  <select
                    id="leader_id"
                    value={formData.leader_id || ''}
                    onChange={handleLeaderChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-osu-pink focus:border-transparent"
                  >
                    <option value="">保持当前队长</option>
                    {members
                      .filter(member => member.id !== teamDetail?.team.leader_id)
                      .map(member => (
                        <option key={member.id} value={member.id}>
                          {member.username}
                        </option>
                      ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    选择一个新的队长，如果不选择则保持当前队长不变。转让队长权限后，您将失去管理权限。
                  </p>
                </div>

                {/* 队员列表 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    当前队员 ({members.length} 人)
                  </h3>
                  <div className="space-y-3">
                    {members.map(member => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar_url}
                            alt={member.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {member.username}
                            </p>
                            {member.id === teamDetail?.team.leader_id && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                当前队长
                              </p>
                            )}
                            {member.id === formData.leader_id && formData.leader_id !== teamDetail?.team.leader_id && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                将成为新队长
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {member.country?.name || '未知'}
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

            {/* 提交按钮 */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 bg-osu-pink text-white rounded-lg hover:bg-osu-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiSave className="mr-2" />
                {isSubmitting ? '保存中...' : (isEditing ? '保存修改' : '创建战队')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamPage;
