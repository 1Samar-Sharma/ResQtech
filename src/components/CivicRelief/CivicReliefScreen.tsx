import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  Radio,
  PlusCircle,
  Users,
  Home,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ChevronRight,
  Info,
  Compass,
} from 'lucide-react';
import {
  HelpRequest,
  VolunteerOffer,
  AidCategory,
  Coordinates,
  CommunityReport,
} from '../../types';
import { MutualAidModule } from '../MutualAid/MutualAidModule';
import { CommunityFeed } from '../CommunityFeed/CommunityFeed';
import { soundPlayer } from '../../utils/audio';

interface CivicReliefScreenProps {
  helpRequests: HelpRequest[];
  volunteers: VolunteerOffer[];
  communityReports: CommunityReport[];
  userLocation: Coordinates;
  userAddress: string;
  onRequestHelp: (request: any) => void;
  onOfferVolunteer: (offer: any) => void;
  onPledgeHelp: (requestId: string, volunteerName: string) => void;
  onOpenBroadcastModal?: () => void;
  onOpenSOSModal?: () => void;
  onVoteReport?: (reportId: string, type: 'up' | 'down') => void;
  onSubmitReport?: (report: any) => void;
  onAnalyzeReportWithAI?: (title: string, desc: string) => Promise<any>;
  onNavigateTab?: (tab: any) => void;
}

export const CivicReliefScreen: React.FC<CivicReliefScreenProps> = ({
  helpRequests = [],
  volunteers = [],
  communityReports = [],
  userLocation,
  userAddress,
  onRequestHelp,
  onOfferVolunteer,
  onPledgeHelp,
  onOpenBroadcastModal,
  onOpenSOSModal,
  onVoteReport,
  onSubmitReport,
  onAnalyzeReportWithAI,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'board' | 'feed' | 'request_form' | 'volunteer_form'>('board');

  // Filter out any AI-generated seeds or fake placeholders - genuine requests only
  const genuineRequests = useMemo(() => {
    return helpRequests.filter((r) => {
      if (!r) return false;
      if (r.id?.startsWith('req-seed') || r.id?.includes('seed')) return false;
      if (r.userId?.startsWith('civic-resident-10')) return false;
      if ((r as any).isAiGenerated || (r as any).isMock) return false;
      return true;
    });
  }, [helpRequests]);

  const handleReportEmergency = () => {
    soundPlayer.playBeep(880, 0.1);
    if (onOpenBroadcastModal) {
      onOpenBroadcastModal();
    } else if (onOpenSOSModal) {
      onOpenSOSModal();
    }
  };

  const handleRequestHelp = () => {
    soundPlayer.playBeep(720, 0.05);
    setActiveSubTab('request_form');
  };

  const handleOfferHelp = () => {
    soundPlayer.playBeep(640, 0.05);
    setActiveSubTab('volunteer_form');
  };

  const handleNearbyAlerts = () => {
    soundPlayer.playBeep(600, 0.04);
    setActiveSubTab('feed');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 px-3 sm:px-4 animate-fadeIn">
      {/* Header with Visual Identity */}
      <header className="pt-2 border-b border-white/10 pb-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <HeartHandshake className="w-6 h-6 text-emerald-400" />
                <span>Civic Relief</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                Secondary Feature
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              "A community emergency-response feature for reporting emergencies and requesting or offering help."
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[150px]">{userAddress}</span>
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 4 LARGE ACCESSIBLE PRIMARY ACTION BUTTONS */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. REPORT EMERGENCY */}
        <button
          id="civic-relief-report-emergency-btn"
          onClick={handleReportEmergency}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-xl shadow-red-950/50 border border-red-400/40 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between space-y-3 min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
              Live Alert
            </span>
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white leading-tight">
              REPORT EMERGENCY
            </div>
            <div className="text-xs text-red-100 mt-0.5">
              Broadcast critical community relief alert
            </div>
          </div>
        </button>

        {/* 2. REQUEST HELP */}
        <button
          id="civic-relief-request-help-btn"
          onClick={handleRequestHelp}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-xl shadow-amber-950/50 border border-amber-400/40 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between space-y-3 min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
              Mutual Aid
            </span>
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white leading-tight">
              REQUEST HELP
            </div>
            <div className="text-xs text-amber-100 mt-0.5">
              Food, shelter, medical or evacuation
            </div>
          </div>
        </button>

        {/* 3. OFFER HELP */}
        <button
          id="civic-relief-offer-help-btn"
          onClick={handleOfferHelp}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-xl shadow-emerald-950/50 border border-emerald-400/40 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between space-y-3 min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
              Volunteer
            </span>
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white leading-tight">
              OFFER HELP
            </div>
            <div className="text-xs text-emerald-100 mt-0.5">
              Register skills & pledge local aid
            </div>
          </div>
        </button>

        {/* 4. NEARBY ALERTS & SITUATION FEED */}
        <button
          id="civic-relief-nearby-alerts-btn"
          onClick={handleNearbyAlerts}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-xl shadow-blue-950/50 border border-sky-400/40 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between space-y-3 min-h-[120px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
              5km Feed
            </span>
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white leading-tight">
              NEARBY ALERTS
            </div>
            <div className="text-xs text-sky-100 mt-0.5">
              Citizen reports & live situation mesh
            </div>
          </div>
        </button>
      </section>

      {/* Sub-view switcher */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto text-xs scrollbar-thin">
        <button
          onClick={() => setActiveSubTab('board')}
          className={`px-4 py-2 rounded-2xl font-bold transition-all ${
            activeSubTab === 'board'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Active Aid Requests ({genuineRequests.length})
        </button>

        <button
          onClick={() => setActiveSubTab('feed')}
          className={`px-4 py-2 rounded-2xl font-bold transition-all ${
            activeSubTab === 'feed'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Nearby Situation Feed ({communityReports.length})
        </button>

        <button
          onClick={() => setActiveSubTab('request_form')}
          className={`px-4 py-2 rounded-2xl font-bold transition-all ${
            activeSubTab === 'request_form'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          + Request Aid Form
        </button>

        <button
          onClick={() => setActiveSubTab('volunteer_form')}
          className={`px-4 py-2 rounded-2xl font-bold transition-all ${
            activeSubTab === 'volunteer_form'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          + Volunteer Registration
        </button>
      </div>

      {/* Content Rendering */}
      {activeSubTab === 'feed' ? (
        <CommunityFeed
          reports={communityReports}
          userLocation={userLocation}
          onVote={onVoteReport || (() => {})}
          onSubmitReport={onSubmitReport || (() => {})}
          onAnalyzeWithAI={onAnalyzeReportWithAI || (async () => ({}))}
        />
      ) : (
        <MutualAidModule
          helpRequests={genuineRequests}
          volunteers={volunteers}
          userLocation={userLocation}
          userAddress={userAddress}
          onRequestHelp={onRequestHelp}
          onOfferVolunteer={onOfferVolunteer}
          onPledgeHelp={onPledgeHelp}
        />
      )}
    </div>
  );
};
