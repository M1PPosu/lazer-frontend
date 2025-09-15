import React, { useState } from 'react';
import BBCodeEditor from '../components/User/BBCodeEditor';
import UserPageEditor from '../components/User/UserPageEditor';
import UserPageDisplay from '../components/User/UserPageDisplay';
import { useAuth } from '../hooks/useAuth';

const UserPageTestPage: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'editor' | 'display' | 'bbcode'>('display');

  // 如果没有登录用户，显示登录提示
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              个人页面编辑器测试
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              请先登录以测试个人页面编辑功能
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            个人页面编辑器测试
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            测试BBCode编辑器、个人页面编辑器和显示组件的功能
          </p>

          {/* 模式切换 */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('display')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'display'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              显示模式
            </button>
            <button
              onClick={() => setMode('editor')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'editor'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              编辑模式
            </button>
            <button
              onClick={() => setMode('bbcode')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'bbcode'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              BBCode编辑器
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        {mode === 'display' && (
          <div>
            <UserPageDisplay
              user={user}
              onEditClick={() => setMode('editor')}
            />
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                用户页面数据调试
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>HTML内容:</strong> {user.page?.html ? '有内容' : '无内容'}</div>
                <div><strong>原始内容:</strong> {user.page?.raw ? '有内容' : '无内容'}</div>
                <div><strong>HTML长度:</strong> {user.page?.html?.length || 0} 字符</div>
                <div><strong>原始长度:</strong> {user.page?.raw?.length || 0} 字符</div>
              </div>
              {user.page?.raw && (
                <div className="mt-3">
                  <strong>原始内容预览:</strong>
                  <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-32">
                    {user.page.raw}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {mode === 'editor' && (
          <UserPageEditor
            user={user}
            onClose={() => setMode('display')}
            onSaved={(newPage) => {
              // 更新本地用户数据以反映页面更改
              user.page = newPage;
              setMode('display');
              console.log('Page saved successfully!', newPage);
            }}
          />
        )}

        {mode === 'bbcode' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              BBCode编辑器测试
            </h2>
            <BBCodeTestComponent />
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            功能说明
          </h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div><strong>显示模式:</strong> 展示渲染后的用户页面内容，支持查看HTML输出</div>
            <div><strong>编辑模式:</strong> 完整的个人页面编辑器，包含BBCode编辑和实时预览</div>
            <div><strong>BBCode编辑器:</strong> 单独测试BBCode编辑器组件的功能</div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6 mb-3">
            支持的BBCode标签
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><code>[b]粗体[/b]</code> - <strong>粗体文本</strong></div>
            <div><code>[i]斜体[/i]</code> - <em>斜体文本</em></div>
            <div><code>[u]下划线[/u]</code> - <u>下划线文本</u></div>
            <div><code>[s]删除线[/s]</code> - <del>删除线文本</del></div>
            <div><code>[color=red]彩色[/color]</code> - 彩色文本</div>
            <div><code>[size=16]大小[/size]</code> - 指定字体大小</div>
            <div><code>[url=链接]文本[/url]</code> - 链接</div>
            <div><code>[img]图片URL[/img]</code> - 图片</div>
            <div><code>[quote]引用[/quote]</code> - 引用块</div>
            <div><code>[code]代码[/code]</code> - 代码块</div>
            <div><code>[list][*]项目[/list]</code> - 列表</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// BBCode编辑器测试组件
const BBCodeTestComponent: React.FC = () => {
  const [content, setContent] = useState(`[b]欢迎来到我的个人页面！[/b]

[i]这是一个BBCode编辑器的测试[/i]

[color=red]红色文本[/color] 和 [color=blue]蓝色文本[/color]

[size=18]大字体[/size] 和 [size=12]小字体[/size]

[quote]这是一个引用块
你可以在这里放置引用的内容[/quote]

[list]
[*]列表项目 1
[*]列表项目 2
[*]列表项目 3
[/list]

[url=https://osu.ppy.sh]osu! 官网[/url]

[code]
// 这是代码块
function hello() {
  console.log("Hello, world!");
}
[/code]
`);

  return (
    <BBCodeEditor
      value={content}
      onChange={setContent}
      placeholder="在这里测试BBCode编辑器..."
      className="min-h-[500px]"
    />
  );
};

export default UserPageTestPage;