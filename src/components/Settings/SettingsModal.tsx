import React from 'react';
import {
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  MapPin,
  Compass,
  Check,
  X,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress?: string;
  onDetectGPS?: () => void;
  onChangeArea?: () => void;
  isLocating?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userAddress = 'Current Area',
  onDetectGPS,
  onChangeArea,
  isLocating = false,
}) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, autoReadAnswers, setAutoReadAnswers } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-7 shadow-2xl transition-all border bg-white dark:bg-[#0b1325] text-slate-900 dark:text-slate-100 border-slate-200 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {t('settings_title')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('settings_subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t('settings_close')}
            className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5">
          {/* SECTION 1: APPEARANCE (LIGHT / DARK THEME) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span>🎨</span>
                <span>{t('settings_theme')}</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {theme === 'light' ? t('settings_theme_light') : t('settings_theme_dark')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Light Theme Button */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all text-left font-bold cursor-pointer ${
                  theme === 'light'
                    ? 'border-sky-500 bg-sky-50 text-sky-950 shadow-md ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    theme === 'light'
                      ? 'bg-amber-400 text-amber-950 shadow-sm'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold">{t('settings_theme_light')}</div>
                  <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                    Clean, bright & readable
                  </div>
                </div>
                {theme === 'light' && (
                  <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Dark Theme Button */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all text-left font-bold cursor-pointer ${
                  theme === 'dark'
                    ? 'border-sky-500 bg-sky-950/30 text-white shadow-md ring-2 ring-sky-500/30'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold">{t('settings_theme_dark')}</div>
                  <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                    Comfortable dark mode
                  </div>
                </div>
                {theme === 'dark' && (
                  <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 2: APPLICATION LANGUAGE (FULL SYNC WITH AI) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span>🌐</span>
                <span>{t('settings_language')}</span>
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ✨ Synchronized with AI responses
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('settings_language_desc')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 pt-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code as LanguageCode)}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all font-medium cursor-pointer text-left ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/15 text-sky-950 dark:text-sky-200 shadow-sm ring-1 ring-sky-500/30'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{lang.flag}</span>
                      <div className="truncate">
                        <div className="text-sm font-black truncate">{lang.nativeName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {lang.name}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: VOICE AUDIO READOUT */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                {autoReadAnswers ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {t('settings_voice')}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t('settings_voice_desc')}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAutoReadAnswers(!autoReadAnswers)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                autoReadAnswers
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20'
              }`}
            >
              {autoReadAnswers ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* SECTION 4: LOCATION REFRESH */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>{t('settings_location')}</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">
                {userAddress}
              </span>
            </div>

            <div className="flex gap-2">
              {onDetectGPS && (
                <button
                  type="button"
                  onClick={onDetectGPS}
                  disabled={isLocating}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? t('common_detecting') : t('settings_detect_gps')}</span>
                </button>
              )}

              {onChangeArea && (
                <button
                  type="button"
                  onClick={onChangeArea}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 text-xs font-extrabold flex items-center gap-1.5 transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{t('settings_change_zone')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Done / Close button */}
        <div className="pt-6 mt-4 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm tracking-wide shadow-lg shadow-sky-600/25 transition-all active:scale-[0.98]"
          >
            {t('settings_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
