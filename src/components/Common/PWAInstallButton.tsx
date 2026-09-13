import React, { useState } from 'react';
import { Download, Smartphone, Check, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA / standalone APK, hide button
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  if (installSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-fadeIn">
        <Check className="w-3.5 h-3.5" />
        <span>Installed Successfully!</span>
      </div>
    );
  }

  // Android / Chromium / Desktop Install
  if (isInstallable) {
    if (variant === 'pill') {
      return (
        <button
          onClick={handleInstall}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer ${className}`}
          title="Install WeatherGPT native Android app to Home Screen"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install Android App</span>
        </button>
      );
    }

    if (variant === 'full') {
      return (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-sky-500/15 to-blue-500/15 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">WeatherGPT Android App Ready</h4>
              <p className="text-xs text-slate-300">
                Install to your phone home screen for instant offline forecast access and real-time civic disaster sirens.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer flex-shrink-0 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Install on Android</span>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleInstall}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95 cursor-pointer ${className}`}
        title="Install WeatherGPT on Android"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Install Android App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 text-xs font-bold transition-all ${className}`}
          title="Add to Home Screen"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Install WeatherGPT</h3>
              <div className="text-xs text-slate-300 space-y-2 mb-5 leading-relaxed">
                <p>1. Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.</p>
                <p>2. Scroll down and select <strong>Add to Home Screen</strong>.</p>
                <p>3. Tap <strong>Add</strong> in the top-right corner to launch WeatherGPT as a full standalone app.</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic fallback if user is on Android Chrome but beforeinstallprompt hasn't fired yet
  if (isAndroid) {
    return (
      <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 ${className}`}>
        <Smartphone className="w-3 h-3 text-emerald-400" />
        <span>Android Compatible</span>
      </div>
    );
  }

  return null;
};
