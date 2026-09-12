import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Clock,
  Radio,
  Send,
  Sparkles,
  ChevronRight,
  HeartHandshake,
  Languages,
  CheckCircle2,
  ExternalLink,
  Flame,
  Waves,
  Wind,
  Mountain,
} from 'lucide-react';
import { DisasterAlert, IMDColorAlert, Coordinates } from '../../types';
import { IMDAlertsView } from '../WeatherGPT/IMDAlertsView';
import { soundPlayer } from '../../utils/audio';

interface AlertsScreenProps {
  alerts: DisasterAlert[];
  imdAlerts: IMDColorAlert[];
  userLocation: Coordinates;
  userAddress: string;
  onTranslateAlert?: (message: string, languages: string[]) => Promise<any>;
  onAskWeatherGPT?: (query: string, persona?: string) => void;
  onLaunchBroadcastModal?: (initialData?: any) => void;
  onOpenAidRequestModal?: (category?: any, description?: string) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts = [],
  imdAlerts = [],
  userLocation,
  userAddress,
  onTranslateAlert,
  onAskWeatherGPT,
  onLaunchBroadcastModal,
  onOpenAidRequestModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'imd' | 'telemetry'>('all');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<'all' | 'severe' | 'warning' | 'normal'>('all');

  // Multi-hazard alert severity helper
  const getSeverityTier = (severity?: string): 'severe' | 'warning' | 'normal' => {
    const s = (severity || '').toLowerCase();
    if (s.includes('critical') || s.includes('emergency') || s.includes('severe') || s === 'red' || s.includes('action')) {
      return 'severe';
    }
    if (s.includes('high') || s.includes('warning') || s.includes('moderate') || s === 'orange' || s === 'yellow' || s.includes('prepared') || s.includes('updated')) {
      return 'warning';
    }
    return 'normal';
  };

