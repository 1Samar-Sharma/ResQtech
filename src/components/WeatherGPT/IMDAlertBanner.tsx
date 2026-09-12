import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { IMDColorAlert } from '../../types';

interface IMDAlertBannerProps {
  alerts: IMDColorAlert[];
  onOpenImdTab: () => void;
  onAskWeatherGPT: (query: string) => void;
}

export const IMDAlertBanner: React.FC<IMDAlertBannerProps> = ({
  alerts,
  onOpenImdTab,
  onAskWeatherGPT,
}) => {
  if (!alerts || alerts.length === 0) return null;

  // Prioritize highest severity: red > orange > yellow > green
  const priorityOrder = { red: 4, orange: 3, yellow: 2, green: 1 };
  const topAlert = [...alerts].sort((a, b) => (priorityOrder[b.colorCode] || 0) - (priorityOrder[a.colorCode] || 0))[0];

  if (!topAlert) return null;

  const isWarningActive = topAlert.colorCode === 'red' || topAlert.colorCode === 'orange' || topAlert.colorCode === 'yellow';

  const getStyle = () => {
    switch (topAlert.colorCode) {
      case 'red':
        return {
          wrapper: 'bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/80 border-rose-500/60 shadow-lg shadow-rose-950/50',
          badge: 'bg-rose-500 text-white font-black animate-pulse',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />,
          accent: 'text-rose-300',
        };
      case 'orange':
        return {
          wrapper: 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/80 border-amber-500/60 shadow-lg shadow-amber-950/40',
          badge: 'bg-amber-500 text-slate-950 font-black',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
          accent: 'text-amber-300',
        };
      case 'yellow':
        return {
          wrapper: 'bg-gradient-to-r from-yellow-950/80 via-slate-900 to-yellow-950/60 border-yellow-500/40',
          badge: 'bg-yellow-400 text-slate-950 font-black',
          icon: <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />,
          accent: 'text-yellow-300',
        };
      case 'green':
      default:
        return {
          wrapper: 'bg-slate-900/80 border-white/10',
          badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
          accent: 'text-emerald-300',
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`w-full rounded-2xl border px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${style.wrapper}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        {style.icon}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider whitespace-nowrap ${style.badge}`}>
            {topAlert.colorLabel}
          </span>
          <span className="text-xs text-white font-medium truncate max-w-xl">
            {topAlert.headline}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
        {isWarningActive && (
          <button
            onClick={() => onAskWeatherGPT(`What does the IMD ${topAlert.colorLabel} mean for my safety today, and what precautions should I take?`)}
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3" /> Ask Safety Protocol
          </button>
        )}
        <button
          onClick={onOpenImdTab}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
        >
          Details <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
