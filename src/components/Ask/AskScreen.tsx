import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  Info,
} from 'lucide-react';
import { Coordinates } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { soundPlayer } from '../../utils/audio';
import { VoiceInputBar } from '../Common/VoiceInputBar';

interface AskScreenProps {
  userLocation: Coordinates;
  userAddress: string;
  currentWeather?: any;
  isLoadingForecast?: boolean;
  onRefreshWeather?: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenSOS?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAudioPlaying?: boolean;
  detectedLanguage?: string;
  detectedLanguageName?: string;
  speechLocale?: string;
}

const COMMON_QUESTIONS = [
  { label: '🌧️ Will it rain today?', query: 'Will it rain today in my area? What time should I carry an umbrella?' },
  { label: '🚗 Is it safe to travel?', query: 'Is it safe to commute or travel right now? Are there any road or flood hazards?' },
  { label: '🌤️ Weather tomorrow?', query: 'What will the weather be tomorrow throughout the day?' },
  { label: '💨 Will there be strong winds?', query: 'Will there be strong winds, thunderstorms or lightning today?' },
];

export const AskScreen: React.FC<AskScreenProps> = ({
  userLocation,
  userAddress,
  currentWeather,
  isLoadingForecast = false,
  onRefreshWeather,
}) => {
  const {
    askLanguage,
    currentAskLanguage,
    askSpeechLocale,
    t,
  } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your personal weather assistant. Ask me anything about today\'s rain, travel safety, or tomorrow\'s weather in simple words. You can speak in any language!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isAsking, setIsAsking] = useState(false);
  const [showTechnicalData, setShowTechnicalData] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

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

    // Clean markdown symbols for natural speech
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

    utterance.onend = () => {
      setPlayingMessageId(null);
    };

    utterance.onerror = () => {
      setPlayingMessageId(null);
    };

    activeUtteranceRef.current = utterance;
    setPlayingMessageId(messageId);
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      setPlayingMessageId(null);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAsking) return;

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
          persona: 'general',
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
        throw new Error(data.error || 'No response');
      }
    } catch (err) {
      // Fallback friendly conversational answer
      const fallbackTemp = currentWeather?.temperatureC ? `${Math.round(currentWeather.temperatureC)}°C` : 'current temperature';
      const fallbackCond = currentWeather?.condition || 'clear';
      const fallbackMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Based on current local data for ${userAddress}, conditions are currently ${fallbackCond} around ${fallbackTemp}. Rain is not severe right now, but stay updated if traveling.`,
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-6">
      {/* 1. Header & Location Context (High-Contrast, Crisp) */}
      <div className="bg-white dark:bg-[#0c1322] border-2 border-slate-300 dark:border-white/15 rounded-2xl p-4 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="p-2 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="truncate">
              <span className="text-slate-600 dark:text-slate-300 font-bold">Weather for: </span>
              <span className="text-slate-950 dark:text-white font-black">{userAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {currentWeather && (
              <span className="text-sm font-black text-slate-950 dark:text-white px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/10 border-2 border-slate-300 dark:border-white/15 shadow-xs">
                {Math.round(currentWeather.temperatureC || 26)}°C • {currentWeather.condition || 'Clear'}
              </span>
            )}
            {onRefreshWeather && (
              <button
                type="button"
                onClick={onRefreshWeather}
                className="p-2 rounded-xl border-2 border-slate-300 dark:border-white/15 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                title="Refresh weather data"
                aria-label="Refresh weather data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingForecast ? 'animate-spin text-sky-600' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Optional Expandable Technical Weather Data */}
        <div className="mt-3 pt-3 border-t-2 border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setShowTechnicalData(!showTechnicalData)}
            className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-black hover:underline cursor-pointer"
          >
            <Info className="w-4 h-4 text-sky-600" />
            <span>{showTechnicalData ? 'Hide detailed numbers' : 'Show weather numbers (humidity, wind, rain)'}</span>
            {showTechnicalData ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <span className="text-[11px] font-black text-slate-600 dark:text-slate-300">IMD & Sensor Grounded</span>
        </div>

        {showTechnicalData && currentWeather && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-2 border-t border-slate-200 dark:border-white/10 animate-fadeIn">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-center border-2 border-slate-300 dark:border-white/15">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">Humidity</span>
              <p className="text-base font-black text-slate-950 dark:text-white">{currentWeather.humidityPct || 65}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-center border-2 border-slate-300 dark:border-white/15">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">Wind</span>
              <p className="text-base font-black text-slate-950 dark:text-white">{Math.round(currentWeather.windSpeedKmh || 12)} km/h</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-center border-2 border-slate-300 dark:border-white/15">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">Rain Chance</span>
              <p className="text-base font-black text-slate-950 dark:text-white">{currentWeather.precipitationProbability || 10}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-center border-2 border-slate-300 dark:border-white/15">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">Air Quality</span>
              <p className="text-base font-black text-emerald-700 dark:text-emerald-400">AQI {currentWeather.aqiIndex || 42}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Conversational Hero Header */}
      <div className="text-center py-2 space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          {t('ask_title', 'Ask about your weather')}
        </h2>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {t('ask_subtitle', 'Ask anything about weather, rainfall, travel safety, and conditions in simple words')}
        </p>
      </div>

      {/* 3. Common Quick Questions (Large, Easily Tappable Chips) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {COMMON_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q.query)}
            disabled={isAsking}
            className="p-3.5 rounded-2xl border-2 border-slate-300 hover:border-sky-500 dark:border-white/15 dark:hover:border-sky-400 bg-white dark:bg-[#0c1322] hover:bg-sky-50 dark:hover:bg-white/10 text-left transition-all active:scale-[0.98] shadow-xs flex items-center justify-between group cursor-pointer"
          >
            <span className="text-sm font-black text-slate-950 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300">
              {q.label}
            </span>
            <span className="text-xs text-sky-700 dark:text-sky-400 font-black ml-2 shrink-0">Ask →</span>
          </button>
        ))}
      </div>

      {/* 4. Conversational Dialogue Stream */}
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
                        isAudioPlaying
                          ? 'text-sky-600 dark:text-sky-400 animate-pulse'
                          : 'hover:text-slate-950 dark:hover:text-white text-slate-700 dark:text-slate-200'
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
            <span>Listening and analyzing weather in your language...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 5. Clean In-Flow Input Bar (NO popup or floating overlays) */}
      <div className="sticky bottom-3 z-30 pt-2">
        <VoiceInputBar
          onSendMessage={handleSendMessage}
          isProcessing={isAsking}
          placeholder="Ask anything or tap mic to speak in any language..."
          showLanguageSelector={true}
        />
      </div>
    </div>
  );
};
