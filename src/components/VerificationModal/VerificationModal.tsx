import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationModalProps {
  isOpen: boolean;
  method: 'totp' | 'mail';
  onVerify: (code: string) => Promise<void>;
  onSwitchMethod: () => Promise<void>;
  onResendCode?: () => Promise<void>;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  method,
  onVerify,
  onSwitchMethod,
  onResendCode,
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(null);
      setResendMessage(null);
      
      // 防止背景滚动
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      // 恢复背景滚动
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      // 清理函数确保在组件卸载时恢复滚动
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, method]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await onVerify(code.trim());
      setCode('');
    } catch (err: any) {
      console.error('验证失败:', err);
      
      // 处理特定的 TOTP 错误
      const errorMessage = err?.response?.data?.error;
      const errorDetail = err?.response?.data?.detail;
      const errorString = err?.message || JSON.stringify(err?.response?.data || err);
      
      // 检查多种可能的错误格式
      if (errorMessage === 'No TOTP setup in progress or invalid data' || 
          errorString.includes('No TOTP setup in progress or invalid data')) {
        setError('验证码错误，请重新输入正确的验证码');
      } else if (errorDetail && typeof errorDetail === 'string' && 
                 errorDetail.includes('No TOTP setup in progress or invalid data')) {
        setError('验证码错误，请重新输入正确的验证码');
      } else {
        setError('验证失败，请检查验证码是否正确');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchMethod = async () => {
    setIsLoading(true);
    setError(null);
    setResendMessage(null);
    
    try {
      await onSwitchMethod();
    } catch (err) {
      setError('切换验证方式失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!onResendCode) return;
    
    setResendLoading(true);
    setError(null);
    setResendMessage(null);

    try {
      await onResendCode();
      setResendMessage('验证码已重新发送');
    } catch (err) {
      setError('重新发送验证码失败，请重试');
    } finally {
      setResendLoading(false);
    }
  };

  const getTitle = () => {
    return method === 'totp' ? 'TOTP 身份验证' : '邮箱验证';
  };

  const getDescription = () => {
    return method === 'totp' 
      ? '请输入您的 TOTP 验证器中显示的 6 位验证码'
      : '请输入发送到您邮箱的 8 位验证码';
  };

  const getIcon = () => {
    return method === 'totp' ? 
      <Smartphone className="w-5 h-5 text-osu-pink" /> : 
      <Mail className="w-5 h-5 text-osu-pink" />;
  };

  const getCodeLength = () => {
    return method === 'totp' ? 6 : 8;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute m-[-10px] inset-1 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* 模态框内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* 标题和图标 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-osu-pink/10 dark:bg-osu-pink/20 rounded-lg">
                    {getIcon()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {getTitle()}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {getDescription()}
                    </p>
                  </div>
                </div>
              </div>

              {/* 验证表单 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    验证码
                  </label>
                  <input
                    id="verification-code"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, getCodeLength());
                      setCode(value);
                    }}
                    placeholder={`请输入 ${getCodeLength()} 位验证码`}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg tracking-[0.3em] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-osu-pink focus:border-transparent transition-colors"
                    maxLength={getCodeLength()}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {resendMessage && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {resendMessage}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || code.length !== getCodeLength()}
                  className="w-full bg-osu-pink hover:bg-osu-pink/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      验证中...
                    </>
                  ) : (
                    '验证'
                  )}
                </button>
              </form>

              {/* 分割线 */}
              <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <button
                  onClick={handleSwitchMethod}
                  disabled={isLoading}
                  className="w-full text-osu-pink hover:text-osu-pink/80 text-sm font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {method === 'totp' ? '使用邮箱验证' : '使用 TOTP 验证'}
                </button>

                {method === 'mail' && onResendCode && (
                  <button
                    onClick={handleResendCode}
                    disabled={resendLoading || isLoading}
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    {resendLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        发送中...
                      </>
                    ) : (
                      '重新发送验证码'
                    )}
                  </button>
                )}
              </div>

              {/* 安全提示 */}
              <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  🔒 为了您的账户安全，请完成身份验证
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};