  const getSeverityBadge = (tier: 'severe' | 'warning' | 'normal', label?: string) => {
    const badgeText = (label || tier || 'Alert').toUpperCase();
    switch (tier) {
      case 'severe':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>SEVERE • {badgeText}</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>WARNING • {badgeText}</span>
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>ADVISORY • {badgeText}</span>
          </span>
        );
    }
  };

  const getCardStyle = (tier: 'severe' | 'warning' | 'normal') => {
    switch (tier) {
      case 'severe':
        return 'bg-gradient-to-br from-rose-950/40 via-rose-950/20 to-slate-900 border-2 border-rose-500/50 shadow-xl shadow-rose-950/30';
      case 'warning':
        return 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border-2 border-amber-500/40 shadow-lg';
      case 'normal':
      default:
        return 'bg-slate-900/80 border border-white/10 shadow-md';
    }
  };

  // Filter alerts
  const filteredDisasterAlerts = alerts.filter((alert) => {
    if (selectedSeverityFilter === 'all') return true;
    return getSeverityTier(alert.severity) === selectedSeverityFilter;
  });

  const filteredImdAlerts = imdAlerts.filter((alert: any) => {
    if (selectedSeverityFilter === 'all') return true;
    return getSeverityTier(alert.colorCode || alert.colorLevel || alert.capSeverity) === selectedSeverityFilter;
  });

  const totalActive = alerts.length + imdAlerts.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 px-3 sm:px-4 animate-fadeIn">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <span>Severe Weather & Disaster Alerts</span>
            </h1>
            {totalActive > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black">
                {totalActive} Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            IMD 4-Stage Color Warnings & Multi-Hazard Sensor Telemetry for {userAddress}
          </p>
        </div>

        {/* Severity Legend Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedSeverityFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedSeverityFilter === 'all'
                ? 'bg-white text-slate-950'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedSeverityFilter('severe')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedSeverityFilter === 'severe'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
            }`}
          >
            Severe (Red)
          </button>
          <button
            onClick={() => setSelectedSeverityFilter('warning')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedSeverityFilter === 'warning'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            Warning (Orange/Yellow)
          </button>
          <button
            onClick={() => setSelectedSeverityFilter('normal')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedSeverityFilter === 'normal'
                ? 'bg-sky-500 text-slate-950'
                : 'bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/30'
            }`}
          >
            Normal (Green)
          </button>
        </div>
      </header>

      {/* Main Alert List */}
      <div className="space-y-5">
        {/* 1. IMD 4-Stage Color Warnings (Official Meteorological Warnings) */}
        {filteredImdAlerts.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
              Official IMD Color Advisories ({filteredImdAlerts.length})
            </h2>

            <div className="space-y-4">
              {filteredImdAlerts.map((alert: any) => {
                const tier = getSeverityTier(alert.colorCode || alert.colorLevel || alert.capSeverity);
                return (
                  <div
                    key={alert.id}
                    className={`rounded-3xl p-5 sm:p-6 transition-all space-y-4 ${getCardStyle(tier)}`}
                  >
                    {/* Top Row: Severity + Time */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(tier, alert.colorLabel || alert.colorCode || alert.colorLevel)}
                        <span className="text-xs font-bold text-slate-300 uppercase">
                          IMD Grounded
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Valid: {alert.validTo || alert.validUntil || 'Active'}</span>
                      </div>
                    </div>

                    {/* Prominent WHAT, WHERE, WHEN Breakdown */}
                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">
                        <span className="font-bold text-slate-300 uppercase tracking-wide">WHAT:</span>
                        <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                          {alert.headline || alert.description}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                        <div>
                          <strong className="text-slate-400">WHERE:</strong>{' '}
                          <span className="text-white font-semibold">
                            {alert.affectedArea || alert.district || userAddress}
                            {alert.state ? `, ${alert.state}` : ''}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-400">WHEN:</strong>{' '}
                          <span className="text-white">{alert.validFrom || alert.issuedAt || 'Active Now'}</span>
                        </div>
                      </div>
                    </div>

                    {/* WHAT TO DO: Actionable Citizen Checklist */}
                    {((alert.instructions && alert.instructions.length > 0) || (alert.actionProtocol && alert.actionProtocol.length > 0)) && (
                      <div className="rounded-2xl bg-black/30 border border-white/10 p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-300 tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>WHAT TO DO (Safety Protocol):</span>
                        </div>
                        <ul className="space-y-1.5">
                          {(alert.instructions || alert.actionProtocol || []).map((action: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Triggers */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                      {onAskWeatherGPT && (
                        <button
                          onClick={() => {
                            soundPlayer.playBeep(640, 0.04);
                            onAskWeatherGPT(
                              `What are the immediate safety precautions and evacuation triggers for this alert: ${alert.headline || alert.description}?`,
                              'sdma'
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                          <span>Ask WeatherGPT About This</span>
                        </button>
                      )}

                      {onLaunchBroadcastModal && (
                        <button
                          onClick={() => {
                            onLaunchBroadcastModal({
                              title: `Severe Advisory: ${alert.headline}`,
                              description: alert.description,
                              category: 'storm',
                              urgency: tier === 'severe' ? 'critical_urgent' : 'high',
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Radio className="w-3.5 h-3.5 text-red-400" />
                          <span>Broadcast 5km Signal</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. Hydrological & Geological Disaster Alerts */}
        {filteredDisasterAlerts.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
              Multi-Hazard Telemetry Alerts ({filteredDisasterAlerts.length})
            </h2>

            <div className="space-y-4">
              {filteredDisasterAlerts.map((alert) => {
                const tier = getSeverityTier(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className={`rounded-3xl p-5 sm:p-6 transition-all space-y-4 ${getCardStyle(tier)}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(tier, alert.severity)}
                        <span className="text-xs font-bold text-slate-300 uppercase">
                          {alert.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{alert.timestamp || 'Active Now'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">
                        <span className="font-bold text-slate-300 uppercase tracking-wide">WHAT:</span>
                        <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                          {alert.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">{alert.description}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                        <div>
                          <strong className="text-slate-400">WHERE:</strong>{' '}
                          <span className="text-white font-semibold">{alert.locationName}</span> (Radius: {Math.round(alert.radiusMeters / 1000)} km)
                        </div>
                        <div>
                          <strong className="text-slate-400">AFFECTED POPULATION:</strong>{' '}
                          <span className="text-white font-semibold">~{alert.affectedPopulation.toLocaleString()} people</span>
                        </div>
                      </div>
                    </div>

                    {/* WHAT TO DO */}
                    {alert.recommendedActions && alert.recommendedActions.length > 0 && (
                      <div className="rounded-2xl bg-black/30 border border-white/10 p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-300 tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>WHAT TO DO (Recommended Protocol):</span>
                        </div>
                        <ul className="space-y-1.5">
                          {alert.recommendedActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 1-Click Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                      {onAskWeatherGPT && (
                        <button
                          onClick={() => {
                            onAskWeatherGPT(
                              `Explain emergency guidelines and route safety for: ${alert.title} at ${alert.locationName}.`,
                              'sdma'
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                          <span>Consult WeatherGPT</span>
                        </button>
                      )}

                      {onOpenAidRequestModal && (
                        <button
                          onClick={() => {
                            onOpenAidRequestModal('shelter', `Alert response: Requesting aid for ${alert.title}`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                          <span>Request Aid for this Area</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* If no alerts at all */}
        {totalActive === 0 && (
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Severe Weather Alerts Active</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Atmospheric telemetry and IMD radar grids currently report baseline conditions for {userAddress}. Continuous monitoring is enabled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
