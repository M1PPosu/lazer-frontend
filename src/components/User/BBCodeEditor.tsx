import React, { useState, useCallback, useRef, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import type { BBCodeValidationResponse } from '../../types';
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaImage, FaLink, 
  FaQuoteLeft, FaCode, FaList, FaEye, FaEyeSlash, FaYoutube,
  FaEnvelope, FaUser, FaMusic, FaExclamationTriangle, FaMapMarked,
  FaPalette, FaFont, FaHeading, FaAlignCenter, FaMask, FaBox, FaQuestionCircle
} from 'react-icons/fa';
import LoadingSpinner from '../UI/LoadingSpinner';
import { parseBBCode } from '../../utils/bbcodeParser';
import BBCodeRenderer from '../BBCode/BBCodeRenderer';
import BBCodeHelpModal from './BBCodeHelpModal';

interface BBCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  disabled?: boolean;
}

interface BBCodeTool {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  action: () => void;
  shortcut?: string;
}

const BBCodeEditor: React.FC<BBCodeEditorProps> = ({
  value,
  onChange,
  placeholder = '在这里输入BBCode内容...',
  className = '',
  maxLength = 60000,
  disabled = false,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<BBCodeValidationResponse | null>(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // 防抖验证函数
  const debouncedValidation = useCallback(async (content: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (content.trim()) {
        try {
          setValidationLoading(true);
          setValidationError(null);
          
          // 先使用本地解析器进行基础验证
          const localResult = parseBBCode(content);
          
          // 尝试服务器验证（如果可用）
          try {
            const result = await userAPI.validateBBCode(content);
            setValidationResult(result);
          } catch (error) {
            // 如果服务器验证失败，使用本地解析结果
            console.warn('Server validation failed, using local parser:', error);
            setValidationResult({
              valid: localResult.valid,
              errors: localResult.errors,
              preview: {
                html: localResult.html,
                raw: content
              }
            });
          }
        } catch (error) {
          console.error('BBCode validation error:', error);
          setValidationError('验证失败，请检查网络连接');
          setValidationResult(null);
        } finally {
          setValidationLoading(false);
        }
      } else {
        setValidationResult(null);
        setValidationLoading(false);
      }
    }, 500);
  }, []);

  // 当内容变化时触发验证
  useEffect(() => {
    debouncedValidation(value);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [value, debouncedValidation]);

  // 插入BBCode标签的辅助函数
  const insertBBCode = useCallback((openTag: string, closeTag: string, defaultContent: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 保存当前焦点状态
    const wasActive = document.activeElement === textarea;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const contentToWrap = selectedText || defaultContent;
    
    const newText = value.substring(0, start) + 
                   openTag + contentToWrap + closeTag + 
                   value.substring(end);
    
    onChange(newText);

    // 使用requestAnimationFrame确保DOM更新后再设置光标位置
    requestAnimationFrame(() => {
      if (textarea && wasActive) {
        try {
          textarea.focus();
          if (selectedText) {
            textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
          } else {
            textarea.setSelectionRange(start + openTag.length, start + openTag.length + defaultContent.length);
          }
        } catch (error) {
          // 忽略可能的焦点设置错误
          console.debug('Focus restoration failed:', error);
        }
      }
    });
  }, [value, onChange]);

  // BBCode工具栏配置
  const tools: BBCodeTool[] = [
    // 基础格式化
    {
      icon: FaBold,
      tooltip: '粗体 (Ctrl+B)',
      shortcut: 'ctrl+b',
      action: () => insertBBCode('[b]', '[/b]', '粗体文本'),
    },
    {
      icon: FaItalic,
      tooltip: '斜体 (Ctrl+I)',
      shortcut: 'ctrl+i',
      action: () => insertBBCode('[i]', '[/i]', '斜体文本'),
    },
    {
      icon: FaUnderline,
      tooltip: '下划线 (Ctrl+U)',
      shortcut: 'ctrl+u',
      action: () => insertBBCode('[u]', '[/u]', '下划线文本'),
    },
    {
      icon: FaStrikethrough,
      tooltip: '删除线',
      action: () => insertBBCode('[strike]', '[/strike]', '删除线文本'),
    },
    {
      icon: FaPalette,
      tooltip: '颜色',
      action: () => insertBBCode('[color=red]', '[/color]', '彩色文本'),
    },
    {
      icon: FaFont,
      tooltip: '字体大小',
      action: () => insertBBCode('[size=100]', '[/size]', '文本'),
    },
    
    // 内容插入
    {
      icon: FaImage,
      tooltip: '插入图片',
      action: () => insertBBCode('[img]', '[/img]', 'https://example.com/image.jpg'),
    },
    {
      icon: FaLink,
      tooltip: '插入链接',
      action: () => insertBBCode('[url=', ']链接文本[/url]', 'https://example.com'),
    },
    {
      icon: FaUser,
      tooltip: '用户主页链接',
      action: () => insertBBCode('[profile=', ']用户名[/profile]', '123456'),
    },
    {
      icon: FaEnvelope,
      tooltip: '邮箱链接',
      action: () => insertBBCode('[email=', ']邮箱链接[/email]', 'example@example.com'),
    },
    {
      icon: FaYoutube,
      tooltip: 'YouTube视频',
      action: () => insertBBCode('[youtube]', '[/youtube]', 'dQw4w9WgXcQ'),
    },
    {
      icon: FaMusic,
      tooltip: '音频',
      action: () => insertBBCode('[audio]', '[/audio]', 'https://example.com/audio.mp3'),
    },
    {
      icon: FaMapMarked,
      tooltip: '图片映射',
      action: () => insertBBCode('[imagemap]\n', '\n10.0 10.0 30.0 20.0 https://example.com 点击访问网站\n50.0 30.0 40.0 25.0 # 这是信息区域\n[/imagemap]', 'https://example.com/image.jpg'),
    },
    
    // 结构化内容
    {
      icon: FaQuoteLeft,
      tooltip: '引用',
      action: () => insertBBCode('[quote]', '[/quote]', '引用内容'),
    },
    {
      icon: FaCode,
      tooltip: '代码块',
      action: () => insertBBCode('[code]', '[/code]', '代码内容'),
    },
    {
      icon: FaList,
      tooltip: '列表',
      action: () => insertBBCode('[list]\n[*]', '\n[*]项目2\n[/list]', '项目1'),
    },
    {
      icon: FaBox,
      tooltip: '折叠框',
      action: () => insertBBCode('[box=标题]', '[/box]', '折叠内容'),
    },
    {
      icon: FaMask,
      tooltip: '剧透条',
      action: () => insertBBCode('[spoiler]', '[/spoiler]', '剧透内容'),
    },
    {
      icon: FaAlignCenter,
      tooltip: '居中对齐',
      action: () => insertBBCode('[centre]', '[/centre]', '居中文本'),
    },
    {
      icon: FaHeading,
      tooltip: '标题',
      action: () => insertBBCode('[heading]', '[/heading]', '标题文本'),
    },
    {
      icon: FaExclamationTriangle,
      tooltip: '通知框',
      action: () => insertBBCode('[notice]', '[/notice]', '重要通知'),
    },
  ];

  // 工具栏按钮点击处理
  const handleToolClick = useCallback((e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  }, []);

  // 键盘快捷键处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const tool = tools.find(t => t.shortcut === `ctrl+${e.key.toLowerCase()}`);
      if (tool) {
        e.preventDefault();
        tool.action();
      }
    }
  }, [tools]);

  // 颜色选择器
  const insertColor = useCallback((color: string) => {
    insertBBCode(`[color=${color}]`, '[/color]', '彩色文本');
  }, [insertBBCode]);

  // 字体大小选择器
  const insertSize = useCallback((size: number) => {
    insertBBCode(`[size=${size}]`, '[/size]', `${size}px文本`);
  }, [insertBBCode]);

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-1 flex-wrap">
          {/* 基础格式化工具 */}
          <div className="flex items-center gap-1">
            {tools.slice(0, 6).map((tool, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => handleToolClick(e, tool.action)}
                disabled={disabled}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={tool.tooltip}
              >
                <tool.icon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
              </button>
            ))}
          </div>
          
          {/* 分隔线 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* 内容插入工具 */}
          <div className="flex items-center gap-1">
            {tools.slice(6, 13).map((tool, index) => (
              <button
                key={index + 6}
                type="button"
                onClick={(e) => handleToolClick(e, tool.action)}
                disabled={disabled}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={tool.tooltip}
              >
                <tool.icon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
              </button>
            ))}
          </div>
          
          {/* 分隔线 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* 结构化内容工具 */}
          <div className="flex items-center gap-1">
            {tools.slice(13).map((tool, index) => (
              <button
                key={index + 13}
                type="button"
                onClick={(e) => handleToolClick(e, tool.action)}
                disabled={disabled}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={tool.tooltip}
              >
                <tool.icon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
              </button>
            ))}
          </div>
          
          {/* 分隔线 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* 快速颜色选择 */}
          <div className="flex items-center gap-1">
            {['red', 'blue', 'green', 'purple', 'orange'].map(color => (
              <button
                key={color}
                type="button"
                onClick={(e) => handleToolClick(e, () => insertColor(color))}
                disabled={disabled}
                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform disabled:cursor-not-allowed"
                style={{ backgroundColor: color }}
                title={`${color}色文本`}
              />
            ))}
          </div>
          
          {/* 分隔线 */}
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          {/* 字体大小 */}
          <select
            onChange={(e) => e.target.value && insertSize(parseInt(e.target.value))}
            disabled={disabled}
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
            defaultValue=""
          >
            <option value="" disabled>字体大小</option>
            <option value="50">极小 (50)</option>
            <option value="85">小 (85)</option>
            <option value="100">普通 (100)</option>
            <option value="150">大 (150)</option>
          </select>
        </div>

        {/* 预览切换和字数统计 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value.length}/{maxLength}
          </span>
          
          <button
            type="button"
            onClick={(e) => handleToolClick(e, () => setIsHelpModalOpen(true))}
            disabled={disabled}
            className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="BBCode帮助"
          >
            <FaQuestionCircle className="w-3 h-3" />
            <span className="hidden sm:inline">帮助</span>
          </button>
          
          <button
            type="button"
            onClick={(e) => handleToolClick(e, () => setIsPreviewMode(!isPreviewMode))}
            disabled={disabled}
            className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPreviewMode ? (
              <>
                <FaEyeSlash className="w-3 h-3" />
                <span className="hidden sm:inline">编辑</span>
              </>
            ) : (
              <>
                <FaEye className="w-3 h-3" />
                <span className="hidden sm:inline">预览</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 编辑器内容区域 */}
      <div className="relative">
        {isPreviewMode ? (
          /* 预览模式 */
          <div className="p-4 min-h-[300px] h-[50vh] overflow-y-auto">
            {validationLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="sm" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">生成预览中...</span>
              </div>
            ) : validationError ? (
              <div className="text-center py-8 text-red-500 dark:text-red-400 text-sm">
                {validationError}
              </div>
            ) : validationResult?.preview ? (
              <BBCodeRenderer 
                html={validationResult.preview.html} 
                className="prose prose-sm dark:prose-invert max-w-none"
              />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                {value.trim() ? '无法生成预览' : '输入内容以查看预览'}
              </div>
            )}
          </div>
        ) : (
          /* 编辑模式 */
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="w-full p-4 min-h-[300px] h-[50vh] resize-none bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ lineHeight: '1.6' }}
          />
        )}

        {/* 验证结果指示器 */}
        {!isPreviewMode && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {validationLoading && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs">
                <LoadingSpinner size="sm" />
                <span>验证中</span>
              </div>
            )}
            
            {validationResult && !validationLoading && (
              <div className={`px-2 py-1 rounded-md text-xs ${
                validationResult.valid 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                {validationResult.valid ? '✓ 语法正确' : `✗ ${validationResult.errors.length}个错误`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 验证错误列表 */}
      {validationResult && !validationResult.valid && validationResult.errors.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-red-50 dark:bg-red-900/10">
          <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
            BBCode语法错误:
          </div>
          <ul className="list-disc list-inside space-y-1">
            {validationResult.errors.map((error, index) => (
              <li key={index} className="text-sm text-red-600 dark:text-red-400">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 帮助文本 - 更紧凑的设计 */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-2 py-1 bg-gray-50 dark:bg-gray-700/30">
        <details className="text-xs text-gray-600 dark:text-gray-400">
          <summary className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 py-1">
            BBCode帮助
          </summary>
          <div className="mt-1 pb-1 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-0.5 text-xs">
            <div><strong>[b]粗体[/b]</strong></div>
            <div><em>[i]斜体[/i]</em></div>
            <div><u>[u]下划线[/u]</u></div>
            <div><del>[s]删除线[/s]</del></div>
            <div>[color=red]彩色[/color]</div>
            <div>[size=16]大小[/size]</div>
            <div>[url=链接]文本[/url]</div>
            <div>[img]图片URL[/img]</div>
            <div>[quote]引用[/quote]</div>
            <div>[code]代码[/code]</div>
            <div className="md:col-span-1 col-span-2">[list][*]项目1[*]项目2[/list]</div>
          </div>
        </details>
      </div>

      {/* BBCode帮助模态框 */}
      <BBCodeHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};

export default BBCodeEditor;