import React, { useState } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Gauge,
  Compass,
  RefreshCw,
  MapPin,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Waves,
  Calendar,
  Layers,
  Sprout,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import {
  CurrentWeatherState,
  DailyWeatherForecast,
  HourlyWeatherForecast,
  Coordinates,
  NWPModelComparisonData,
  AgroAdvisoryData,
  ClimateTrendInsight,
} from '../../types';
import { NWPModelComparisonView } from '../WeatherGPT/NWPModelComparisonView';
import { AgroAdvisoryView } from '../WeatherGPT/AgroAdvisoryView';

interface ForecastScreenProps {
  userLocation: Coordinates;
  userAddress: string;
  isGpsLocked?: boolean;
  onRefreshLocation?: () => void;
  currentWeather: CurrentWeatherState | null;
  dailyForecast?: DailyWeatherForecast[];
  hourlyForecast?: HourlyWeatherForecast[];
  isLoadingForecast?: boolean;
  onRefreshForecast?: () => void;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  nwpData?: NWPModelComparisonData | null;
  isLoadingNwp?: boolean;
  onRefreshNwp?: () => void;
  agroData?: AgroAdvisoryData | null;
  isLoadingAgro?: boolean;
  onRefreshAgro?: () => void;
  climateTrends?: ClimateTrendInsight[];
  onAskWeatherGPT?: (query: string, persona?: string) => void;
}

