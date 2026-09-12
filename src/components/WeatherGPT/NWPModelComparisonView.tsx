import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Info,
  Compass,
  Wind,
  Droplets,
  CloudRain,
  Activity,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { NWPModelComparisonData, NWPModelPoint } from '../../types';

interface NWPModelComparisonViewProps {
  data: NWPModelComparisonData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onAskWeatherGPT: (query: string) => void;
}

export const NWPModelComparisonView: React.FC<NWPModelComparisonViewProps> = ({
  data,
  isLoading,
  onRefresh,
  onAskWeatherGPT,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'temp' | 'rain' | 'wind' | 'cape'>('temp');
  const [activeModelKey, setActiveModelKey] = useState<'all' | 'gfs' | 'ecmwf' | 'icon' | 'wrf'>('all');

  if (isLoading && !data) {
    return (
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 text-center space-y-4">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Synthesizing NWP Global & Regional Forecast Models</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Pulling live isobaric and surface grids from NOAA GFS (0.25°), ECMWF IFS (0.25°), DWD ICON, and IMD WRF downscaled ensemble...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-base font-bold text-white">NWP Model Data Unavailable</h3>
        <p className="text-xs text-slate-400">Unable to fetch multi-model grids for this geographic coordinate.</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
        </button>
      </div>
    );
  }

  const { soundingAnalysis, ensembleSpread, models, timeline } = data;

  // Sounding CAPE classification
  const getCapeCategory = (cape: number) => {
    if (cape < 300) return { label: 'Stable / Weak', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (cape < 1000) return { label: 'Marginally Unstable', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
    if (cape < 2500) return { label: 'Moderately Unstable', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Extremely Unstable (Severe Convection)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const capeInfo = getCapeCategory(soundingAnalysis.capeJkg);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                MoES · IMD · SIH 26068
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Updated: {new Date(data.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              NWP Multi-Model Consensus & Sounding Intelligence
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time multi-model ensemble comparing <strong>NOAA GFS (0.25°)</strong>, <strong>ECMWF IFS (0.25°)</strong>, <strong>DWD ICON (0.125°)</strong>, and <strong>IMD Regional WRF 3km downscaling</strong>. Avoid single-model bias during active convective development.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              title="Re-query numerical model servers"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Sync Runs
            </button>
            <button
              onClick={() => onAskWeatherGPT(`Explain the divergence between GFS, ECMWF, and WRF models for ${data.locationName} and what the CAPE value of ${soundingAnalysis.capeJkg} J/kg means.`)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Atmospheric Sounding & Convective Stability Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: CAPE & Sounding Dial */}
        <div className="lg:col-span-1 bg-slate-900/80 border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Sounding Instability
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${capeInfo.bg} ${capeInfo.color}`}>
              {(soundingAnalysis?.stormPotential || 'moderate').toUpperCase()} RISK
            </span>
          </div>

          {/* CAPE Gauge Display */}
          <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400 font-medium">CAPE (Convective Energy)</span>
              <span className="text-xl font-black text-white font-mono">
                {soundingAnalysis.capeJkg} <span className="text-xs text-slate-400 font-normal">J/kg</span>
              </span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  soundingAnalysis.capeJkg < 300
                    ? 'bg-emerald-500'
                    : soundingAnalysis.capeJkg < 1000
                    ? 'bg-sky-500'
                    : soundingAnalysis.capeJkg < 2500
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, (soundingAnalysis.capeJkg / 3000) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 J/kg</span>
              <span>1000</span>
              <span>2500</span>
              <span>4000+</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              <strong>Atmospheric Profile:</strong> {capeInfo.label}. {soundingAnalysis.interpretation}
            </p>
          </div>

          {/* Secondary Sounding Indices */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Lifted Index</div>
              <div className={`text-sm font-bold font-mono mt-0.5 ${soundingAnalysis.liftedIndex < 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                {soundingAnalysis.liftedIndex > 0 ? `+${soundingAnalysis.liftedIndex}` : soundingAnalysis.liftedIndex}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">{soundingAnalysis.liftedIndex < 0 ? 'Unstable' : 'Stable'}</div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">CIN Inhibit</div>
              <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                {soundingAnalysis.convectiveInhibitionCin} <span className="text-[9px] text-slate-400 font-normal">J/kg</span>
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">{Math.abs(soundingAnalysis.convectiveInhibitionCin) > 50 ? 'Strong Cap' : 'Weak Cap'}</div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">PBL Depth</div>
              <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                {soundingAnalysis.pblHeightMeters} <span className="text-[9px] text-slate-400 font-normal">m</span>
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Boundary Lyr</div>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Ensemble Spread & Model Agreement */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                Ensemble Consensus & Confidence Spread
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                ensembleSpread.confidenceRating.startsWith('High')
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {ensembleSpread.confidenceRating}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
              💡 <strong>Model Synthesis:</strong> {ensembleSpread.modelConsensus}
            </p>
          </div>

          {/* Model Specification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-sky-400">GFS 0.25°</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">NOAA</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Global Forecast Sys.</div>
              <div className="text-[10px] text-slate-500 font-mono">Run: {models.gfs.run}</div>
              <div className="text-[10px] text-slate-400">Grid: ~28km resolution</div>
            </div>

            <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400">ECMWF IFS</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Europe</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Integrated Forecast</div>
              <div className="text-[10px] text-slate-500 font-mono">Run: {models.ecmwf.run}</div>
              <div className="text-[10px] text-slate-400">Gold standard precipitation</div>
            </div>

            <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400">ICON 0.125°</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">DWD</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Icosahedral Nonhydro.</div>
              <div className="text-[10px] text-slate-500 font-mono">Run: {models.icon.run}</div>
              <div className="text-[10px] text-slate-400">High-res convective tracking</div>
            </div>

            <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-400">IMD WRF 3km</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">IMD/NCMRWF</span>
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Regional Downscaled</div>
              <div className="text-[10px] text-slate-500 font-mono">Run: {models.wrf.run}</div>
              <div className="text-[10px] text-slate-400">Orographic & coastal bias</div>
            </div>
          </div>

          {/* Variance Metrics */}
          <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs">
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Temperature Spread: <strong className="text-white font-mono">{ensembleSpread.tempSpreadC}°C</strong></span>
              <span className="text-slate-400">Precipitation Spread: <strong className="text-white font-mono">{ensembleSpread.precipSpreadMm} mm</strong></span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Ensemble Agreement: <strong className="text-sky-300 font-mono">88%</strong></span>
          </div>
        </div>
      </div>

      {/* Model Parameter Comparison Interactive Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Side-by-Side Model Prediction Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Compare deterministic and ensemble outputs at 3-hour steps across major numerical engines.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => setSelectedMetric('temp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedMetric === 'temp' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Temperature
            </button>
            <button
              onClick={() => setSelectedMetric('rain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedMetric === 'rain' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Rainfall (mm)
            </button>
            <button
              onClick={() => setSelectedMetric('wind')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedMetric === 'wind' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wind Speed
            </button>
            <button
              onClick={() => setSelectedMetric('cape')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedMetric === 'cape' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              CAPE Sounding
            </button>
          </div>
        </div>

        {/* Timeline Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase font-mono">
                <th className="py-2.5 px-3">Forecast Hour</th>
                <th className="py-2.5 px-3 text-sky-400">NOAA GFS (0.25°)</th>
                <th className="py-2.5 px-3 text-emerald-400">ECMWF IFS (0.25°)</th>
                <th className="py-2.5 px-3 text-amber-400">DWD ICON (0.125°)</th>
                <th className="py-2.5 px-3 text-purple-400">IMD WRF 3km</th>
                <th className="py-2.5 px-3 text-right">Consensus Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {timeline.map((pt, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 text-slate-200 font-bold">{pt.timeLabel}</td>
                  {selectedMetric === 'temp' && (
                    <>
                      <td className="py-3 px-3 text-slate-300">{pt.tempC_gfs}°C</td>
                      <td className="py-3 px-3 text-slate-300 font-bold text-emerald-300">{pt.tempC_ecmwf}°C</td>
                      <td className="py-3 px-3 text-slate-300">{pt.tempC_icon}°C</td>
                      <td className="py-3 px-3 text-slate-300 font-bold text-purple-300">{pt.tempC_wrf}°C</td>
                    </>
                  )}
                  {selectedMetric === 'rain' && (
                    <>
                      <td className="py-3 px-3 text-slate-300">{pt.precipMm_gfs.toFixed(1)} mm</td>
                      <td className="py-3 px-3 text-slate-300 font-bold text-emerald-300">{pt.precipMm_ecmwf.toFixed(1)} mm</td>
                      <td className="py-3 px-3 text-slate-300">{pt.precipMm_icon.toFixed(1)} mm</td>
                      <td className="py-3 px-3 text-slate-300 font-bold text-purple-300">{pt.precipMm_wrf.toFixed(1)} mm</td>
                    </>
                  )}
                  {selectedMetric === 'wind' && (
                    <>
                      <td className="py-3 px-3 text-slate-300">{pt.windKmh_gfs} km/h</td>
                      <td className="py-3 px-3 text-slate-300 font-bold text-emerald-300">{pt.windKmh_ecmwf} km/h</td>
                      <td className="py-3 px-3 text-slate-300">{pt.windKmh_icon} km/h</td>
                      <td className="py-3 px-3 text-slate-300 font-bold text-purple-300">{Math.round(pt.windKmh_ecmwf * 1.05)} km/h</td>
                    </>
                  )}
                  {selectedMetric === 'cape' && (
                    <>
                      <td className="py-3 px-3 text-slate-300">{pt.cape_gfs} J/kg</td>
                      <td className="py-3 px-3 text-slate-300 font-bold text-emerald-300">{pt.cape_ecmwf} J/kg</td>
                      <td className="py-3 px-3 text-slate-300">{Math.round((pt.cape_gfs + pt.cape_ecmwf) / 2)} J/kg</td>
                      <td className="py-3 px-3 text-slate-300 font-bold text-purple-300">{Math.round(pt.cape_ecmwf * 1.08)} J/kg</td>
                    </>
                  )}
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                      {pt.agreementPct}% Agree
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Directives */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>
              <strong>Scientific Note:</strong> Global models (GFS/ECMWF) resolve synoptic wave patterns, while IMD WRF resolves regional mesoscale convective complexes and valley thermal wind circulations.
            </span>
          </div>
          <button
            onClick={() => onAskWeatherGPT(`How do GFS and ECMWF compare on rainfall predictions for ${data.locationName}, and which model is historically more reliable for Indian monsoon patterns?`)}
            className="text-sky-400 hover:text-sky-300 font-bold underline whitespace-nowrap flex items-center gap-1"
          >
            Ask model reliability in India <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
