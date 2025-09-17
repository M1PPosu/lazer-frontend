import React, { useState } from 'react';
import { FaDownload, FaExclamationTriangle, FaCog, FaGamepad, FaCopy, FaCheck } from 'react-icons/fa';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const HowToJoinPage: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const CopyButton: React.FC<{ text: string; label: string }> = ({ text, label }) => (
    <button
      onClick={() => copyToClipboard(text, label)}
      className="ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      title="点击复制"
    >
      {copiedText === label ? (
        <FaCheck className="w-3 h-3 text-green-500" />
      ) : (
        <FaCopy className="w-3 h-3 text-gray-500" />
      )}
    </button>
  );

  return (
    <PhotoProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              如何加入服务器
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              有两种方式连接到我们的服务器
            </p>
          </div>

        {/* 方法一：自定义客户端 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-osu-pink text-white rounded-full flex items-center justify-center text-lg font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              使用我们的自定义客户端
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-osu-pink/10 text-osu-pink dark:bg-osu-pink/20 dark:text-pink-300">
                推荐
              </span>
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              此方法推荐给所有能在其平台上运行 osu!lazer 的用户。
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FaGamepad className="text-osu-pink" />
              操作步骤：
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-osu-pink/10 dark:bg-osu-pink/20 text-osu-pink dark:text-pink-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  1
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <FaDownload className="inline mr-2 text-osu-pink" />
                    下载 g0v0! 自定义客户端
                  </p>
                  
                  {/* PC 版本下载 */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">PC 版本：</p>
                    <a
                      href="https://github.com/GooGuTeam/osu/releases/latest"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg"
                    >
                      <FaDownload className="mr-2" />
                      下载 PC 版 g0v0! 客户端
                    </a>
                  </div>

                  {/* 安卓版本下载 */}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">安卓版本：</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href="https://pan.wo.cn/s/1D1e0H30675"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg"
                      >
                        <FaDownload className="mr-2" />
                        国内网盘下载
                      </a>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg"
                      >
                        <FaDownload className="mr-2" />
                        国外网盘下载
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-osu-pink/10 dark:bg-osu-pink/20 text-osu-pink dark:text-pink-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  2
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    启动游戏，打开 设置 → 在线，在"Custom API Server URL"字段中填入：
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center mb-4">
                    <code className="bg-osu-pink/10 dark:bg-osu-pink/20 text-osu-pink dark:text-pink-300 px-2 py-1 rounded flex-1">
                      lazer-api.g0v0.top
                    </code>
                    <CopyButton text="lazer-api.g0v0.top" label="API URL" />
                  </div>
                  
                  {/* 示例图片 */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">点击图片查看大图：</p>
                    <PhotoView src="/image/join_photos/1.png">
                      <img 
                        src="/image/join_photos/1.png" 
                        alt="设置示例图" 
                        className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ maxHeight: '300px' }}
                      />
                    </PhotoView>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-osu-pink/10 dark:bg-osu-pink/20 text-osu-pink dark:text-pink-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  3
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    重启游戏，开始享受游戏！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 方法二：Authlib Injector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-osu-blue text-white rounded-full flex items-center justify-center text-lg font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              使用 Authlib Injector（适用于 x86_64 平台）
            </h2>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              此方法适用于以下用户：
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
              <li>Windows（x64 或 x86 平台）</li>
              <li>Linux（x64 或 x86 平台）</li>
              <li>非 Apple Silicon 的 Mac（如 2020 年之前的 MacBook）</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FaCog className="text-osu-blue" />
              操作步骤：
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-osu-blue/10 dark:bg-osu-blue/20 text-osu-blue dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  1
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <FaDownload className="inline mr-2 text-osu-blue" />
                    下载 LazerAuthlibInjection
                  </p>
                  <a
                    href="https://github.com/MingxuanGame/LazerAuthlibInjection/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg"
                  >
                    <FaDownload className="mr-2" />
                    下载 LazerAuthlibInjection
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-osu-blue/10 dark:bg-osu-blue/20 text-osu-blue dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  2
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    将其作为规则集安装到 osu!lazer 中
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-osu-blue/10 dark:bg-osu-blue/20 text-osu-blue dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  3
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    启动游戏，进入 设置 → 游戏模式，然后填入以下信息：
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">API URL：</span>
                      <code className="bg-osu-blue/10 dark:bg-osu-blue/20 text-osu-blue dark:text-blue-300 px-2 py-1 rounded ml-2 flex-1">
                        https://lazer-api.g0v0.top
                      </code>
                      <CopyButton text="https://lazer-api.g0v0.top" label="Authlib API URL" />
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Website URL：</span>
                      <code className="bg-osu-blue/10 dark:bg-osu-blue/20 text-osu-blue dark:text-blue-300 px-2 py-1 rounded ml-2 flex-1">
                        https://lazer.g0g0.top
                      </code>
                      <CopyButton text="https://lazer.g0g0.top" label="Website URL" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-osu-blue/10 dark:bg-osu-blue/20 text-osu-blue dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">
                  4
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    出现"API 设置已更改"通知后，重启客户端，开始享受游戏！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Authlib Injector 的警告 */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 text-xl mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                  重要提示
                </h4>
                <p className="text-red-700 dark:text-red-300">
                  如果您使用了此方法的安装补丁，请不要登录并在官方服务器上游戏。否则，您的账户可能会被封禁。请谨慎使用。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部返回按钮 */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.history.back()}
            className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium rounded-lg"
          >
            返回上一页
          </button>
        </div>
        </div>
      </div>
    </PhotoProvider>
  );
};

export default HowToJoinPage;