export const ForecastScreen: React.FC<ForecastScreenProps> = ({
  userLocation,
  userAddress,
  isGpsLocked = false,
  onRefreshLocation,
  currentWeather,
  dailyForecast = [],
  hourlyForecast = [],
  isLoadingForecast = false,
  onRefreshForecast,
  unit,
  onToggleUnit,
  nwpData,
  isLoadingNwp = false,
  onRefreshNwp,
  agroData,
  isLoadingAgro = false,
  onRefreshAgro,
  climateTrends = [],
  onAskWeatherGPT,
}) => {
  const [activeSubView, setActiveSubView] = useState<'overview' | 'nwp' | 'agro' | 'climate'>('overview');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const formatTemp = (c?: number, f?: number) => {
    if (c === undefined) return '--';
    return unit === 'C' ? `${Math.round(c)}°C` : `${Math.round(f ?? (c * 9) / 5 + 32)}°F`;
  };

  const getWeatherIcon = (iconName?: string, className = 'w-8 h-8') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-400`} />;
      case 'cloud-rain':
        return <CloudRain className={`${className} text-sky-400`} />;
      case 'cloud-lightning':
        return <CloudLightning className={`${className} text-purple-400`} />;
      case 'wind':
        return <Wind className={`${className} text-teal-300`} />;
      case 'cloud-sun':
      default:
        return <CloudSun className={`${className} text-sky-300`} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 px-3 sm:px-4 animate-fadeIn">
      {/* Header with Location and Sub-tabs */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-sky-400" />
            <span>Weather & Forecast</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hyperlocal 5km Atmospheric Telemetry & Multi-Model Forecast
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs transition-all max-w-[170px] truncate"
            title="Click to detect current GPS location"
          >
            <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isGpsLocked ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="truncate font-semibold">{userAddress}</span>
          </button>

          <button
            onClick={onToggleUnit}
            className="px-2.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-bold transition-all"
          >
            {unit === 'C' ? '°C' : '°F'}
          </button>

          {onRefreshForecast && (
            <button
              onClick={onRefreshForecast}
              className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all"
              title="Refresh weather"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForecast ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          )}
        </div>
      </header>

      {/* Sub-view Navigation Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'overview' as const, label: 'Forecast Overview', icon: Calendar },
          { id: 'nwp' as const, label: 'Model Consensus (GFS vs ECMWF)', icon: Layers },
          { id: 'agro' as const, label: '🌾 Kisan Agro-Advisory', icon: Sprout },
          { id: 'climate' as const, label: '30-Yr Climate Trends', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubView(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: FORECAST OVERVIEW */}
      {activeSubView === 'overview' && (
        <div className="space-y-6">
          {/* Hero Current Weather Card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 p-5 sm:p-7 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-3xl bg-sky-500/15 border border-sky-500/25 text-sky-400">
                  {getWeatherIcon(currentWeather?.conditionIcon, 'w-14 h-14')}
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {formatTemp(currentWeather?.temperatureC, currentWeather?.temperatureF)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Feels like {formatTemp(currentWeather?.feelsLikeC, currentWeather?.feelsLikeF)}
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-200 mt-1">
                    {currentWeather?.condition || 'Clear Sky'} • {currentWeather?.conditionDescription || 'Normal Baseline'}
                  </p>
                </div>
              </div>

              {/* High / Low & Grounded Tag */}
              <div className="flex sm:flex-col sm:items-end justify-between text-xs text-slate-300 gap-1.5">
                <div className="flex items-center gap-3 font-bold text-sm">
                  <span>H: {formatTemp(dailyForecast?.[0]?.tempMaxC, dailyForecast?.[0]?.tempMaxF)}</span>
                  <span>L: {formatTemp(dailyForecast?.[0]?.tempMinC, dailyForecast?.[0]?.tempMinF)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>IMD & Open-Meteo Grounded</span>
                </div>
              </div>
            </div>

            {/* 6 Clean Restrained Weather Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-white/10">
              {/* Precipitation */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Rain</span>
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-base font-black text-white">
                  {currentWeather?.precipitationProbability ?? 10}%
                </div>
                <div className="text-[10px] text-slate-400">{(currentWeather?.precipitationMm || 0).toFixed(1)} mm</div>
              </div>

              {/* Wind */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Wind</span>
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div className="text-base font-black text-white">
                  {currentWeather?.windSpeedKmh || 12} km/h
                </div>
                <div className="text-[10px] text-slate-400">Dir: {currentWeather?.windDirection || 'W'}</div>
              </div>

              {/* Humidity */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Humidity</span>
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-base font-black text-white">
                  {currentWeather?.humidityPct || 55}%
                </div>
                <div className="text-[10px] text-slate-400">Dew: {currentWeather?.dewPointC || 14}°C</div>
              </div>

              {/* Air Quality */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Air Quality</span>
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-black text-emerald-400">
                  AQI {currentWeather?.aqiIndex || 42}
                </div>
                <div className="text-[10px] text-slate-400">{currentWeather?.aqiStatus || 'Good'}</div>
              </div>

              {/* Barometric */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Pressure</span>
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-base font-black text-white">
                  {currentWeather?.barometricPressureHpa || 1013} hPa
                </div>
                <div className="text-[10px] text-slate-400">Steady</div>
              </div>

              {/* UV Index */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>UV Index</span>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-base font-black text-white">
                  {currentWeather?.uvIndex || 4} / 11
                </div>
                <div className="text-[10px] text-slate-400">Moderate solar</div>
              </div>
            </div>
          </div>

          {/* Today's 24-Hour Forecast */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
              Hourly Timeline (Today & Tomorrow)
            </h3>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {hourlyForecast.map((hour, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-24 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center space-y-1.5 text-center transition-all hover:bg-white/[0.06]"
                >
                  <span className="text-xs text-slate-400 font-semibold">{hour.time}</span>
                  <div className="py-1">{getWeatherIcon(hour.conditionIcon, 'w-7 h-7')}</div>
                  <span className="text-sm font-black text-white">{formatTemp(hour.tempC, hour.tempF)}</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Droplets className="w-2.5 h-2.5 text-sky-400" />
                    <span>{hour.rainProbability}%</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{hour.windSpeedKmh} km/h</div>
                </div>
              ))}
            </div>
          </section>

          {/* 7-Day Detailed Forecast List */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
              7-Day Daily Forecast
            </h3>

            <div className="space-y-2">
              {dailyForecast.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.06] border-sky-400/50 shadow-lg'
                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-28 sm:w-36">
                        <div className="text-sm font-bold text-white">
                          {idx === 0 ? 'Today' : day.dayName}
                        </div>
                        <div className="text-[11px] text-slate-400">{day.dateStr}</div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-1">
                        {getWeatherIcon(day.conditionIcon, 'w-6 h-6')}
                        <span className="text-xs font-medium text-slate-300 truncate">
                          {day.condition}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        {day.precipitationProb > 0 && (
                          <div className="text-sky-400 font-semibold flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            <span>{day.precipitationProb}%</span>
                          </div>
                        )}
                        <div className="text-right w-24">
                          <span className="font-black text-white">{formatTemp(day.tempMaxC, day.tempMaxF)}</span>
                          <span className="text-slate-500 ml-2">{formatTemp(day.tempMinC, day.tempMinF)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details if selected */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 animate-fadeIn">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Peak Wind:</span>
                          <span className="font-bold text-white">{day.windSpeedMaxKmh} km/h</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Total Rain:</span>
                          <span className="font-bold text-white">{day.precipitationTotalMm.toFixed(1)} mm</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Max UV Index:</span>
                          <span className="font-bold text-white">{day.uvMax} / 11</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Air Quality:</span>
                          <span className="font-bold text-emerald-400">AQI {day.aqiMax}</span>
                        </div>
                        {day.actionAdvice && (
                          <div className="col-span-2 sm:col-span-4 mt-2 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-200 text-xs">
                            <strong>Meteorologist Advice:</strong> {day.actionAdvice}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: MULTI-MODEL NWP CONSENSUS */}
      {activeSubView === 'nwp' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-300">
            <strong>Numerical Weather Prediction (NWP) Ensemble:</strong> Comparing National Oceanic and Atmospheric Administration GFS (Global Forecast System) vs European Centre for Medium-Range Weather Forecasts ECMWF vs German Weather Service ICON.
          </div>
          <NWPModelComparisonView
            data={nwpData || null}
            isLoading={isLoadingNwp}
            onRefresh={onRefreshNwp}
            onAskWeatherGPT={onAskWeatherGPT}
          />
        </div>
      )}

      {/* VIEW 3: AGRO ADVISORY */}
      {activeSubView === 'agro' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300">
            <strong>Kisan Agrometeorological Advisory (SIH 26068):</strong> Grounded in soil moisture retention, evapotranspiration rates, pesticide spraying windows, and monsoon timing.
          </div>
          <AgroAdvisoryView
            data={agroData || null}
            isLoading={isLoadingAgro}
            onRefresh={onRefreshAgro}
            onAskWeatherGPT={onAskWeatherGPT}
          />
        </div>
      )}

      {/* VIEW 4: CLIMATE TRENDS */}
      {activeSubView === 'climate' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300">
            <strong>30-Year Historical Climate Shift:</strong> Real anomaly differences comparing 1980-2010 thirty-year baselines with recent atmospheric moisture, heatwave days, and flash runoff.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {climateTrends.map((trend, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-bold text-sky-400">{trend.metric}</div>
                <div className="text-lg font-black text-white">{trend.currentValue}</div>
                <div className="text-xs text-slate-400">Baseline: {trend.historicalBaseline}</div>
                <div className="text-xs font-bold text-rose-400">{trend.anomalyDiff}</div>
                <p className="text-[11px] text-slate-300 pt-1 border-t border-white/5">
                  {trend.riskInterpretation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
