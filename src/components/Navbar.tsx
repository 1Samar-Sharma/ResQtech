import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Shield,
  HeartHandshake,
  Bot,
  MapPin,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  Scale,
  Crown,
  User,
  LogOut,
  Lock,
  Bell,
  BellRing,
  BookOpen,
  Radio,
  Info,
  Sun,
  Moon,
  Languages,
  Users,
  Settings as SettingsIcon,
} from 'lucide-react';
import { soundPlayer } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { notificationService, NotificationPermissionStatus } from '../utils/notifications';
import { PWAInstallButton } from './Common/PWAInstallButton';

export type AppNavTab =
  | 'ask'
  | 'citizen'
  | 'forecast'
  | 'alerts'
  | 'help'
  | 'profile'
  | 'map'
  | 'weather_gpt'
  | 'mutual_aid'
  | 'early_warning'
  | 'community';

interface NavbarProps {
  activeTab: string;
  onTabChange?: (tab: any) => void;
  setActiveTab?: (tab: any) => void;
  onOpenAIAdvisor: () => void;
  onOpenAboutModal?: () => void;
  onOpenSettings?: () => void;
  onTriggerGlobalSOS?: () => void;
  onOpenSOSModal?: () => void;
  onOpenBroadcastModal?: () => void;
  onOpenDeckModal?: () => void;
  userAddress?: string;
  isGpsLocked?: boolean;
  onRefreshLocation?: () => void;
  activeAlertCount?: number;
  openHelpRequestCount?: number;
  activeSOSCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  setActiveTab,
  onOpenAIAdvisor,
  onOpenAboutModal,
  onOpenSettings,
  onTriggerGlobalSOS,
  onOpenSOSModal,
  onOpenBroadcastModal,
  onOpenDeckModal,
  userAddress = 'Your Current Area',
  isGpsLocked = false,
  onRefreshLocation,
  activeAlertCount = 0,
  openHelpRequestCount = 0,
  activeSOSCount = 0,
}) => {
  const {
    currentUser,
    isAdmin,
    isMasterAdmin,
    logout,
    setIsAuthModalOpen,
    setIsAdminModalOpen,
    setIsProfileModalOpen,
    setIsRulesModalOpen,
  } = useAuth();

  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, currentLanguage } = useLanguage();

  const [isSirenOn, setIsSirenOn] = useState(false);
  const [notifStatus, setNotifStatus] = useState<NotificationPermissionStatus>('default');
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    setNotifStatus(notificationService.getPermissionStatus());
  }, []);

  const handleEnablePush = async () => {
    const granted = await notificationService.requestPermission();
    setNotifStatus(granted ? 'granted' : 'denied');
    if (granted) {
      soundPlayer.playBeep(880, 0.2);
    }
  };

  const changeTab = (tab: AppNavTab) => {
    if (onTabChange) onTabChange(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const triggerSOS = () => {
    if (onTriggerGlobalSOS) onTriggerGlobalSOS();
    if (onOpenSOSModal) onOpenSOSModal();
  };

  // Real, transparent dynamic ticker messages based on active live system state
  const tickerItems = [
    `📡 SIH 26068 WeatherGPT • 5km Hyperlocal Mesh active for ${userAddress}`,
    '💬 Ask in 24+ Indic Languages: Hindi, Punjabi, Tamil, Telugu, Marathi...',
    '🌦️ Grounded in IMD & INSAT Satellite Telemetry — zero hallucinated metrics',
    openHelpRequestCount > 0
      ? `🤝 ${openHelpRequestCount} Civic Relief Aid Request(s) active in local mesh`
      : '🤝 Civic Relief: Community mutual aid & volunteer response layer',
    activeAlertCount > 0
      ? `⚠️ ${activeAlertCount} Severe Weather Advisory active in this district`
      : '⚡ UNDRR ROI Dividend: Every ₹1 spent on early warning saves ~₹115 in relief',
    '⚖️ Statutory Notice: False alarms and misleading reports are punishable by law',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  const toggleSiren = () => {
    if (isSirenOn) {
      soundPlayer.stopSiren();
      setIsSirenOn(false);
    } else {
      soundPlayer.playSiren();
      setIsSirenOn(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#050B14]/95 text-slate-900 dark:text-white backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors shadow-sm dark:shadow-2xl">
      {/* Dynamic Real-Time Ticker Bar (Hidden on mobile to keep header clean and compact) */}
      <div className="hidden sm:flex w-full px-3 sm:px-4 py-1 text-xs transition-colors items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 flex-shrink-0 font-mono">
            SIH 26068
          </span>
          <p className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
            {tickerItems[tickerIndex]}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 text-[11px]">
          {/* SIH Deck Button */}
          {onOpenDeckModal && (
            <button
              onClick={onOpenDeckModal}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 border border-sky-500/30 text-sky-700 dark:text-sky-200 text-[11px] font-bold transition-all"
              title="View SIH 26068 Pitch Deck & System Architecture"
            >
              <BookOpen className="w-3 h-3 text-sky-500 dark:text-sky-400" />
              <span className="hidden sm:inline">SIH 26068 Deck</span>
              <span className="sm:hidden font-mono">Deck</span>
            </button>
          )}

          {/* Push Notification Toggle */}
          <button
            onClick={handleEnablePush}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all text-[11px] font-semibold ${
              notifStatus === 'granted'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border-amber-500/30'
            }`}
            title="Toggle Instant Push Alerts for severe weather warnings"
          >
            {notifStatus === 'granted' ? (
              <BellRing className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Bell className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            )}
            <span>{notifStatus === 'granted' ? 'Alerts: ON' : 'Push Alerts'}</span>
          </button>

          {/* Rules / Penalties */}
          <button
            onClick={() => setIsRulesModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
            title="Read Rules & Penalties"
          >
            <Scale className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>Rules</span>
          </button>

          {/* Live GPS Area Button */}
          <button
            onClick={onRefreshLocation}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all"
            title="Click to detect or switch zone"
          >
            <MapPin className={`w-3 h-3 ${isGpsLocked ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`} />
            <span className="font-semibold text-slate-900 dark:text-white max-w-[120px] sm:max-w-[180px] truncate">
              {userAddress}
            </span>
          </button>
        </div>
      </div>

      {/* Main Streamlined Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-15 flex items-center justify-between gap-3">
        {/* Brand: WeatherGPT by ResQTech (SIH 26068) */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => changeTab('ask')}
          title="WeatherGPT (SIH 26068)"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-xs shadow-md shadow-sky-500/20 flex-shrink-0">
            RQ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                WEATHER<span className="text-sky-500">GPT</span>
              </h1>
              <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[9px] font-mono font-bold border border-sky-500/30">
                26068
              </span>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              ResQTech <span className="text-slate-400 dark:text-slate-600">•</span> Civic Relief
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs: ASK | CITIZEN | FORECAST | ALERTS | RELIEF */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-2xl border border-slate-200 dark:border-white/10 text-xs transition-colors">
          {/* TAB 1: ASK (WEATHERGPT) - PRIMARY */}
          <button
            onClick={() => changeTab('ask')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'ask' || activeTab === 'weather_gpt'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'ask' || activeTab === 'weather_gpt' ? 'text-slate-950' : 'text-sky-500 dark:text-sky-400'}`} />
            <span>{t('ask')}</span>
          </button>

          {/* TAB 2: CITIZEN (SPECIALIZED PERSONAS) - DIRECTLY BESIDE ASK */}
          <button
            onClick={() => changeTab('citizen')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'citizen' || activeTab === 'personas'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <Users className={`w-3.5 h-3.5 ${activeTab === 'citizen' || activeTab === 'personas' ? 'text-slate-950' : 'text-blue-500 dark:text-blue-400'}`} />
            <span>Citizen</span>
          </button>

          {/* TAB 3: FORECAST */}
          <button
            onClick={() => changeTab('forecast')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'forecast'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <span>{t('forecast')}</span>
          </button>

          {/* TAB 4: ALERTS */}
          <button
            onClick={() => changeTab('alerts')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all relative cursor-pointer ${
              activeTab === 'alerts' || activeTab === 'early_warning'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{t('alerts')}</span>
            {activeAlertCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                activeTab === 'alerts' || activeTab === 'early_warning' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950 dark:bg-amber-500/30 dark:text-amber-300'
              }`}>
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* TAB 5: HELP (CIVIC RELIEF) */}
          <button
            onClick={() => changeTab('help')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all relative cursor-pointer ${
              activeTab === 'help' || activeTab === 'mutual_aid'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>{t('relief')}</span>
            {openHelpRequestCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                activeTab === 'help' || activeTab === 'mutual_aid' ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500 text-slate-950 dark:bg-emerald-500/30 dark:text-emerald-300'
              }`}>
                {openHelpRequestCount}
              </span>
            )}
          </button>

          {/* SECONDARY: 5KM RADAR */}
          <button
            onClick={() => changeTab('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>Radar</span>
          </button>
        </nav>

        {/* Action Controls (Right) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* QUICK LANGUAGE TOGGLE (EN | हिन्दी) */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 transition-all text-xs font-black cursor-pointer"
            title="1-Click switch between English and हिन्दी"
            aria-label="Quick language toggle English or Hindi"
          >
            <span className={language === 'en' ? 'text-sky-600 dark:text-sky-400 underline font-black' : 'text-slate-500 dark:text-slate-400'}>EN</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className={language === 'hi' ? 'text-sky-600 dark:text-sky-400 underline font-black' : 'text-slate-500 dark:text-slate-400'}>हिन्दी</span>
          </button>

          {/* THEME TOGGLE (☀️ Light / 🌙 Dark) - Accessible & Easy to find */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-amber-300 transition-all text-xs font-bold cursor-pointer"
            title={theme === 'dark' ? t('lightTheme') : t('darkTheme')}
            aria-label="Toggle Light or Dark Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="hidden xl:inline text-slate-200">{t('lightTheme')}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden xl:inline text-slate-700">{t('darkTheme')}</span>
              </>
            )}
          </button>

          {/* ALL LANGUAGES MODAL BUTTON */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              title="All Settings & 24+ Indic Languages"
              aria-label="Open Settings"
            >
              <Languages className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </button>
          )}

          {/* Android PWA Install Prompt */}
          <div className="hidden sm:block">
            <PWAInstallButton variant="compact" />
          </div>

          {/* About Modal Button */}
          {onOpenAboutModal && (
            <button
              onClick={onOpenAboutModal}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all"
              title="About WeatherGPT & Civic Relief"
            >
              <Info className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>About</span>
            </button>
          )}

          {/* Admin Badge */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-200 border border-amber-500/40 text-xs font-bold transition-all"
              title="Open Admin Authority Portal"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* User Account / Login */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-white/10 px-2 py-1 rounded-lg transition-all"
                title="Your Profile"
              >
                <div className="w-5 h-5 rounded-md bg-blue-600/40 flex items-center justify-center text-[10px] font-bold text-white">
                  {isMasterAdmin ? '👑' : <User className="w-3 h-3 text-blue-500 dark:text-blue-300" />}
                </div>
                <span className="font-bold text-slate-800 dark:text-white max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline">
                  {currentUser.displayName}
                </span>
              </button>
              <button
                onClick={logout}
                className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-500"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white border border-slate-300 dark:border-white/10 text-xs font-bold transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
              <span>Login</span>
            </button>
          )}

          {/* Siren Test Button */}
          <button
            onClick={toggleSiren}
            className={`hidden sm:flex p-2 rounded-xl text-xs font-semibold transition-all border ${
              isSirenOn
                ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
            }`}
            title={isSirenOn ? 'Stop Emergency Siren' : 'Test Emergency Siren'}
          >
            {isSirenOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

