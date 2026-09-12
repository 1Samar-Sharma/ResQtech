import React from 'react';
import { Home, Sparkles, CloudSun, AlertTriangle, HeartHandshake, Compass } from 'lucide-react';
import { soundPlayer } from '../../utils/audio';

export type MainNavTab = 'home' | 'ask' | 'forecast' | 'alerts' | 'help' | 'map';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: MainNavTab) => void;
  activeAlertCount?: number;
  openHelpRequestCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  activeAlertCount = 0,
  openHelpRequestCount = 0,
}) => {
  const navItems = [
    {
      id: 'home' as MainNavTab,
      label: 'HOME',
      icon: Home,
      badge: null,
      isPrimaryAction: false,
    },
    {
      id: 'ask' as MainNavTab,
      label: 'ASK',
      icon: Sparkles,
      badge: null,
      isPrimaryAction: true,
    },
    {
      id: 'forecast' as MainNavTab,
      label: 'FORECAST',
      icon: CloudSun,
      badge: null,
      isPrimaryAction: false,
    },
    {
      id: 'alerts' as MainNavTab,
      label: 'ALERTS',
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : null,
      badgeColor: 'bg-amber-500 text-slate-950',
      isPrimaryAction: false,
    },
    {
      id: 'help' as MainNavTab,
      label: 'HELP',
      icon: HeartHandshake,
      badge: openHelpRequestCount > 0 ? openHelpRequestCount : null,
      badgeColor: 'bg-emerald-500 text-slate-950',
      isPrimaryAction: false,
    },
  ];

  const handleSelectTab = (tabId: MainNavTab) => {
    soundPlayer.playBeep(640, 0.04);
    onTabChange(tabId);
  };

  return (
    <nav
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#060c18]/95 backdrop-blur-2xl border-t border-white/10 md:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.25rem)' }}
      aria-label="Main Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center justify-items-center px-1 py-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'help' && activeTab === 'mutual_aid') ||
            (item.id === 'alerts' && activeTab === 'early_warning') ||
            (item.id === 'ask' && activeTab === 'weather_gpt_chat');

          if (item.isPrimaryAction) {
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className="relative -top-2 flex flex-col items-center justify-center group focus:outline-none"
                aria-label="Ask WeatherGPT AI"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-tr from-sky-400 via-blue-500 to-sky-300 text-slate-950 scale-105 shadow-sky-500/40 border-2 border-white'
                      : 'bg-gradient-to-tr from-sky-500/80 to-blue-600/80 text-white shadow-sky-950/60 border border-sky-400/40 hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-wider mt-0.5 transition-colors ${
                    isActive ? 'text-sky-300' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center justify-center w-full py-1.5 px-1 rounded-xl transition-all relative focus:outline-none ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-sky-400 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-[15px] h-[15px] rounded-full text-[9px] font-black flex items-center justify-center px-1 shadow ${
                      item.badgeColor || 'bg-sky-500 text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider mt-1 transition-colors ${
                  isActive ? 'text-white font-black' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-sky-400 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
