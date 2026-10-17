import React, { useEffect, useRef, useState } from 'react';
import { CareerProfile, OpportunityBeacon } from '../types';
import { IntentStatusBadge } from './IntentStatusBadge';
import {
  Search,
  X,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Briefcase,
  Users,
  GraduationCap,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  DollarSign,
  Send,
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  profiles: CareerProfile[];
  opportunities: OpportunityBeacon[];
  onSelectProfile: (profile: CareerProfile) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  profiles,
  opportunities,
  onSelectProfile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'profiles' | 'opportunities'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [includeExtendedAirspace, setIncludeExtendedAirspace] = useState<boolean>(true);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const POPULAR_TAGS = [
    'React',
    'TypeScript',
    'Co-Founder',
    'Mentorship',
    'Full-Time',
    'Fintech',
    'Kololo',
    'Nakawa',
    'Tailwind CSS',
    'Node.js',
    'Bugolobi',
    'System Design',
  ];

  const trimmed = searchQuery.trim().toLowerCase();

  // Search profiles across all fields (skills, headline, bio, experience, company, location)
  const matchingProfiles = profiles.filter((p) => {
    if (verifiedOnly && !p.isVerified) return false;
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (!trimmed) return true;

    const matchesName = p.name.toLowerCase().includes(trimmed);
    const matchesHeadline = p.headline.toLowerCase().includes(trimmed);
    const matchesRoleTag = p.roleTag.toLowerCase().includes(trimmed);
    const matchesBio = p.bio.toLowerCase().includes(trimmed);
    const matchesLocation = p.locationName.toLowerCase().includes(trimmed);
    const matchesCompany = p.company?.toLowerCase().includes(trimmed);
    const matchesSkills = p.skills.some((sk) => sk.toLowerCase().includes(trimmed));
    const matchesExperience = p.experience?.some(
      (exp) =>
        exp.role.toLowerCase().includes(trimmed) || exp.company.toLowerCase().includes(trimmed)
    );
    const matchesLookingFor = p.lookingFor.toLowerCase().includes(trimmed);
    const matchesOffering = p.offering.toLowerCase().includes(trimmed);

    return (
      matchesName ||
      matchesHeadline ||
      matchesRoleTag ||
      matchesBio ||
      matchesLocation ||
      matchesCompany ||
      matchesSkills ||
      matchesExperience ||
      matchesLookingFor ||
      matchesOffering
    );
  });

  // Search opportunities across title, description, org, skills, location, compensation
  const matchingOpportunities = opportunities.filter((opp) => {
    if (verifiedOnly && !opp.isVerifiedOrg) return false;
    if (typeFilter !== 'all' && opp.type !== typeFilter) return false;
    if (!trimmed) return true;

    const matchesTitle = opp.title.toLowerCase().includes(trimmed);
    const matchesOrg = opp.organization.toLowerCase().includes(trimmed);
    const matchesDesc = opp.description.toLowerCase().includes(trimmed);
    const matchesLocation = opp.locationName.toLowerCase().includes(trimmed);
    const matchesSkills = opp.skills.some((sk) => sk.toLowerCase().includes(trimmed));
    const matchesComp = opp.compensation?.toLowerCase().includes(trimmed);

    return matchesTitle || matchesOrg || matchesDesc || matchesLocation || matchesSkills || matchesComp;
  });

  const getProfileForOpportunity = (creatorId: string) => {
    return profiles.find((p) => p.id === creatorId) || null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-10 sm:pt-14 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      {/* Expansive, wide search container (max-w-5xl) */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Main Search Input Engine Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search talent, skills, roles, co-founders, organizations or locations (e.g. React, Founder, Kololo)..."
              className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none pr-8 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer mr-2"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs font-mono text-slate-400 bg-slate-800/80 border border-slate-700/80 rounded-lg">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wide Engine Scope & Filter Strip */}
        <div className="px-5 py-3 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Result view tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Matches ({matchingProfiles.length + matchingOpportunities.length})
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'profiles'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Profiles ({matchingProfiles.length})
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'opportunities'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Beacons & Jobs ({matchingOpportunities.length})
            </button>
          </div>

          {/* Role type & Verified filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer font-mono"
            >
              <option value="all">All Role Types</option>
              <option value="opportunity_provider">Hiring / Companies</option>
              <option value="founder">Startup Founders</option>
              <option value="mentor">Mentors</option>
              <option value="collaborator">Collaborators</option>
              <option value="career_seeker">Job Seekers</option>
            </select>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-emerald-400 focus:ring-0 cursor-pointer"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Only</span>
            </label>
          </div>
        </div>

        {/* Quick Tag Recommendations Bar */}
        <div className="px-5 py-2.5 bg-slate-950/30 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-mono text-slate-500 shrink-0">Popular queries:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer shrink-0 ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Wide Dual-Grid / Multi-Column Results Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {matchingProfiles.length === 0 && matchingOpportunities.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Search className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-300 mb-1">
                No Results for "{searchQuery}"
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try widening your search terms (e.g. "React", "Frontend", "Founder", "Mentor") or clear the filters.
              </p>
            </div>
          ) : (
            <>
              {/* Profiles Section (shown if tab is 'all' or 'profiles') */}
              {(activeTab === 'all' || activeTab === 'profiles') && matchingProfiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span>Matching Career Profiles ({matchingProfiles.length})</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {matchingProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        onClick={() => {
                          onSelectProfile(profile);
                          onClose();
                        }}
                        className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-950 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                            <img
                              src={profile.avatar}
                              alt={profile.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                {profile.name}
                              </h4>
                              <IntentStatusBadge status={profile.intentStatus} size="sm" />
                              {profile.isVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                            </div>

                            <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                              {profile.roleTag}
                            </p>

                            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-1">
                              <span className="text-emerald-400">{profile.distanceKm} km away</span>
                              <span>·</span>
                              <span className="truncate">{profile.locationName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bio snippet */}
                        <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                          {profile.bio}
                        </p>

                        {/* Skills chips */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1 max-w-[70%]">
                            {profile.skills.slice(0, 3).map((sk) => {
                              const isQueryMatch = trimmed && sk.toLowerCase().includes(trimmed);
                              return (
                                <span
                                  key={sk}
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                    isQueryMatch
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                                  }`}
                                >
                                  {sk}
                                </span>
                              );
                            })}
                          </div>

                          <span className="text-xs font-mono text-slate-400 group-hover:text-emerald-300 flex items-center gap-1 shrink-0">
                            <span>Inspect</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunities & Beacons Section (shown if tab is 'all' or 'opportunities') */}
              {(activeTab === 'all' || activeTab === 'opportunities') && matchingOpportunities.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span>Matching Opportunity Beacons ({matchingOpportunities.length})</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {matchingOpportunities.map((opp) => {
                      const profile = getProfileForOpportunity(opp.creatorId);
                      return (
                        <div
                          key={opp.id}
                          onClick={() => {
                            if (profile) {
                              onSelectProfile(profile);
                              onClose();
                            }
                          }}
                          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-950 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                                  {opp.organization}
                                </span>
                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                                  {opp.title}
                                </h4>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                                {opp.postedAgo}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                              {opp.description}
                            </p>

                            {(opp.compensation || opp.equity) && (
                              <div className="text-xs font-mono bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 mb-3 flex items-center gap-2">
                                {opp.compensation && (
                                  <span className="font-semibold text-white">{opp.compensation}</span>
                                )}
                                {opp.compensation && opp.equity && <span>·</span>}
                                {opp.equity && (
                                  <span className="text-emerald-400 font-semibold">{opp.equity}</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span className="truncate max-w-[150px]">{opp.locationName}</span>
                            </span>

                            <span className="text-xs font-mono text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                              <span>View Dossier</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Wide Engine Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              Showing {matchingProfiles.length} profiles and {matchingOpportunities.length} opportunities
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close Search Engine
          </button>
        </div>
      </div>
    </div>
  );
};
