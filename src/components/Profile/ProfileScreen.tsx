import React from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Mic,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  Volume2,
  Shield,
  User,
  LogOut,
  LogIn,
  Check,
  FileText,
  PhoneCall,
  Info,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n/translations';
import { PWAInstallButton } from '../Common/PWAInstallButton';
import { soundPlayer } from '../../utils/audio';

interface ProfileScreenProps {
  userAddress: string;
  isGpsLocked?: boolean;
  onDetectLocation?: () => void;
  onOpenLocationSelector?: () => void;
  onOpenSOS?: () => void;
  onOpenBroadcast?: () => void;
  onOpenRules?: () => void;
  onOpenDeck?: () => void;
  onOpenAbout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userAddress,
  isGpsLocked = false,
  onDetectLocation,
  onOpenLocationSelector,
  onOpenRules,
  onOpenDeck,
  onOpenAbout,
}) => {
  const { theme, setTheme, isDark, systemIsDark } = useTheme();
  const {
    appLanguage,
    setAppLanguage,
    currentAppLanguage,
    askLanguage,
    setAskLanguage,
    currentAskLanguage,
    t,
  } = useLanguage();
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();

  const handleTestSiren = () => {
    soundPlayer.playBeep(880, 0.4);
    setTimeout(() => soundPlayer.playBeep(660, 0.4), 450);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-1 py-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('settings_title', 'Settings & Preferences')}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          Customize your theme, languages, location, and audio settings
        </p>
      </div>

      {/* 1. Theme Selection: Light, Dark, or System */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border-2 border-slate-200 dark:border-white/10 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Theme Appearance
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Choose clean white, dark night, or follow system setting
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10">
            {theme === 'light' ? '☀️ Light' : theme === 'dark' ? '🌙 Dark' : `💻 System (${systemIsDark ? 'Dark' : 'Light'})`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Light Theme Button */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all text-left font-bold cursor-pointer active:scale-95 ${
              theme === 'light'
                ? 'border-sky-600 bg-sky-50 text-slate-950 shadow-md ring-2 ring-sky-500/20'
                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                theme === 'light' ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sun className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black truncate">Light / White</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold truncate">
                High contrast white
              </div>
            </div>
            {theme === 'light' && (
              <Check className="w-4 h-4 text-sky-600 stroke-[3] shrink-0" />
            )}
          </button>

          {/* Dark Theme Button */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all text-left font-bold cursor-pointer active:scale-95 ${
              theme === 'dark'
                ? 'border-sky-500 bg-sky-950/40 text-white shadow-md ring-2 ring-sky-500/30'
                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                theme === 'dark' ? 'bg-indigo-500 text-white shadow' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Moon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black truncate">Dark Mode</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold truncate">
                Deep night canvas
              </div>
            </div>
            {theme === 'dark' && (
              <Check className="w-4 h-4 text-sky-400 stroke-[3] shrink-0" />
            )}
          </button>

          {/* System Theme Button */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all text-left font-bold cursor-pointer active:scale-95 ${
              theme === 'system'
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-slate-950 dark:text-white shadow-md ring-2 ring-sky-500/20'
                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                theme === 'system' ? 'bg-sky-500 text-white shadow' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Laptop className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black truncate">System Auto</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold truncate">
                Matches OS
              </div>
            </div>
            {theme === 'system' && (
              <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 stroke-[3] shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* 2. DUAL LANGUAGE SYSTEM: App Language vs Conversational Language */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border-2 border-slate-200 dark:border-white/10 shadow-sm space-y-5 transition-colors">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Language Settings
          </h3>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Set your screen reading language and your conversational voice language independently
          </p>
        </div>

        {/* 2A. App UI Language */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-sm font-black text-slate-900 dark:text-white">
                App Language (UI, Navigation, Alerts)
              </span>
            </div>
            <span className="text-xs font-black text-sky-700 dark:text-sky-400">
              Current: {currentAppLanguage.nativeName}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = appLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setAppLanguage(lang.code)}
                  className={`p-2.5 rounded-xl border-2 flex items-center justify-between gap-2 transition-all text-left font-bold active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-500/20 text-slate-950 dark:text-white shadow-xs ring-1 ring-sky-500'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base">{lang.flag}</span>
                    <div className="truncate">
                      <div className="text-xs font-black truncate">{lang.nativeName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 stroke-[3] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2B. Ask & Voice Language */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-black text-slate-900 dark:text-white">
                Ask / Voice Language (Conversational AI & Mic)
              </span>
            </div>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
              Current: {currentAskLanguage.nativeName}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            For example: You can read the app in English, but speak and listen to the assistant in Hindi (हिन्दी) or your mother tongue.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = askLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setAskLanguage(lang.code)}
                  className={`p-2.5 rounded-xl border-2 flex items-center justify-between gap-2 transition-all text-left font-bold active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-500/20 text-slate-950 dark:text-white shadow-xs ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base">{lang.flag}</span>
                    <div className="truncate">
                      <div className="text-xs font-black truncate">{lang.nativeName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Location Information & GPS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border-2 border-slate-200 dark:border-white/10 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Location & Forecast Area
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Weather and severe warnings are grounded to this area
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-bold">Active Area:</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
              {isGpsLocked ? '● GPS Locked' : '○ Saved Area'}
            </span>
          </div>
          <p className="text-sm font-black text-slate-900 dark:text-white">{userAddress}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {onDetectLocation && (
            <button
              type="button"
              onClick={onDetectLocation}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Detect My GPS</span>
            </button>
          )}

          {onOpenLocationSelector && (
            <button
              type="button"
              onClick={onOpenLocationSelector}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-black transition-all active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
              <span>Change Area</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Audio Speaker & Verified Emergency Numbers */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border-2 border-slate-200 dark:border-white/10 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Emergency Audio & Verified Helplines
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Verified national emergency telephone numbers & siren check
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleTestSiren}
            className="p-3.5 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-slate-100 flex items-center gap-3 text-left transition-all active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-black">Test Alert Sound</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Check alert speaker volume</div>
            </div>
          </button>

          <a
            href="tel:112"
            className="p-3.5 rounded-xl border-2 border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-950 dark:text-rose-200 flex items-center gap-3 text-left transition-all active:scale-95"
          >
            <PhoneCall className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <div className="text-xs font-black">National Helpline: 112</div>
              <div className="text-[11px] text-rose-800 dark:text-rose-300 font-semibold">Toll-free emergency response</div>
            </div>
          </a>
        </div>
      </div>

      {/* 5. Account & Offline App Status */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border-2 border-slate-200 dark:border-white/10 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Account & Offline PWA
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {isAuthenticated ? `Signed in as ${user?.displayName || user?.email || 'Citizen'}` : 'Sign in to save reports and preferences'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-rose-50 text-rose-700 text-xs font-black transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          )}

          <PWAInstallButton variant="standard" />
        </div>

        {/* Quick Links for Deck / Rules / Info */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-2 text-xs">
          {onOpenRules && (
            <button
              type="button"
              onClick={onOpenRules}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-slate-950 font-bold cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Civic Rules & Standards</span>
            </button>
          )}

          {onOpenDeck && (
            <button
              type="button"
              onClick={onOpenDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-slate-950 font-bold cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>SIH 26068 Pitch Deck</span>
            </button>
          )}

          {onOpenAbout && (
            <button
              type="button"
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-slate-950 font-bold cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>About ResQTech</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
