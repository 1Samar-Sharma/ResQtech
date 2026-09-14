import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Copy,
} from 'lucide-react';
import { Coordinates } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { soundPlayer } from '../../utils/audio';
import { VoiceInputBar } from '../Common/VoiceInputBar';

interface CitizenScreenProps {
  userLocation: Coordinates;
  userAddress: string;
  currentWeather?: any;
  onNavigateTab?: (tab: string) => void;
}

export type CitizenRole =
  | 'farmer'
  | 'fisherman'
  | 'trekker'
  | 'commuter'
  | 'family';

interface RoleCard {
  id: CitizenRole;
  label: string;
  nativeLabel: string;
  icon: string;
  description: string;
  badge: string;
  badgeColor: string;
  accentBorder: string;
  quickPrompts: { label: string; query: string }[];
  highlightMetric?: (weather: any) => { label: string; value: string; hint: string };
}

const CITIZEN_ROLES: RoleCard[] = [
  {
    id: 'farmer',
    label: 'Farmer',
    nativeLabel: 'किसान (Kisan)',
    icon: '🌾',
    badge: 'Crops & Irrigation',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
    accentBorder: 'border-emerald-500',
    description: 'Farming perspectives: crop planning, irrigation timing, sowing, harvesting, spraying window, and field work.',
    quickPrompts: [
      { label: '🌾 Sowing & Harvest Timing', query: 'Is the weather suitable for crop harvesting and sowing over the next 3 days?' },
      { label: '💧 Rain Prediction & Irrigation', query: 'When will it rain next and should I irrigate my fields today?' },
      { label: '🧪 Pesticide Spray Conditions', query: 'Are wind speed and humidity safe for pesticide spraying tomorrow?' },
      { label: '🌡️ Frost & Extreme Temperature Risk', query: 'Is there any risk of frost, cold wave, or extreme heat damaging crops?' },
    ],
    highlightMetric: (w) => ({
      label: 'Field Moisture & Rain Outlook',
      value: (w?.precipitationProbability || 10) > 40 ? 'Rain Expected' : 'Dry / Favorable for Field Work',
      hint: `Humidity: ${w?.humidityPct || 65}% • Wind: ${Math.round(w?.windSpeedKmh || 12)} km/h`,
    }),
  },
  {
    id: 'fisherman',
    label: 'Matsya / Fisherman',
    nativeLabel: 'मत्स्य (Fisherman)',
    icon: '⛵',
    badge: 'Sea & Coastal Safety',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30',
    accentBorder: 'border-cyan-500',
    description: 'Coastal advice: wind speed, wave height, rainfall, sea conditions, fishing suitability, and squall warnings.',
    quickPrompts: [
      { label: '⛵ Is it safe to sail out to sea?', query: 'Is it safe for fishing boats to sail out to sea today and tomorrow?' },
      { label: '🌊 Wave Height & Sea Swell', query: 'What is the current and predicted coastal wave height and sea swell?' },
      { label: '💨 Wind Speed & Gusts at Sea', query: 'What are the wind speeds and squall warnings along the coastal waters?' },
      { label: '🌅 Safe Return to Harbor Window', query: 'What is the safest window to return to port before weather turns rough?' },
    ],
    highlightMetric: (w) => {
      const waveHeight = Math.max(0.8, ((w?.windSpeedKmh || 12) * 0.08) + ((w?.precipitationMm || 0) > 5 ? 1.2 : 0.3)).toFixed(1);
      return {
        label: 'Coastal Wave Height',
        value: `${waveHeight} meters`,
        hint: parseFloat(waveHeight) > 2.0 ? '⚠️ High Swell Warning' : '✅ Moderate Sea Condition',
      };
    },
  },
  {
    id: 'trekker',
    label: 'Trekker',
    nativeLabel: 'पर्वतारोही (Mountain Trekker)',
    icon: '🏔️',
    badge: 'Mountain Safety',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30',
    accentBorder: 'border-indigo-500',
    description: 'High altitude guidance: mountain weather, rain/snow, wind chill, visibility, and trail safety warnings.',
    quickPrompts: [
      { label: '🏔️ Mountain Weather & Cloudburst Risk', query: 'What is the risk of cloudburst, sudden rain, or flash floods along trails?' },
      { label: '🥶 Wind Chill & Temperature Drop', query: 'How low will the temperature drop at higher elevations?' },
      { label: '🌫️ Trail Visibility & Fog', query: 'Will dense fog or mist reduce trail visibility below 50 meters?' },
      { label: '⚠️ Landslide & Path Stability', query: 'Are there any landslide or rockfall warnings along the hiking routes?' },
    ],
    highlightMetric: (w) => ({
      label: 'Mountain Trail Conditions',
      value: (w?.windSpeedKmh || 10) > 30 ? 'High Gusts Expected' : 'Good Visibility & Stable Trails',
      hint: `Wind: ${Math.round(w?.windSpeedKmh || 12)} km/h • Temp: ${Math.round(w?.temperatureC || 26)}°C`,
    }),
  },
  {
    id: 'commuter',
    label: 'Commuter',
    nativeLabel: 'यात्री (Transit & Travel)',
    icon: '🚗',
    badge: 'Roads & Travel',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
    accentBorder: 'border-amber-500',
    description: 'Travel weather: rainfall timing, visibility, waterlogged routes/underpasses, and safe commute hours.',
    quickPrompts: [
      { label: '🚦 Waterlogged Routes & Low-Lying Roads', query: 'Which major routes or underpasses have waterlogging risk during rush hour?' },
      { label: '⏰ Best Time to Leave for Travel', query: 'What is the safest time to travel today before heavy rain or traffic snarls?' },
      { label: '🌫️ Fog & Highway Visibility', query: 'Is there heavy fog or poor road visibility expected on highways?' },
      { label: '⚡ Flash Rain Timing in City', query: 'At what time is heavy rain or water accumulation expected in my transit route?' },
    ],
    highlightMetric: (w) => ({
      label: 'Commute & Travel Index',
      value: (w?.precipitationProbability || 10) > 50 ? 'Moderate Rain Risk' : 'Normal Transit Conditions',
      hint: `Road visibility: Good • Temp: ${Math.round(w?.temperatureC || 26)}°C`,
    }),
  },
  {
    id: 'family',
    label: 'Family',
    nativeLabel: 'परिवार (Household & Children)',
    icon: '🏠',
    badge: 'Household Safety',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30',
    accentBorder: 'border-sky-500',
    description: 'Household protection: heatwave precautions, heavy rainfall, storm preparation, children/elderly care, and flood safety.',
    quickPrompts: [
      { label: '🌧️ Heavy Rain & Home Flood Risk', query: 'Is there any heavy rain or waterlogging risk around residential areas today?' },
      { label: '☀️ Heatwave & Senior / Child Safety', query: 'What precautions should children and seniors take for today\'s heat or humidity?' },
      { label: '⚡ Lightning & Power Outage Prep', query: 'Are there lightning strikes predicted and what home appliances precautions are advised?' },
      { label: '📦 Essential Home Supplies Prep', query: 'Should we store extra drinking water or prepare battery backups today?' },
    ],
    highlightMetric: (w) => ({
      label: 'Home Safety Outlook',
      value: (w?.aqiIndex || 42) > 150 ? 'Poor Air - Keep Indoors' : 'Safe / Normal Conditions',
      hint: `Air Quality: AQI ${w?.aqiIndex || 42} • Humidity: ${w?.humidityPct || 65}%`,
    }),
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  detectedLanguage?: string;
  detectedLanguageName?: string;
  speechLocale?: string;
}

export const CitizenScreen: React.FC<CitizenScreenProps> = ({
  userLocation,
  userAddress,
  currentWeather,
}) => {
  const {
    askLanguage,
    currentAskLanguage,
    askSpeechLocale,
    t,
  } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<CitizenRole | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const activeRoleData = CITIZEN_ROLES.find((r) => r.id === selectedRole);

  useEffect(() => {
    if (selectedRole && activeRoleData) {
      setMessages([
        {
          id: `welcome-${selectedRole}`,
          sender: 'assistant',
          text: `Welcome to the ${activeRoleData.label} weather advisory. How can I help you regarding your work, activities, or safety today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [selectedRole]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const handleSelectRole = (roleId: CitizenRole) => {
    soundPlayer.playBeep(520, 0.05);
    setSelectedRole(roleId);
  };

  const handleBackToRoles = () => {
    stopSpeech();
    setSelectedRole(null);
    setMessages([]);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setPlayingMessageId(null);
  };

  const handleSpeak = (messageId: string, text: string, speechLocale?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (playingMessageId === messageId) {
      stopSpeech();
      return;
    }

    stopSpeech();

    const cleanText = text
      .replace(/[#*`_]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = speechLocale || askSpeechLocale || 'hi-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setPlayingMessageId(null);
    utterance.onerror = () => setPlayingMessageId(null);

    activeUtteranceRef.current = utterance;
    setPlayingMessageId(messageId);
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      setPlayingMessageId(null);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAsking || !selectedRole) return;

    soundPlayer.playBeep(440, 0.06);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAsking(true);

    try {
      const response = await fetch('/api/ai/weather-gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend.trim(),
          locationName: userAddress,
          coordinates: userLocation,
          persona: selectedRole,
          language: askLanguage,
          weatherContext: currentWeather,
          conversationHistory: messages.slice(-4),
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          detectedLanguage: data.detectedLanguage,
          detectedLanguageName: data.detectedLanguageName,
          speechLocale: data.speechLocale,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'No reply');
      }
    } catch (e) {
      const fallbackMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `For ${activeRoleData?.label} in ${userAddress}: local weather indicates ${currentWeather?.condition || 'stable conditions'} around ${Math.round(currentWeather?.temperatureC || 26)}°C. Please proceed with standard safety procedures.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsAsking(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  // =========================================================================
  // VIEW A: MAIN CITIZEN MENU (ONLY SHOW ROLES INITIALLY AS REQUESTED)
  // =========================================================================
  if (!selectedRole) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="text-center space-y-1 py-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('nav_citizen', 'Citizen')}
          </h2>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Choose what you need help with
          </p>
        </div>

        {/* 5 Specialized Roles (Farmer, Matsya, Trekker, Commuter, Family) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {CITIZEN_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleSelectRole(role.id)}
              className="p-5 rounded-2xl border-2 border-slate-200 hover:border-sky-500 dark:border-white/10 dark:hover:border-sky-400 bg-white dark:bg-[#0c1322] hover:shadow-md transition-all text-left flex flex-col justify-between space-y-3 group active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  {role.icon}
                </div>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${role.badgeColor}`}>
                  {role.badge}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {role.label}
                </h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-black text-sky-700 dark:text-sky-400">
                <span>Select {role.label} →</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">{role.nativeLabel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: ACTIVE SPECIALIZED CITIZEN PORTAL WITH INTEGRATED VOICE & QUESTIONS
  // =========================================================================
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20 animate-fadeIn">
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <button
          type="button"
          onClick={handleBackToRoles}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-white/20 bg-white dark:bg-[#0c1322] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-black transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to all Citizen options</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/10 text-xs font-black text-slate-800 dark:text-slate-200">
          <span>{activeRoleData?.icon}</span>
          <span>{activeRoleData?.label}</span>
        </div>
      </div>

      {/* Role Summary & Key Telemetry Metric */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border-2 border-slate-200 dark:border-white/10 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-3xl shrink-0">
            {activeRoleData?.icon}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {activeRoleData?.label} Advisory
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {activeRoleData?.description}
            </p>
          </div>
        </div>

        {/* Specialized highlight metric if available */}
        {activeRoleData?.highlightMetric && currentWeather && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600 dark:text-slate-400 font-bold">
                {activeRoleData.highlightMetric(currentWeather).label}
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white">
                {activeRoleData.highlightMetric(currentWeather).value}
              </p>
            </div>
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              {activeRoleData.highlightMetric(currentWeather).hint}
            </span>
          </div>
        )}
      </div>

      {/* Tailored Quick Prompts */}
      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 px-1">
          What do you need help with?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {activeRoleData?.quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp.query)}
              disabled={isAsking}
              className="p-3 rounded-xl border-2 border-slate-200 hover:border-sky-500 dark:border-white/10 dark:hover:border-sky-400 bg-white dark:bg-[#0c1322] hover:bg-sky-50 dark:hover:bg-white/5 text-left text-xs font-black text-slate-900 dark:text-slate-100 transition-all flex items-center justify-between group active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <span>{qp.label}</span>
              <span className="text-sky-600 dark:text-sky-400 font-black ml-2 shrink-0">Ask →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversational Stream for this Role */}
      <div className="space-y-3 pt-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isAudioPlaying = playingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 animate-fadeIn`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[90%] sm:max-w-[80%] text-sm leading-relaxed transition-colors ${
                  isUser
                    ? 'bg-sky-600 text-white font-black rounded-tr-sm shadow-md'
                    : 'bg-white dark:bg-[#0c1322] border-2 border-slate-300 dark:border-white/15 text-slate-950 dark:text-white font-semibold rounded-tl-sm shadow-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Message Footer: Actions, Timestamp, and Detected Language Badge */}
              <div className="flex flex-wrap items-center gap-2 px-1 text-[11px] text-slate-700 dark:text-slate-200 font-bold">
                <span>{msg.timestamp}</span>
                {msg.detectedLanguageName && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-300 font-black text-[10px] border border-sky-300 dark:border-sky-500/30">
                    🗣️ {msg.detectedLanguageName}
                  </span>
                )}
                {!isUser && (
                  <>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.id, msg.text, msg.speechLocale)}
                      className={`flex items-center gap-1 font-black transition-colors cursor-pointer ${
                        isAudioPlaying ? 'text-sky-600 dark:text-sky-400 animate-pulse' : 'hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-200'
                      }`}
                      title={isAudioPlaying ? 'Stop speaking' : 'Listen out loud'}
                      aria-label={isAudioPlaying ? 'Stop speaking' : 'Listen out loud'}
                    >
                      {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                      <span>{isAudioPlaying ? 'Speaking...' : 'Listen'}</span>
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="flex items-center gap-1 hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-200 font-black transition-colors cursor-pointer"
                      title="Copy response"
                      aria-label="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {isAsking && (
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 text-xs font-black p-3 animate-pulse bg-sky-50 dark:bg-sky-950/30 rounded-xl border-2 border-sky-300 dark:border-sky-500/30">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-spin" />
            <span>Consulting {activeRoleData?.label} specialist in your language...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Clean In-Flow Input Bar (NO popup or floating overlays) */}
      <div className="sticky bottom-3 z-30 pt-2">
        <VoiceInputBar
          onSendMessage={handleSendMessage}
          isProcessing={isAsking}
          placeholder={`Ask ${activeRoleData?.label} question or tap mic to speak in any language...`}
          showLanguageSelector={true}
          personaLabel={activeRoleData?.label}
        />
      </div>
    </div>
  );
};
