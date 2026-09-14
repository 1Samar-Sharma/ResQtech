import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, AlertCircle, ChevronDown, Check, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n/translations';

interface VoiceInputBarProps {
  onSendMessage: (text: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
  showLanguageSelector?: boolean;
  personaLabel?: string;
}

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  onSendMessage,
  isProcessing = false,
  placeholder,
  showLanguageSelector = true,
  personaLabel,
}) => {
  const {
    askLanguage,
    setAskLanguage,
    currentAskLanguage,
    askSpeechLocale,
    t,
  } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceRecording();
    };
  }, []);

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const startVoiceRecording = () => {
    setMicError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError("Voice input isn't supported in this browser. Please type your question.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = askSpeechLocale || 'hi-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const transcript = (finalTranscript || interimTranscript).trim();
        if (transcript) {
          setInputQuery(transcript);
        }

        if (finalTranscript.trim()) {
          stopVoiceRecording();
          const cleanText = finalTranscript.trim();
          setTimeout(() => {
            onSendMessage(cleanText);
            setInputQuery('');
          }, 350);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          setMicError("Couldn't understand. Try again or check mic permissions.");
        } else {
          setMicError("Couldn't hear anything. Try speaking closer to the mic.");
        }
        stopVoiceRecording();
      };

      recognition.onend = () => {
        stopVoiceRecording();
      };

      recognitionRef.current = recognition;
      recognition.start();

      silenceTimeoutRef.current = setTimeout(() => {
        if (isRecording) {
          stopVoiceRecording();
        }
      }, 12000);
    } catch (err) {
      setMicError("Microphone access failed. Please ensure mic permission is allowed.");
      stopVoiceRecording();
    }
  };

  const handleToggleMic = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim();
    if (!query || isProcessing) return;
    stopVoiceRecording();
    onSendMessage(query);
    setInputQuery('');
  };

  return (
    <div className="w-full space-y-2">
      {/* Optional Conversation Language Selector Strip */}
      {showLanguageSelector && (
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-white/15 transition-colors font-black cursor-pointer shadow-xs"
              title="Change Ask & Voice Language"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Conversation language:</span>
              <span className="font-black text-sky-800 dark:text-sky-300">
                {currentAskLanguage.nativeName} ({currentAskLanguage.name})
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-700 dark:text-slate-300 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown Menu */}
            {isLangDropdownOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-72 max-h-64 overflow-y-auto rounded-2xl bg-white dark:bg-[#0c1322] border-2 border-slate-300 dark:border-white/20 shadow-2xl z-50 p-1.5 space-y-0.5">
                <div className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-white/10">
                  Select Ask & Voice Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = lang.code === askLanguage;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setAskLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-950 dark:text-white font-black'
                          : 'text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{lang.flag}</span>
                        <div>
                          <div className="font-black text-slate-950 dark:text-white">{lang.nativeName}</div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">{lang.name}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {personaLabel && (
            <span className="hidden sm:inline-block text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Role: <span className="text-slate-950 dark:text-white font-black">{personaLabel}</span>
            </span>
          )}
        </div>
      )}

      {/* Main High-Contrast Input Container */}
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white dark:bg-[#0c1322] border-2 shadow-md transition-all ${
          isRecording
            ? 'border-rose-500 ring-2 ring-rose-500/20'
            : isProcessing
            ? 'border-sky-500 ring-2 ring-sky-500/20'
            : 'border-slate-300 dark:border-white/20 focus-within:border-sky-600 dark:focus-within:border-sky-400'
        }`}
      >
        {/* 1. Voice Microphone Button (Idle: Speak | Recording: Listening... | Processing: Understanding...) */}
        <button
          type="button"
          onClick={handleToggleMic}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shrink-0 cursor-pointer active:scale-95 ${
            isRecording
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
              : isProcessing
              ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 cursor-wait'
              : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-950 dark:text-white border-2 border-slate-300 dark:border-white/15 shadow-xs'
          }`}
          title={isRecording ? 'Tap to stop listening' : 'Tap to speak'}
          aria-label={isRecording ? 'Listening' : 'Speak'}
        >
          {isRecording ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <MicOff className="w-4 h-4" />
              <span>Listening ({recordingSeconds}s)...</span>
            </>
          ) : isProcessing ? (
            <>
              <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
              <span className="hidden sm:inline">Understanding...</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-sky-600 dark:text-sky-400 stroke-[2.5]" />
              <span>Speak</span>
            </>
          )}
        </button>

        {/* 2. Text Input Field */}
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            isRecording
              ? 'Listening to your voice...'
              : placeholder || `Ask anything about weather & safety...`
          }
          disabled={isProcessing}
          className="flex-1 bg-transparent border-0 text-slate-950 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:outline-none text-sm sm:text-base font-bold px-2 py-1.5 min-w-0"
        />

        {/* 3. Send Question Button */}
        <button
          type="submit"
          disabled={!inputQuery.trim() || isProcessing}
          className={`flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
            inputQuery.trim() && !isProcessing
              ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-md shadow-sky-500/30 active:scale-95'
              : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
          title="Send query"
          aria-label="Send query"
        >
          <Send className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">{t('ask_send', 'Send')}</span>
        </button>
      </form>

      {/* Mic Error Banner with Dismiss */}
      {micError && (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{micError}</span>
          </div>
          <button
            type="button"
            onClick={() => setMicError(null)}
            className="text-[11px] font-black underline text-amber-800 dark:text-amber-300 hover:text-amber-950 cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
