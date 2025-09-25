import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { beatmapAPI } from '../utils/api';
import type { Beatmapset, Beatmap } from '../types';
import { formatDuration, formatNumber } from '../utils/format';
import { GAME_MODE_NAMES } from '../types';
import { AudioPlayButton, AudioPlayerControls } from '../components/UI/AudioPlayer';
import toast from 'react-hot-toast';

const BeatmapPage: React.FC = () => {
  const { beatmapId, beatmapsetId } = useParams<{ beatmapId?: string; beatmapsetId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [beatmapset, setBeatmapset] = useState<Beatmapset | null>(null);
  const [selectedBeatmap, setSelectedBeatmap] = useState<Beatmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBeatmapData = async () => {
      // 从 URL hash 获取 beatmap ID （用于 beatmapsets 路由）
      const hashMatch = window.location.hash.match(/#[^/]+\/(\d+)/);
      const hashBeatmapId = hashMatch ? parseInt(hashMatch[1], 10) : null;
      
      const targetBeatmapId = beatmapId ? parseInt(beatmapId, 10) : hashBeatmapId;
      const targetBeatmapsetId = beatmapsetId ? parseInt(beatmapsetId, 10) : null;

      if (!targetBeatmapId && !targetBeatmapsetId) {
        setError(t('beatmap.notFound'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let beatmapsetData: Beatmapset;

        if (targetBeatmapsetId) {
          // 使用 beatmapset ID 查询
          beatmapsetData = await beatmapAPI.getBeatmapset(targetBeatmapsetId);
        } else if (targetBeatmapId) {
          // 使用 beatmap ID 查询
          if (isNaN(targetBeatmapId)) {
            throw new Error(t('beatmap.notFound'));
          }
          
          try {
            beatmapsetData = await beatmapAPI.getBeatmapByBeatmapId(targetBeatmapId);
          } catch (error: any) {
            if (error.message === 'Beatmap not found') {
              throw new Error(t('beatmap.notFound'));
            }
            throw error;
          }
        } else {
          throw new Error(t('beatmap.notFound'));
        }

        setBeatmapset(beatmapsetData);
        
        // 找到对应的beatmap
        let targetBeatmap: Beatmap | undefined;
        
        if (targetBeatmapId) {
          targetBeatmap = beatmapsetData.beatmaps.find(
            (beatmap) => beatmap.id === targetBeatmapId
          );
        }
        
        if (targetBeatmap) {
          setSelectedBeatmap(targetBeatmap);
          // 更新 URL 为标准格式
          const mode = targetBeatmap.mode || 'osu';
          const newUrl = `/beatmapsets/${beatmapsetData.id}#${mode}/${targetBeatmap.id}`;
          if (window.location.pathname + window.location.hash !== newUrl) {
            navigate(newUrl, { replace: true });
          }
        } else {
          // 如果没找到，选择第一个
          const firstBeatmap = beatmapsetData.beatmaps[0];
          if (firstBeatmap) {
            setSelectedBeatmap(firstBeatmap);
            const mode = firstBeatmap.mode || 'osu';
            const newUrl = `/beatmapsets/${beatmapsetData.id}#${mode}/${firstBeatmap.id}`;
            navigate(newUrl, { replace: true });
          }
        }

      } catch (error: any) {
        console.error('Failed to fetch beatmap data:', error);
        setError(error.message || t('beatmap.error'));
        toast.error(error.message || t('beatmap.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchBeatmapData();
  }, [beatmapId, beatmapsetId, navigate, t]);

  const handleDifficultySelect = (beatmap: Beatmap) => {
    setSelectedBeatmap(beatmap);
    // 更新URL为标准格式
    if (beatmapset) {
      const mode = beatmap.mode || 'osu';
      navigate(`/beatmapsets/${beatmapset.id}#${mode}/${beatmap.id}`, { replace: true });
    }
  };

  const formatBPM = (bpm: number) => {
    return Number.isInteger(bpm) ? bpm.toString() : bpm.toFixed(1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ranked':
        return 'text-green-600 dark:text-green-400';
      case 'approved':
        return 'text-blue-600 dark:text-blue-400';
      case 'qualified':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'loved':
        return 'text-pink-600 dark:text-pink-400';
      case 'pending':
        return 'text-gray-600 dark:text-gray-400';
      case 'wip':
        return 'text-orange-600 dark:text-orange-400';
      case 'graveyard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (stars: number) => {
    if (stars < 1.5) return 'text-gray-500';
    if (stars < 2.25) return 'text-blue-500';
    if (stars < 3.75) return 'text-green-500';
    if (stars < 5.25) return 'text-yellow-500';
    if (stars < 6.75) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !beatmapset) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || t('beatmap.notFound')}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('beatmap.goBack')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${beatmapset.covers.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="text-white flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(beatmapset.status)} bg-white bg-opacity-20`}>
                {beatmapset.status.toUpperCase()}
              </span>
              {beatmapset.video && (
                <span className="px-2 py-1 bg-red-600 text-white rounded text-sm font-medium">
                  VIDEO
                </span>
              )}
              {beatmapset.storyboard && (
                <span className="px-2 py-1 bg-purple-600 text-white rounded text-sm font-medium">
                  STORYBOARD
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {beatmapset.title_unicode || beatmapset.title}
            </h1>
            <p className="text-xl opacity-90">
              by {beatmapset.artist_unicode || beatmapset.artist}
            </p>
            <p className="text-lg opacity-80 mt-1">
              mapped by {beatmapset.creator}
            </p>
          </div>
          
          {/* Audio Preview Button */}
          {beatmapset.preview_url && (
            <div className="ml-8">
              <AudioPlayButton
                audioUrl={beatmapset.preview_url}
                size="lg"
                showProgress={true}
                className="shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Difficulty Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('beatmap.difficulties')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {beatmapset.beatmaps.map((beatmap) => (
                  <button
                    key={beatmap.id}
                    onClick={() => handleDifficultySelect(beatmap)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedBeatmap?.id === beatmap.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {beatmap.version}
                      </span>
                      <span className={`text-sm font-medium ${getDifficultyColor(beatmap.difficulty_rating)}`}>
                        {beatmap.difficulty_rating.toFixed(2)}★
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="mr-4">
                        <i className="fas fa-circle text-xs mr-1"></i>
                        {formatNumber(beatmap.count_circles)}
                      </span>
                      <span className="mr-4">
                        <i className="fas fa-minus text-xs mr-1"></i>
                        {formatNumber(beatmap.count_sliders)}
                      </span>
                      {beatmap.count_spinners > 0 && (
                        <span>
                          <i className="fas fa-sync text-xs mr-1"></i>
                          {formatNumber(beatmap.count_spinners)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Beatmap Details */}
            {selectedBeatmap && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedBeatmap.version}
                  </h2>
                  <span className={`text-lg font-bold ${getDifficultyColor(selectedBeatmap.difficulty_rating)}`}>
                    {selectedBeatmap.difficulty_rating.toFixed(2)}★
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {formatDuration(selectedBeatmap.total_length)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('beatmap.length')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {formatBPM(selectedBeatmap.bpm)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('beatmap.bpm')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {formatNumber(selectedBeatmap.max_combo)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('beatmap.maxCombo')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {GAME_MODE_NAMES[selectedBeatmap.mode as keyof typeof GAME_MODE_NAMES] || selectedBeatmap.mode}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('beatmap.mode')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedBeatmap.cs}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('beatmap.circleSize')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedBeatmap.ar}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('beatmap.approachRate')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedBeatmap.accuracy}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('beatmap.overallDifficulty')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedBeatmap.drain}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('beatmap.hpDrain')}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Beatmapset Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                {t('beatmap.information')}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('beatmap.creator')}:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {beatmapset.creator}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('beatmap.source')}:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {beatmapset.source || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('beatmap.submitted')}:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {new Date(beatmapset.submitted_date).toLocaleDateString()}
                  </span>
                </div>
                {beatmapset.ranked_date && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">{t('beatmap.ranked')}:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {new Date(beatmapset.ranked_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('beatmap.lastUpdated')}:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {new Date(beatmapset.last_updated).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('beatmap.playCount')}:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {formatNumber(beatmapset.play_count)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('beatmap.favouriteCount')}:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {formatNumber(beatmapset.favourite_count)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {beatmapset.tags && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  {t('beatmap.tags')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {beatmapset.tags.split(' ').filter(tag => tag.trim()).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                {t('beatmap.actions')}
              </h3>
              <div className="space-y-3">
                <a
                  href={`https://catboy.best/beatmapsets/${beatmapset.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <i className="fas fa-download mr-2"></i>
                  {t('beatmap.download')}
                </a>
                {beatmapset.preview_url && (
                  <a
                    href={beatmapset.preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <i className="fas fa-play mr-2"></i>
                    {t('beatmap.preview')}
                  </a>
                )}
                <a
                  href={`https://catboy.best/beatmapsets/${beatmapset.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  {t('beatmap.viewOnOsu')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Audio Player Controls */}
      <AudioPlayerControls />
    </div>
  );
};

export default BeatmapPage;
