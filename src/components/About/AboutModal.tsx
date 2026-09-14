import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, Compass, Info, X, ExternalLink, Award } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeck?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenDeck }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#070e1c] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>About WeatherGPT</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                  SIH 26068
                </span>
              </h2>
              <p className="text-xs text-slate-400">AI Weather & Public Safety Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Product Definitions */}
        <div className="space-y-4">
          {/* WeatherGPT Definition Card */}
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
            <div className="flex items-center gap-2 text-sky-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>WeatherGPT (Primary)</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "An AI-powered conversational weather assistant that helps people understand weather forecasts, risks and recommended actions."
            </p>
            <p className="text-xs text-slate-300">
              Grounded in real-time numerical weather models (GFS, ECMWF, ICON), IMD 4-stage color warnings, and live atmospheric telemetry with zero hallucinations.
            </p>
          </div>

          {/* Civic Relief Definition Card */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" />
              <span>Civic Relief (Community Hub)</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "A community emergency-response feature for reporting emergencies and requesting or offering help."
            </p>
            <p className="text-xs text-slate-300">
              Empowers citizens with a 5km defense radar, mutual aid coordination, verified shelter directories, and immediate responder dispatch.
            </p>
          </div>
        </div>

        {/* Key Pillars */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Principles</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Hyperlocal Grounding
              </span>
              <p className="text-[11px] text-slate-400">Open-Meteo, OpenWeather, & IMD satellite feeds.</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Multilingual AI
              </span>
              <p className="text-[11px] text-slate-400">Conversational reasoning in 24+ Indic languages.</p>
            </div>
          </div>
        </div>

        {/* Connected Cloud & Android Compatibility */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Firebase & Android Status
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Connected
            </span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Project ID:</span>
              <span className="text-sky-300 font-semibold font-mono">weathergpt-resqtech</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Project Number:</span>
              <span className="text-slate-200 font-mono">1079746544509</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Android Package:</span>
              <span className="text-emerald-300 font-mono">WeatherGPT.ResQtech</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Database:</span>
              <span className="text-slate-200 truncate max-w-[200px]" title="ai-studio-newcivicrelief-578626da-93a6-4ebc-98d0-c8b2b781febe">
                ai-studio-newcivicrelief-...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Master Admin:</span>
              <span className="text-emerald-300 font-sans font-semibold">Authorized ResQtech Authority</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Android Mobile:</span>
              <span className="text-emerald-400 font-sans font-semibold">PWA / Standalone WebAPK Ready</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {onOpenDeck ? (
            <button
              onClick={() => {
                onClose();
                onOpenDeck();
              }}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold underline"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View SIH 26068 Pitch Deck</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
