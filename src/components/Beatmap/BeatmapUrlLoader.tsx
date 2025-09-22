import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { beatmapAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { ExternalLink, Search } from 'lucide-react';

interface BeatmapUrlLoaderProps {
  onLoad?: (data: { beatmapset: any; beatmap?: any }) => void;
  className?: string;
}

const BeatmapUrlLoader: React.FC<BeatmapUrlLoaderProps> = ({ onLoad, className = '' }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      // 首先尝试使用内部路由转换
      const internalUrl = beatmapAPI.convertToInternalBeatmapUrl(url);
      
      if (internalUrl) {
        // 如果可以转换为内部路由，直接导航
        navigate(internalUrl);
      } else {
        // 否则尝试直接从 URL 获取数据
        const data = await beatmapAPI.getBeatmapFromUrl(url);
        
        if (onLoad) {
          onLoad(data);
        } else {
          // 导航到 beatmap 页面
          const targetUrl = data.beatmap 
            ? `/beatmapsets/${data.beatmapset.id}#${data.beatmap.mode || 'osu'}/${data.beatmap.id}`
            : `/beatmapsets/${data.beatmapset.id}`;
          navigate(targetUrl);
        }
      }
      
      toast.success(t('beatmap.urlLoadSuccess'));
      setUrl('');
    } catch (error) {
      console.error('Failed to load beatmap from URL:', error);
      toast.error(t('beatmap.urlLoadError'));
    } finally {
      setLoading(false);
    }
  };

  const isValidOsuUrl = (url: string) => {
    return url.includes('osu.ppy.sh') && (url.includes('/beatmaps/') || url.includes('/beatmapsets/'));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <ExternalLink size={20} />
        {t('beatmap.loadFromUrl')}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="beatmap-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('beatmap.urlPlaceholder')}
          </label>
          <div className="relative">
            <input
              id="beatmap-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://osu.ppy.sh/beatmapsets/123456#osu/789012"
              className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            {isValidOsuUrl(url) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!url.trim() || loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                    text-white font-medium rounded-lg transition-colors
                    flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t('beatmap.loading')}
            </>
          ) : (
            <>
              <Search size={16} />
              {t('beatmap.loadBeatmap')}
            </>
          )}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">{t('beatmap.supportedUrls')}:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>https://osu.ppy.sh/beatmapsets/123456</li>
          <li>https://osu.ppy.sh/beatmapsets/123456#osu/789012</li>
          <li>https://osu.ppy.sh/beatmaps/789012</li>
        </ul>
      </div>
    </div>
  );
};

export default BeatmapUrlLoader;
