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
} from 'lucide-react';
import { soundPlayer } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { notificationService, NotificationPermissionStatus } from '../utils/notifications';
import { PWAInstallButton } from './Common/PWAInstallButton';

export type AppNavTab =
  | 'home'
  | 'ask'
  | 'forecast'
  | 'alerts'
  | 'help'
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
    <header className="sticky top-0 z-40 w-full bg-[#050B14]/95 backdrop-blur-xl border-b border-white/10 transition-all shadow-2xl">
      {/* Dynamic Real-Time Ticker Bar */}
      <div className="w-full px-3 sm:px-4 py-1 text-xs transition-colors flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex-shrink-0 font-mono">
            SIH 26068
          </span>
          <p className="truncate text-xs font-medium text-slate-300">
            {tickerItems[tickerIndex]}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 text-[11px]">
          {/* SIH Deck Button */}
          {onOpenDeckModal && (
            <button
              onClick={onOpenDeckModal}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-[11px] font-bold transition-all"
              title="View SIH 26068 Pitch Deck & System Architecture"
            >
              <BookOpen className="w-3 h-3 text-sky-400" />
              <span className="hidden sm:inline">SIH 26068 Deck</span>
              <span className="sm:hidden font-mono">Deck</span>
            </button>
          )}

          {/* Push Notification Toggle */}
          <button
            onClick={handleEnablePush}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all text-[11px] font-semibold ${
              notifStatus === 'granted'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
            }`}
            title="Toggle Instant Push Alerts for severe weather warnings"
          >
            {notifStatus === 'granted' ? (
              <BellRing className="w-3 h-3 text-emerald-400" />
            ) : (
              <Bell className="w-3 h-3 text-amber-400" />
            )}
            <span>{notifStatus === 'granted' ? 'Alerts: ON' : 'Push Alerts'}</span>
          </button>

          {/* Rules / Penalties */}
          <button
            onClick={() => setIsRulesModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-slate-200 transition-all"
            title="Read Rules & Penalties"
          >
            <Scale className="w-3 h-3 text-slate-400" />
            <span>Rules</span>
          </button>

          {/* Live GPS Area Button */}
          <button
            onClick={onRefreshLocation}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 transition-all"
            title="Click to detect or switch zone"
          >
            <MapPin className={`w-3 h-3 ${isGpsLocked ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="font-semibold text-white max-w-[120px] sm:max-w-[180px] truncate">
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
          onClick={() => changeTab('home')}
          title="WeatherGPT Home (SIH 26068)"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-xs shadow-lg shadow-sky-500/20 flex-shrink-0">
            RQ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-none">
                WEATHER<span className="text-sky-400">GPT</span>
              </h1>
              <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 text-[9px] font-mono font-bold border border-sky-500/30">
                26068
              </span>
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
              ResQTech <span className="text-slate-600">•</span> Civic Relief
            </p>
          </div>
        </div>

        {/* 5 Core Desktop Navigation Tabs + Radar */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10 text-xs">
          {/* TAB 1: HOME */}
          <button
            onClick={() => changeTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'home'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Home</span>
          </button>

          {/* TAB 2: ASK (WEATHERGPT) */}
          <button
            onClick={() => changeTab('ask')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'ask' || activeTab === 'weather_gpt'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'ask' || activeTab === 'weather_gpt' ? 'text-slate-950' : 'text-sky-400'}`} />
            <span>Ask AI</span>
          </button>

          {/* TAB 3: FORECAST */}
          <button
            onClick={() => changeTab('forecast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'forecast'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Forecast</span>
          </button>

          {/* TAB 4: ALERTS */}
          <button
            onClick={() => changeTab('alerts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all relative ${
              activeTab === 'alerts' || activeTab === 'early_warning'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Alerts</span>
            {activeAlertCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                activeTab === 'alerts' || activeTab === 'early_warning' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/30 text-amber-300'
              }`}>
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* TAB 5: HELP (CIVIC RELIEF) */}
          <button
            onClick={() => changeTab('help')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all relative ${
              activeTab === 'help' || activeTab === 'mutual_aid'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
            <span>Civic Relief</span>
            {openHelpRequestCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                activeTab === 'help' || activeTab === 'mutual_aid' ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/30 text-emerald-300'
              }`}>
                {openHelpRequestCount}
              </span>
            )}
          </button>

          {/* SECONDARY: 5KM RADAR */}
          <button
            onClick={() => changeTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'map'
                ? 'bg-white text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Radar</span>
          </button>
        </nav>

        {/* Action Controls (Right) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Android PWA Install Prompt */}
          <PWAInstallButton variant="compact" />

          {/* About Modal Button */}
          {onOpenAboutModal && (
            <button
              onClick={onOpenAboutModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
              title="About WeatherGPT & Civic Relief"
            >
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden lg:inline">About</span>
            </button>
          )}
          {/* Broadcast 5km Signal Modal Trigger */}
          {onOpenBroadcastModal && (
            <button
              onClick={onOpenBroadcastModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all"
              title="Broadcast 5km Hyperlocal Signal to Nearby Citizens"
            >
              <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="hidden lg:inline">5km Signal</span>
            </button>
          )}

          {/* Admin Badge */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition-all"
              title="Open Admin Authority Portal"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* User Account / Login */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-1 rounded-lg transition-all"
                title="Your Profile"
              >
                <div className="w-5 h-5 rounded-md bg-blue-600/40 flex items-center justify-center text-[10px] font-bold text-white">
                  {isMasterAdmin ? '👑' : <User className="w-3 h-3 text-blue-300" />}
                </div>
                <span className="font-bold text-white max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline">
                  {currentUser.displayName}
                </span>
              </button>
              <button
                onClick={logout}
                className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-slate-300" />
              <span>Login</span>
            </button>
          )}

          {/* AI Advisor Modal Button */}
          <button
            onClick={onOpenAIAdvisor}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-semibold transition-all"
            title="Ask AI Crisis Advisor"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Advisor</span>
          </button>

          {/* Siren Test Button */}
          <button
            onClick={toggleSiren}
            className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
              isSirenOn
                ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title={isSirenOn ? 'Stop Emergency Siren' : 'Test Emergency Siren'}
          >
            {isSirenOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Big SOS Beacon Button */}
          <button
            id="emergency-sos-header-btn"
            onClick={triggerSOS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wide uppercase shadow-lg shadow-red-600/30 border border-red-400/40 transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};

