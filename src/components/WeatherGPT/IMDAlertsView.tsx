import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Info,
  ArrowUpRight,
  Send,
  Users,
  Compass,
  FileText,
  Volume2,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { IMDColorAlert, IMDColorCode, AidCategory } from '../../types';

interface IMDAlertsViewProps {
  alerts: IMDColorAlert[];
  isLoading: boolean;
  locationName: string;
  onRefresh: () => void;
  onAskWeatherGPT: (query: string) => void;
  onLaunchBroadcastModal?: (initialData?: any) => void;
  onOpenAidRequestModal?: (category?: AidCategory, description?: string) => void;
}

export const IMDAlertsView: React.FC<IMDAlertsViewProps> = ({
  alerts,
  isLoading,
  locationName,
  onRefresh,
  onAskWeatherGPT,
  onLaunchBroadcastModal,
  onOpenAidRequestModal,
}) => {
  const [selectedColorFilter, setSelectedColorFilter] = useState<'all' | IMDColorCode>('all');
  const [simulatedColor, setSimulatedColor] = useState<IMDColorCode | null>(null);

  // Default synthetic alerts if array is empty
  const defaultGreenAlert: IMDColorAlert = {
    id: 'imd-green-base',
    colorCode: 'green',
    colorLabel: 'GREEN (No Warning)',
    headline: `Normal Meteorological Conditions Prevailing across ${locationName}`,
    hazardCategory: 'heavy_rainfall',
    affectedArea: locationName,
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 86400000).toISOString(),
    criteriaThresholdMet: 'No threshold exceedances (>64.5mm rain, >40°C heat, or >45km/h wind) recorded.',
    capSeverity: 'Minor',
    capUrgency: 'Future',
    capCertainty: 'Observed',
    instructions: [
      'Normal civic, commercial, and agricultural operations may proceed as planned.',
      'Regular monitoring of IMD national bulletins and local WeatherGPT nowcasts.',
      'Ensure standard household backup batteries and water storage are maintained.',
    ],
    civilianMutualAidAction: 'Baseline state. Community volunteers maintain standard gear readiness.',
  };

  const activeAlertList = alerts.length > 0 ? alerts : [defaultGreenAlert];

  // If simulation is selected, override display
  const displayedAlerts = simulatedColor
    ? [
        {
          id: `sim-${simulatedColor}`,
          colorCode: simulatedColor,
          colorLabel:
            simulatedColor === 'red'
              ? 'RED (Take Action)'
              : simulatedColor === 'orange'
              ? 'ORANGE (Be Prepared)'
              : simulatedColor === 'yellow'
              ? 'YELLOW (Be Updated)'
              : 'GREEN (No Warning)',
          headline:
            simulatedColor === 'red'
              ? `Extremely Heavy Rainfall & Flash Flood Emergency (>204.4 mm / 24h) for ${locationName}`
              : simulatedColor === 'orange'
              ? `Very Heavy Rainfall (115.6 - 204.4 mm) & Squally Winds for ${locationName}`
              : simulatedColor === 'yellow'
              ? `Heavy Rainfall Watch (64.5 - 115.5 mm) & Isolated Thunderstorms for ${locationName}`
              : `Normal Baseline Meteorological Conditions for ${locationName}`,
          hazardCategory: 'heavy_rainfall' as const,
          affectedArea: `${locationName} Sector and adjacent districts`,
          validFrom: new Date().toISOString(),
          validTo: new Date(Date.now() + 86400000).toISOString(),
          criteriaThresholdMet:
            simulatedColor === 'red'
              ? 'Rainfall > 204.4 mm in 24h with saturated soil runoff index > 85%'
              : simulatedColor === 'orange'
              ? 'Rainfall between 115.6 mm and 204.4 mm with gale winds > 50 km/h'
              : simulatedColor === 'yellow'
              ? 'Precipitation 64.5 - 115.5 mm with convective lightning strikes'
              : 'Normal parameters.',
          capSeverity: simulatedColor === 'red' ? 'Extreme' : simulatedColor === 'orange' ? 'Severe' : simulatedColor === 'yellow' ? 'Moderate' : 'Minor',
          capUrgency: simulatedColor === 'red' ? 'Immediate' : simulatedColor === 'orange' ? 'Expected' : 'Future',
          capCertainty: 'Likely' as const,
          instructions:
            simulatedColor === 'red'
              ? [
                  'Avoid all non-emergency movement. Move to designated high-ground shelters.',
                  'District Disaster Management Authority (DDMA) activates 24x7 control room.',
                  'Do NOT cross waterlogged culverts or low-lying railway subways.',
                  'Keep emergency grab-and-go kits ready with medicines, dry rations, and torch.',
                ]
              : simulatedColor === 'orange'
              ? [
                  'Keep emergency go-bags ready; secure temporary structures and zinc roofs.',
                  'Farmers must clear drainage channels in standing crops to prevent submergence.',
                  'Fishermen advised not to venture into deep sea within 12 nautical miles.',
                ]
              : simulatedColor === 'yellow'
              ? [
                  'Stay tuned to local WeatherGPT updates and district radio broadcasts.',
                  'Check property storm drains and secure lightweight outdoor objects.',
                ]
              : [
                  'Normal civic and agricultural operations may proceed as planned.',
                  'Regular monitoring of IMD national bulletins and local WeatherGPT nowcasts.',
                ],
          civilianMutualAidAction:
            simulatedColor === 'red'
              ? 'Urgent activation of 4x4 rescue drivers, community boat staging, and dry ration distribution.'
              : simulatedColor === 'orange'
              ? 'Stage sandbags along low-lying housing clusters; inspect elderly welfare.'
              : undefined,
        },
      ]
    : selectedColorFilter === 'all'
    ? activeAlertList
    : activeAlertList.filter((a) => a.colorCode === selectedColorFilter);

  const getColorStyles = (color: IMDColorCode) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-rose-950/60 border-rose-500/50',
          badge: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30',
          indicator: 'bg-rose-500',
          glow: 'from-rose-500/20 to-transparent',
          text: 'text-rose-400',
        };
      case 'orange':
        return {
          bg: 'bg-amber-950/60 border-amber-500/50',
          badge: 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-black',
          indicator: 'bg-amber-500',
          glow: 'from-amber-500/20 to-transparent',
          text: 'text-amber-400',
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-950/40 border-yellow-500/40',
          badge: 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20 font-black',
          indicator: 'bg-yellow-400',
          glow: 'from-yellow-500/10 to-transparent',
          text: 'text-yellow-400',
        };
      case 'green':
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/30',
          badge: 'bg-emerald-500 text-slate-950 font-bold',
          indicator: 'bg-emerald-400',
          glow: 'from-emerald-500/10 to-transparent',
          text: 'text-emerald-400',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                MoES · IMD · NDMA Early Warning
              </span>
              <span className="text-xs text-slate-400 font-mono">ITU-T / OASIS CAP Protocol</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Official IMD 4-Stage Color Coded Warning System
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Standardized meteorological risk classification conforming to <strong>India Meteorological Department SOPs</strong> and the international <strong>Common Alerting Protocol (CAP)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Sync IMD Feeds
            </button>
            <button
              onClick={() => onAskWeatherGPT(`Explain the current IMD color warning code for ${locationName} and what immediate safety measures citizens should take.`)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explain Warning
            </button>
          </div>
        </div>
      </div>

      {/* Interactive 4-Stage Standard Reference & Simulation Bar */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              IMD 4-Stage Warning Criteria & Threshold Definition
            </h3>
            <p className="text-[11px] text-slate-400">
              Click any stage below to inspect its official threshold and action directive:
            </p>
          </div>

          {simulatedColor && (
            <button
              onClick={() => setSimulatedColor(null)}
              className="text-xs text-sky-400 hover:text-sky-300 font-bold underline"
            >
              Reset to Live Feeds
            </button>
          )}
        </div>

        {/* 4 Color Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* GREEN */}
          <div
            onClick={() => setSimulatedColor(simulatedColor === 'green' ? null : 'green')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              simulatedColor === 'green'
                ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950/60 border-white/5 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950">
                STAGE 1 · GREEN
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">No Warning</span>
            </div>
            <div className="text-xs font-bold text-white">Normal Baseline</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Rain &lt; 64.5 mm, Winds &lt; 45 km/h. No adverse weather anticipated.
            </div>
          </div>

          {/* YELLOW */}
          <div
            onClick={() => setSimulatedColor(simulatedColor === 'yellow' ? null : 'yellow')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              simulatedColor === 'yellow'
                ? 'bg-yellow-500/20 border-yellow-400 shadow-lg shadow-yellow-400/20'
                : 'bg-slate-950/60 border-white/5 hover:border-yellow-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-yellow-400 text-slate-950">
                STAGE 2 · YELLOW
              </span>
              <span className="text-[10px] text-yellow-400 font-mono">Watch</span>
            </div>
            <div className="text-xs font-bold text-white">Be Updated</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Rain 64.5 - 115.5 mm. Moderately bad weather likely; monitor updates.
            </div>
          </div>

          {/* ORANGE */}
          <div
            onClick={() => setSimulatedColor(simulatedColor === 'orange' ? null : 'orange')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              simulatedColor === 'orange'
                ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/60 border-white/5 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                STAGE 3 · ORANGE
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Alert</span>
            </div>
            <div className="text-xs font-bold text-white">Be Prepared</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Rain 115.6 - 204.4 mm. Severe disruptions likely; secure belongings.
            </div>
          </div>

          {/* RED */}
          <div
            onClick={() => setSimulatedColor(simulatedColor === 'red' ? null : 'red')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              simulatedColor === 'red'
                ? 'bg-rose-500/20 border-rose-500 shadow-lg shadow-rose-500/20'
                : 'bg-slate-950/60 border-white/5 hover:border-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                STAGE 4 · RED
              </span>
              <span className="text-[10px] text-rose-400 font-mono">Warning</span>
            </div>
            <div className="text-xs font-bold text-white">Take Action</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Rain &gt; 204.4 mm, winds &gt; 65 km/h. Life & property risk; evacuate low areas.
            </div>
          </div>
        </div>
      </div>

      {/* Active IMD Alert Cards Display */}
      <div className="space-y-4">
        {displayedAlerts.map((alert) => {
          const style = getColorStyles(alert.colorCode);
          return (
            <div
              key={alert.id}
              className={`border rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all ${style.bg}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-mono ${style.badge}`}>
                      {alert.colorLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300 font-mono">
                      CAP: {alert.capSeverity} · {alert.capUrgency}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {alert.affectedArea}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug pt-1">
                    {alert.headline}
                  </h3>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono flex-shrink-0">
                  <div className="flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3.5 h-3.5" /> Valid Thru:
                  </div>
                  <div className="text-slate-200 font-bold">
                    {new Date(alert.validTo).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Threshold Criteria Met Box */}
              <div className="mt-4 bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  Meteorological Criteria Threshold Met:
                </div>
                <div className="text-xs text-slate-200 font-medium leading-relaxed">
                  {alert.criteriaThresholdMet}
                </div>
              </div>

              {/* Official Instructions */}
              <div className="mt-4 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Mandatory Action Directives:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {alert.instructions.map((inst, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 text-xs text-slate-200 flex items-start gap-2"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${style.text}`} />
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Aid Trigger & Actions */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                {alert.civilianMutualAidAction ? (
                  <div className="text-xs text-amber-300 flex items-center gap-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span><strong>Civic Relief Action:</strong> {alert.civilianMutualAidAction}</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    No immediate civic evacuation or sandbag staging required for this level.
                  </div>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onLaunchBroadcastModal && (
                    <button
                      onClick={() =>
                        onLaunchBroadcastModal({
                          title: alert.headline,
                          message: `[IMD ${(alert.colorLabel || alert.colorCode || 'Warning').toUpperCase()}]: ${alert.criteriaThresholdMet || ''}. Action: ${alert.instructions?.[0] || 'Take necessary precautions'}`,
                          severity: alert.colorCode === 'red' ? 'emergency' : alert.colorCode === 'orange' ? 'warning' : 'advisory',
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/15 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors flex-1 sm:flex-initial"
                    >
                      <Radio className="w-3.5 h-3.5 text-rose-400" />
                      Broadcast Alert
                    </button>
                  )}

                  {onOpenAidRequestModal && alert.colorCode !== 'green' && (
                    <button
                      onClick={() =>
                        onOpenAidRequestModal('evacuation_transport', `Requesting support due to IMD ${alert.colorLabel}: ${alert.headline}`)
                      }
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors flex-1 sm:flex-initial"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Request Mutual Aid
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
