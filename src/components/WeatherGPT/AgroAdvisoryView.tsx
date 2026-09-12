import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  RefreshCw,
  Bug,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  ThermometerSun,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { AgroAdvisoryData, CropAdvisory } from '../../types';

interface AgroAdvisoryViewProps {
  data: AgroAdvisoryData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onAskWeatherGPT: (query: string) => void;
}

export const AgroAdvisoryView: React.FC<AgroAdvisoryViewProps> = ({
  data,
  isLoading,
  onRefresh,
  onAskWeatherGPT,
}) => {
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<'All' | 'Rabi' | 'Kharif' | 'Annual'>('All');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  if (isLoading && !data) {
    return (
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 text-center space-y-4">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Computing Agrometeorological Advisories</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Calculating FAO-56 Penman-Monteith reference evapotranspiration (ET0), chemical spray drift risk, and crop phenology stress...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Agricultural Advisory Unavailable</h3>
        <p className="text-xs text-slate-400">Unable to load soil moisture and crop advisory feeds.</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
        </button>
      </div>
    );
  }

  const {
    evapotranspirationEt0Mm,
    soilMoistureIndexPct,
    sprayWindowSuitability,
    irrigationAdvice,
    heatFrostStress,
    crops,
    locationName,
  } = data;

  const filteredCrops = selectedSeasonFilter === 'All'
    ? crops
    : crops.filter((c) => c.season === selectedSeasonFilter || (selectedSeasonFilter === 'Rabi' && c.season === 'Annual'));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/20 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MoES · IMD Gramin Krishi Mausam Sewa (GKMS)
              </span>
              <span className="text-xs text-slate-400 font-mono">Location: {locationName}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              Kisan Agrometeorological & Crop Advisory System
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Scientific farming guidance aligning daily weather forecasts with crop phenology, <strong>chemical spray windows</strong>, <strong>FAO-56 reference evapotranspiration (ET0)</strong>, and <strong>pest disease vulnerability</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => onAskWeatherGPT(`Mujhe ${locationName} ke kisan ke roop me agle 3 din ka fasal spray aur sinchai (irrigation) advisory Hindi me batayein.`)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              किसान AI से पूछें
            </button>
          </div>
        </div>
      </div>

      {/* Agromet Primary Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Spray Window Suitability */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" /> Spray Window
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                sprayWindowSuitability.isFavorable
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}
            >
              {sprayWindowSuitability.isFavorable ? 'FAVORABLE' : 'UNFAVORABLE'}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">{sprayWindowSuitability.score}</span>
              <span className="text-xs text-slate-400">/ 100 Suitability</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              <strong>Best Window:</strong> {sprayWindowSuitability.bestWindow}
            </p>
            {sprayWindowSuitability.limitingFactor && (
              <p className="text-[11px] text-amber-300/90 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                {sprayWindowSuitability.limitingFactor}
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Reference Evapotranspiration (ET0) */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> FAO-56 ET0
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Penman-Monteith</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">{evapotranspirationEt0Mm}</span>
              <span className="text-xs text-slate-400">mm / day loss</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              Atmospheric water demand rate from standard grass reference surface under ambient solar radiation.
            </p>
          </div>
        </div>

        {/* Card 3: Soil Moisture Index */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" /> Soil Moisture
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Top 0-20 cm</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">{soilMoistureIndexPct}%</span>
              <span className="text-xs text-slate-400 font-medium">Available Cap</span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${
                  soilMoistureIndexPct < 40 ? 'bg-amber-500' : soilMoistureIndexPct < 75 ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${soilMoistureIndexPct}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {soilMoistureIndexPct < 40 ? 'Depleted · Irrigation required' : 'Adequate root-zone moisture'}
            </p>
          </div>
        </div>

        {/* Card 4: Irrigation Recommendation */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-400" /> Sinchai (Irrigation)
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                irrigationAdvice.needed
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {irrigationAdvice.needed ? 'RECOMMENDED' : 'POSTPONE'}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">{irrigationAdvice.volumeMm} mm</span>
              <span className="text-xs text-slate-400">Target depth</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              <strong>Timing:</strong> {irrigationAdvice.timing}
            </p>
          </div>
        </div>
      </div>

      {/* Indian Crop Phenology & Pest Advisory Grid */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Major Crop Advisories & Pest Vulnerability Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Phenological stage tracking and microclimate pest/disease warnings for current agricultural cycle.
            </p>
          </div>

          {/* Season Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-white/5">
            {(['All', 'Rabi', 'Kharif', 'Annual'] as const).map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeasonFilter(season)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedSeasonFilter === season ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* Crop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map((crop, idx) => {
            const isSelected = selectedCrop === crop.cropName;
            return (
              <div
                key={idx}
                className={`bg-slate-950/70 border rounded-2xl p-4 space-y-3 transition-all ${
                  isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{crop.cropName}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-slate-300 font-mono">
                        {crop.season}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-medium mt-0.5">
                      Stage: {crop.currentStage}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      crop.suitabilityRating === 'optimal'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : crop.suitabilityRating === 'favorable'
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        : crop.suitabilityRating === 'moderate'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {crop.suitabilityRating}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                  {crop.advisoryNote}
                </p>

                {/* Pest & Disease Alert Box */}
                <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                      <Bug className="w-3.5 h-3.5 text-rose-400" />
                      {crop.pestDiseaseRisk.pestName}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono ${
                      crop.pestDiseaseRisk.riskLevel === 'high' || crop.pestDiseaseRisk.riskLevel === 'severe'
                        ? 'bg-rose-500/30 text-rose-200'
                        : 'bg-amber-500/30 text-amber-200'
                    }`}>
                      {(crop.pestDiseaseRisk?.riskLevel || 'moderate').toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Trigger:</strong> {crop.pestDiseaseRisk.triggerCondition}
                  </div>
                  <div className="text-[11px] text-emerald-300/90">
                    <strong className="text-emerald-200">Protocol:</strong> {crop.pestDiseaseRisk.preventiveMeasure}
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => onAskWeatherGPT(`Tell me the detailed agrometeorological management steps for ${crop.cropName} (${crop.currentStage}) in ${locationName}, including prevention against ${crop.pestDiseaseRisk.pestName}.`)}
                  className="w-full py-2 bg-white/[0.03] hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/5 rounded-xl text-xs text-slate-300 hover:text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Ask Kisan AI for {crop.cropName} <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
