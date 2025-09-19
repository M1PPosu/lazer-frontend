import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiGlobe } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppLanguages } from '../../i18n/resources';

interface Language {
  code: AppLanguages;
  name: string;
  nativeName: string;
  flag?: string;
}

// 支持的语言列表
const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  // 可以轻松扩展更多语言
  // {
  //   code: 'ja',
  //   name: 'Japanese',
  //   nativeName: '日本語',
  //   flag: '🇯🇵'
  // },
  // {
  //   code: 'ko',
  //   name: 'Korean',
  //   nativeName: '한국어',
  //   flag: '🇰🇷'
  // },
  // {
  //   code: 'es',
  //   name: 'Spanish',
  //   nativeName: 'Español',
  //   flag: '🇪🇸'
  // },
  // {
  //   code: 'fr',
  //   name: 'French',
  //   nativeName: 'Français',
  //   flag: '🇫🇷'
  // },
  // {
  //   code: 'de',
  //   name: 'German',
  //   nativeName: 'Deutsch',
  //   flag: '🇩🇪'
  // },
  // {
  //   code: 'ru',
  //   name: 'Russian',
  //   nativeName: 'Русский',
  //   flag: '🇷🇺'
  // }
];

interface LanguageSelectorProps {
  className?: string;
  variant?: 'button' | 'dropdown' | 'compact';
  showLabel?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'dropdown',
  showLabel = false
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const resolvedLanguage = (i18n.resolvedLanguage ?? i18n.language) as string;
  const currentLanguage: AppLanguages = resolvedLanguage.startsWith('zh') ? 'zh' : 'en';
  const currentLangData = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (language: AppLanguages) => {
    void i18n.changeLanguage(language);
    setIsOpen(false);
  };

  // 简单按钮切换模式（仅支持中英文切换）
  if (variant === 'button') {
    const nextLanguage: AppLanguages = currentLanguage === 'zh' ? 'en' : 'zh';
    const nextLangData = SUPPORTED_LANGUAGES.find(lang => lang.code === nextLanguage);
    
    return (
      <button
        onClick={() => handleLanguageChange(nextLanguage)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
        title={t('common.language.switch', { language: nextLangData?.nativeName })}
      >
        <FiGlobe className="w-4 h-4" />
        {showLabel && <span className="text-sm">{currentLangData.flag} {currentLangData.nativeName}</span>}
      </button>
    );
  }

  // 紧凑模式
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          title={t('common.language.label')}
        >
          <span className="text-lg">{currentLangData.flag}</span>
          <FiChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[160px] z-50"
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:bg-gray-100 dark:focus:bg-gray-600 focus:outline-none flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg ${
                    currentLanguage === language.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{language.name}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 默认下拉框模式
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[160px]"
      >
        <FiGlobe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{currentLangData.flag}</span>
          <div className="flex flex-col items-start">
            {showLabel && <span className="text-xs text-gray-500 dark:text-gray-400">{t('common.language.label')}</span>}
            <span className="text-sm font-medium text-gray-900 dark:text-white">{currentLangData.nativeName}</span>
          </div>
        </div>
        <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:bg-gray-100 dark:focus:bg-gray-600 focus:outline-none flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg ${
                  currentLanguage === language.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{language.nativeName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{language.name}</span>
                </div>
                {currentLanguage === language.code && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
