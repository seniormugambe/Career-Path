import React from 'react';
import { CareerProfile, UserProfile } from '../types';
import { calculateSmartMatch } from '../utils/matching';
import { IntentStatusBadge } from './IntentStatusBadge';
import { ShieldCheck, MapPin, Sparkles, Send, Coffee, ArrowUpRight, CheckCircle2, Briefcase } from 'lucide-react';

interface DiscoveryListProps {
  profiles: CareerProfile[];
  myProfile: UserProfile;
  onSelectProfile: (profile: CareerProfile) => void;
  onConnect: (profile: CareerProfile) => void;
  selectedProfileId: string | null;
  radarActive: boolean;
  onActivateRadar: () => void;
}

export const DiscoveryList: React.FC<DiscoveryListProps> = ({
  profiles,
  myProfile,
  onSelectProfile,
  onConnect,
  selectedProfileId,
  radarActive,
  onActivateRadar,
}) => {
  if (!radarActive) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3">
          <MapPin className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Radar Scanning Paused</h4>
        <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
          Switch on the radar to probe your surrounding radius and reveal active opportunities, founders, mentors, and developers.
        </p>
        <button
          onClick={onActivateRadar}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
        >
          Activate Radar
        </button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
        <h4 className="text-sm font-bold text-white mb-1">No Active Profiles in this Scope</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try expanding your scanning radius or adjusting category filters to discover more active opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {profiles.map((profile) => {
        const match = calculateSmartMatch(myProfile, profile, profile.activeOpportunity);
        const isSelected = selectedProfileId === profile.id;

        return (
          <div
            key={profile.id}
            className={`group bg-slate-900/80 hover:bg-slate-900 border transition-all rounded-xl p-4 cursor-pointer relative ${
              isSelected
                ? 'border-emerald-500/60 ring-1 ring-emerald-500/30 bg-slate-900'
                : 'border-slate-800/90 hover:border-slate-700'
            }`}
            onClick={() => onSelectProfile(profile)}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Left Column: Avatar & Core Information */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-800">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Real-time active status pip */}
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-emerald-300 transition-colors">
                      {profile.name}
                    </h3>
                    {/* Explicit 'Hiring' or 'Looking' status badge */}
                    <IntentStatusBadge status={profile.intentStatus} size="sm" />
                    {profile.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono" title={profile.verifiedLabel || 'Verified'}>
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{profile.verifiedLabel}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-medium mt-1 truncate">
                    {profile.roleTag}
                  </p>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1.5 flex-wrap">
                    <span className="text-emerald-400 font-semibold">{profile.distanceKm} km away</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="truncate max-w-[150px]">{profile.locationName}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-500">Active {profile.lastActive}</span>
                  </div>

                  {/* Bio brief */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>

                  {/* Skills preview */}
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {profile.skills.slice(0, 4).map((skill) => {
                      const isMatching = match.matchingSkills
                        .map((s) => s.toLowerCase())
                        .includes(skill.toLowerCase());
                      return (
                        <span
                          key={skill}
                          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                            isMatching
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                    {profile.skills.length > 4 && (
                      <span className="text-[10px] font-mono text-slate-500">
                        +{profile.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Smart Match Score & Direct Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                {/* Match Score Badge */}
                <div className="flex sm:flex-col items-center sm:items-end gap-1.5">
                  <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-300 tabular-nums">
                      {match.score}% Match
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {match.roleSynergy}
                  </span>
                </div>

                {/* Primary Action Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConnect(profile);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProfile(profile);
                    }}
                    className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="View dossier"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Opportunity Beacon Bar (if present) */}
            {profile.activeOpportunity && (
              <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-semibold text-emerald-300 truncate">
                    Beacon: {profile.activeOpportunity.title}
                  </span>
                  {profile.activeOpportunity.compensation && (
                    <span className="hidden md:inline font-mono text-slate-400 text-[11px]">
                      · {profile.activeOpportunity.compensation}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-slate-500 shrink-0">
                  {profile.activeOpportunity.postedAgo}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
