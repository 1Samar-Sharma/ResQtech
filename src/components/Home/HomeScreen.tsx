import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  MapPin,
  RefreshCw,
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Gauge,
  Compass,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  HeartHandshake,
  Radio,
  ExternalLink,
  Bot,
  Layers,
  ThermometerSun,
  CheckCircle2,
} from 'lucide-react';
import {
  CurrentWeatherState,
  DailyWeatherForecast,
  HourlyWeatherForecast,
  Coordinates,
  IMDColorAlert,
} from '../../types';
import { soundPlayer } from '../../utils/audio';

interface HomeScreenProps {
  userLocation: Coordinates;
  userAddress: string;
  isGpsLocked?: boolean;
  onRefreshLocation?: () => void;
  currentWeather: CurrentWeatherState | null;
  dailyForecast?: DailyWeatherForecast[];
  hourlyForecast?: HourlyWeatherForecast[];
  imdAlerts?: IMDColorAlert[];
  isLoadingForecast?: boolean;
  onRefreshForecast?: () => void;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  onAskWeatherGPT: (query: string, persona?: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenAboutModal?: () => void;
  onOpenBroadcastModal?: () => void;
  activeAlertsCount?: number;
  onOpenEmergency?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userLocation,
  userAddress,
  isGpsLocked = false,
  onRefreshLocation,
  currentWeather,
  dailyForecast = [],
  hourlyForecast = [],
  imdAlerts = [],
  isLoadingForecast = false,
  onRefreshForecast,
  unit,
  onToggleUnit,
  onAskWeatherGPT,
  onNavigateTab,
  onOpenAboutModal,
  onOpenBroadcastModal,
  activeAlertsCount = 0,
  onOpenEmergency,
}) => {
  const [askInput, setAskInput] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('general');
  const [isListening, setIsListening] = useState(false);

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

  const handleAskSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!askInput.trim()) return;
    soundPlayer.playBeep(720, 0.05);
    onAskWeatherGPT(askInput.trim(), selectedPersona);
  };

  const handleQuickPromptClick = (prompt: string, persona?: string) => {
    soundPlayer.playBeep(640, 0.04);
    onAskWeatherGPT(prompt, persona || selectedPersona);
  };

  // Voice speech recognition for quick voice query on Home Screen
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        soundPlayer.playBeep(880, 0.08);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        setAskInput(transcript);
        setIsListening(false);
        if (transcript.trim()) {
          onAskWeatherGPT(transcript.trim(), selectedPersona);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // High priority alerts count
  const severeAlerts = imdAlerts.filter(
    (a: any) => a.colorCode === 'red' || a.colorCode === 'orange' || a.colorLevel === 'red' || a.colorLevel === 'orange'
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-24 px-3 sm:px-4 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. CLEAN APP TITLE & LOCATION HEADER */}
      {/* ========================================================================= */}
      <header className="flex items-center justify-between gap-2 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>Weather<span className="text-sky-400">GPT</span></span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold uppercase tracking-wider">
              AI Assistant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hyperlocal Weather Forecasts & Disaster Intelligence
          </p>
        </div>

        {/* Location & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onRefreshLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs transition-all max-w-[170px] sm:max-w-[220px]"
            title="Click to detect current GPS location"
          >
            <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isGpsLocked ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="truncate font-semibold">{userAddress}</span>
          </button>

          {/* Unit Toggle */}
          <button
            onClick={onToggleUnit}
            className="px-2.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-bold transition-all"
            title="Toggle °C / °F"
          >
            {unit === 'C' ? '°C' : '°F'}
          </button>

          {/* Refresh button */}
          {onRefreshForecast && (
            <button
              onClick={onRefreshForecast}
              className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all"
              title="Refresh weather data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForecast ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. STRONGEST VISUAL ELEMENT: ASK WEATHERGPT */}
      {/* ========================================================================= */}
      <section
        id="home-ask-weathergpt-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b162c] via-[#071124] to-[#040812] border-2 border-sky-500/40 p-4 sm:p-6 shadow-2xl shadow-sky-950/50 transition-all hover:border-sky-400/60"
      >
        {/* Subtle background atmospheric glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-sky-500/20">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Ask WeatherGPT</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                    AI
                  </span>
                </h2>
                <p className="text-[11px] text-slate-300">
                  Ask the sky in natural language • English, Hindi & 24+ Indic languages
                </p>
              </div>
            </div>

            {/* Persona Quick Chips */}
            <div className="hidden sm:flex items-center gap-1 text-[11px]">
              {[
                { id: 'general', label: 'Citizen' },
                { id: 'farmer', label: '🌾 Kisan' },
                { id: 'fisherman', label: '🚤 Matsya' },
                { id: 'commuter', label: '🚗 Travel' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    selectedPersona === p.id
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Input Box with Voice & Send Button */}
          <form onSubmit={handleAskSubmit} className="relative">
            <div className="flex items-center gap-2 bg-[#040914]/90 border border-white/15 focus-within:border-sky-400/80 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-2xl p-2 transition-all shadow-inner">
              <input
                id="home-weathergpt-input"
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder={
                  selectedPersona === 'farmer'
                    ? 'Ask Kisan AI: Is it safe to spray pesticides or harvest crops tomorrow?'
                    : selectedPersona === 'fisherman'
                    ? 'Ask Matsya AI: Wave height & sea-state advisory for Kochi coast?'
                    : 'Ask anything: Will it rain today? Is commute safe from waterlogging?'
                }
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 px-2 py-1.5 focus:outline-none"
              />

              {/* Voice Mic Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-md shadow-red-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                }`}
                title={isListening ? 'Listening... tap to stop' : 'Tap to speak query'}
                aria-label="Voice search"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-sky-400" />}
              </button>

              {/* Submit / Ask Button */}
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-sky-500/25 flex-shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Action Suggestion Chips */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Popular Weather Questions:
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: '🌧️ Will it rain today?', query: 'Will it rain today in my area, and when will it start?' },
                { label: '☀️ Heatwave & UV safety', query: 'What is the peak heat index and UV protection protocol today?' },
                { label: '🌾 Crop spray & harvest', query: 'Is soil moisture and wind suitable for farming operations this week?', persona: 'farmer' },
                { label: '🚗 Commuter waterlogging', query: 'Are any roads or underpasses waterlogged during evening commute?', persona: 'commuter' },
                { label: '💨 High wind warnings', query: 'Are there any high wind gust or gale watches active in this district?' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(chip.query, chip.persona)}
                  className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/40 text-slate-300 hover:text-sky-200 text-xs font-medium transition-all text-left flex items-center gap-1"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEVERE ALERT BANNER (IF ANY ACTIVE ALERTS) */}
      {/* ========================================================================= */}
      {severeAlerts.length > 0 && (
        <div
          onClick={() => onNavigateTab('alerts')}
          className="cursor-pointer p-4 rounded-3xl bg-rose-500/15 border-2 border-rose-500/40 hover:border-rose-400/60 transition-all space-y-2 shadow-lg shadow-rose-950/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                Severe Weather Alert Active
              </span>
            </div>
            <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
              View Protocol <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            {severeAlerts[0]?.headline || severeAlerts[0]?.description || 'Severe weather alert issued'}
          </div>
          <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
            <span><strong className="text-white">WHERE:</strong> {severeAlerts[0]?.affectedArea || (severeAlerts[0] as any)?.district || userAddress}</span>
            <span><strong className="text-white">SEVERITY:</strong> {(severeAlerts[0]?.colorLabel || severeAlerts[0]?.colorCode || (severeAlerts[0] as any)?.colorLevel || 'warning').toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REFINED CURRENT WEATHER CARD */}
      {/* ========================================================================= */}
      <section
        id="home-current-weather-card"
        className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 sm:p-6 shadow-xl space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              {getWeatherIcon(currentWeather?.conditionIcon, 'w-12 h-12')}
            </div>
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {formatTemp(currentWeather?.temperatureC, currentWeather?.temperatureF)}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Feels like {formatTemp(currentWeather?.feelsLikeC, currentWeather?.feelsLikeF)}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1 flex items-center gap-2">
                <span>{currentWeather?.condition || 'Clear Sky'}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-normal">
                  {currentWeather?.conditionDescription || 'Typical meteorological baseline'}
                </span>
              </div>
            </div>
          </div>

          {/* High / Low & Grounded Source */}
          <div className="flex sm:flex-col sm:items-end justify-between text-xs text-slate-400 gap-1">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span>H: {formatTemp(dailyForecast?.[0]?.tempMaxC, dailyForecast?.[0]?.tempMaxF)}</span>
              <span>L: {formatTemp(dailyForecast?.[0]?.tempMinC, dailyForecast?.[0]?.tempMinF)}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Grounded in IMD & Satellite</span>
            </div>
          </div>
        </div>

        {/* 4 Clean Restrained Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Rain */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Rain Chance</span>
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-lg font-black text-white">
              {currentWeather?.precipitationProbability ?? 10}%
            </div>
            <div className="text-[10px] text-slate-400">
              {(currentWeather?.precipitationMm || 0).toFixed(1)} mm today
            </div>
          </div>

          {/* Wind */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Wind</span>
              <Wind className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-lg font-black text-white">
              {currentWeather?.windSpeedKmh || 12} km/h
            </div>
            <div className="text-[10px] text-slate-400">
              Direction: {currentWeather?.windDirection || 'W'}
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Humidity</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-black text-white">
              {currentWeather?.humidityPct || 55}%
            </div>
            <div className="text-[10px] text-slate-400">
              Dew: {currentWeather?.dewPointC || 14}°C
            </div>
          </div>

          {/* Air Quality */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Air Quality</span>
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-400">
              AQI {currentWeather?.aqiIndex || 42}
            </div>
            <div className="text-[10px] text-slate-400">
              {currentWeather?.aqiStatus || 'Good'}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TODAY'S HOURLY FORECAST STRIP */}
      {/* ========================================================================= */}
      {hourlyForecast.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Today's Hourly Forecast
            </h3>
            <button
              onClick={() => onNavigateTab('forecast')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
            >
              <span>Full Forecast</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {hourlyForecast.slice(0, 10).map((hour, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-20 p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center space-y-1.5 text-center"
              >
                <span className="text-[11px] text-slate-400 font-semibold">{hour.time}</span>
                <div className="py-0.5">{getWeatherIcon(hour.conditionIcon, 'w-6 h-6')}</div>
                <span className="text-xs font-bold text-white">{formatTemp(hour.tempC, hour.tempF)}</span>
                {hour.rainProbability > 0 && (
                  <span className="text-[10px] font-bold text-sky-400 flex items-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5" />
                    {hour.rainProbability}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. UPCOMING 7-DAY FORECAST SNAPSHOT */}
      {/* ========================================================================= */}
      {dailyForecast.length > 0 && (
        <section className="rounded-3xl bg-white/[0.02] border border-white/10 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              7-Day Weather Outlook
            </h3>
            <button
              onClick={() => onNavigateTab('forecast')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
            >
              <span>Explore Details</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {dailyForecast.slice(0, 4).map((day, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateTab('forecast')}
                className="py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] rounded-xl px-2 transition-all"
              >
                <div className="w-24 sm:w-28 text-xs font-bold text-white">
                  {idx === 0 ? 'Today' : day.dayName}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  {getWeatherIcon(day.conditionIcon, 'w-5 h-5')}
                  <span className="text-xs text-slate-300 truncate hidden sm:inline">
                    {day.condition}
                  </span>
                </div>
                {day.precipitationProb > 0 && (
                  <div className="text-[11px] font-semibold text-sky-400 w-12 text-right">
                    {day.precipitationProb}%
                  </div>
                )}
                <div className="text-xs font-bold text-right flex items-center gap-2 w-24 justify-end">
                  <span className="text-white">{formatTemp(day.tempMaxC, day.tempMaxF)}</span>
                  <span className="text-slate-500 font-normal">{formatTemp(day.tempMinC, day.tempMinF)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. CIVIC RELIEF SECONDARY ACTIONS (CLEAN & ACCESSIBLE) */}
      {/* ========================================================================= */}
      <section className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Civic Relief & Safety Actions
            </h3>
            <p className="text-[11px] text-slate-400">
              Community emergency response layer (Secondary feature)
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('help')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
          >
            <span>Open Civic Relief</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Report Emergency */}
          <button
            onClick={() => {
              if (onOpenBroadcastModal) onOpenBroadcastModal();
              else onNavigateTab('help');
            }}
            className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-xs font-black text-white">Report Emergency</div>
            <div className="text-[10px] text-red-300 mt-0.5">5km broadcast</div>
          </button>

          {/* Request Aid */}
          <button
            onClick={() => onNavigateTab('help')}
            className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-white">Request Help</div>
            <div className="text-[10px] text-amber-300 mt-0.5">Food, shelter, medical</div>
          </button>

          {/* Offer Help */}
          <button
            onClick={() => onNavigateTab('help')}
            className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-white">Volunteer / Offer</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Pledge local aid</div>
          </button>

          {/* 5km Radar Map */}
          <button
            onClick={() => onNavigateTab('map')}
            className="p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-white">5km Radar Map</div>
            <div className="text-[10px] text-sky-300 mt-0.5">GIS shelter map</div>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER / ABOUT LINK */}
      {/* ========================================================================= */}
      <footer className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span>Smart India Hackathon 2026 (Problem Statement 26068)</span>
        </div>
        <button
          onClick={onOpenAboutModal}
          className="text-sky-400 hover:text-sky-300 font-semibold underline flex items-center gap-1"
        >
          <span>About WeatherGPT & Civic Relief</span>
        </button>
      </footer>
    </div>
  );
};
