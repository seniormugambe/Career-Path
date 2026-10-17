import React, { useState } from 'react';
import { OpportunityBeacon, CareerProfile } from '../types';
import { Radio, ShieldCheck, MapPin, Sparkles, Send, Plus, Briefcase, Users, DollarSign, Clock, Search, X } from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: OpportunityBeacon[];
  profiles: CareerProfile[];
  onOpenBroadcastModal: () => void;
  onSelectProfile: (profile: CareerProfile) => void;
  onConnect: (profile: CareerProfile) => void;
  mySkills: string[];
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  profiles,
  onOpenBroadcastModal,
  onSelectProfile,
  onConnect,
  mySkills,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filtered = opportunities.filter((opp) => {
    if (filterType !== 'all' && opp.type !== filterType) return false;
    if (!trimmedQuery) return true;
    return (
      opp.title.toLowerCase().includes(trimmedQuery) ||
      opp.organization.toLowerCase().includes(trimmedQuery) ||
      opp.description.toLowerCase().includes(trimmedQuery) ||
      opp.locationName.toLowerCase().includes(trimmedQuery) ||
      opp.skills.some((s) => s.toLowerCase().includes(trimmedQuery))
    );
  });

  const getProfileForOpportunity = (creatorId: string) => {
    return profiles.find((p) => p.id === creatorId) || null;
  };

  return (
    <div className="space-y-6">
      {/* Header bar with Broadcast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Live Opportunity Airspace
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Proactively broadcasted roles, co-founder quests, mentorship slots, and contracts within local proximity.
          </p>
        </div>

        <button
          onClick={onOpenBroadcastModal}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-center shrink-0 shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast Opportunity</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunities by title, skills, organization, or location (e.g. React, FarmPulse, Kololo)..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Opportunities' },
          { id: 'full-time', label: 'Full-Time Jobs' },
          { id: 'co-founder', label: 'Co-Founders' },
          { id: 'mentorship', label: 'Mentorship' },
          { id: 'contract', label: 'Contracts' },
          { id: 'collaboration', label: 'Hackathons / Collab' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-white text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((opp) => {
          const profile = getProfileForOpportunity(opp.creatorId);
          const matchedSkills = opp.skills.filter((sk) =>
            mySkills.map((s) => s.toLowerCase()).includes(sk.toLowerCase())
          );

          return (
            <div
              key={opp.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Top Creator Info & Proximity */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                      <img
                        src={opp.creatorAvatar}
                        alt={opp.creatorName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">
                          {opp.organization}
                        </h4>
                        {opp.isVerifiedOrg && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        by {opp.creatorName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    {opp.postedAgo}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-emerald-300 mb-1.5">
                  {opp.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
                  {opp.description}
                </p>

                {/* Compensation & Equity strip */}
                {(opp.compensation || opp.equity) && (
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 mb-3 flex flex-wrap items-center gap-3 text-xs font-mono">
                    {opp.compensation && (
                      <span className="text-slate-200 font-semibold">
                        {opp.compensation}
                      </span>
                    )}
                    {opp.compensation && opp.equity && (
                      <span className="text-slate-600">·</span>
                    )}
                    {opp.equity && (
                      <span className="text-emerald-400 font-semibold">
                        {opp.equity}
                      </span>
                    )}
                  </div>
                )}

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {opp.skills.map((skill) => {
                    const isMatched = matchedSkills.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          isMatched
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer: Proximity & Action Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[160px]">{opp.locationName}</span>
                </div>

                <div className="flex items-center gap-2">
                  {profile && (
                    <button
                      onClick={() => onSelectProfile(profile)}
                      className="px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                    >
                      Dossier
                    </button>
                  )}
                  {profile && (
                    <button
                      onClick={() => onConnect(profile)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Express Interest</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
