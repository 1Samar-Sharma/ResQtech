import React from 'react';
import { Sparkles, Users, AlertTriangle, User, CloudSun } from 'lucide-react';
import { soundPlayer } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

export type MainNavTab = 'forecast' | 'ask' | 'citizen' | 'alerts' | 'profile' | 'help' | 'settings';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onOpenSettings?: () => void;
  activeAlertCount?: number;
  openHelpRequestCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  activeAlertCount = 0,
}) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'forecast' as const,
      label: 'Forecast',
      icon: CloudSun,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'ask' as const,
      label: 'Ask AI',
      icon: Sparkles,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'citizen' as const,
      label: 'Citizen',
      icon: Users,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'alerts' as const,
      label: 'Alerts',
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      badge: null,
      badgeColor: '',
    },
  ];

  const handleSelectTab = (tabId: string) => {
    soundPlayer.playBeep(640, 0.04);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    onTabChange(tabId);
  };

  return (
    <nav
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-[#060c18]/98 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 md:hidden shadow-lg transition-colors"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.2rem)' }}
      aria-label="Main Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center justify-items-center px-1 py-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'forecast' && (activeTab === 'home' || activeTab === 'weather')) ||
            (item.id === 'ask' && (activeTab === 'weather_gpt' || activeTab === 'weather_gpt_chat')) ||
            (item.id === 'citizen' && (activeTab === 'personas' || activeTab === 'farmer' || activeTab === 'fisherman')) ||
            (item.id === 'alerts' && activeTab === 'early_warning') ||
            (item.id === 'profile' && (activeTab === 'settings' || activeTab === 'account'));

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center justify-center w-full min-h-[50px] py-1 px-0.5 rounded-xl transition-all relative focus:outline-none active:scale-95 touch-manipulation cursor-pointer ${
                isActive
                  ? 'text-sky-700 dark:text-sky-400 font-black'
                  : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white font-bold'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                </div>
                {item.badge !== null && (
                  <span
                    className={`absolute -top-1 -right-2 min-w-[16px] h-[16px] rounded-full text-[9px] font-black flex items-center justify-center px-1 shadow ${
                      item.badgeColor || 'bg-sky-500 text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'font-black text-sky-700 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300 font-bold'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-sky-600 dark:bg-sky-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
