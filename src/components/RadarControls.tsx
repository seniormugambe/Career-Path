import React, { useState } from 'react';
import { IntentStatusBadge } from './IntentStatusBadge';
import { Radio, Filter, ShieldCheck, MapPin, Search, X, Briefcase } from 'lucide-react';

interface RadarControlsProps {
  radarActive: boolean;
  onToggleRadar: () => void;
  selectedRadiusKm: number;
  setSelectedRadiusKm: (radius: number) => void;
  activeFilter: 'all' | 'opportunity_provider' | 'founder' | 'mentor' | 'collaborator' | 'career_seeker';
  setActiveFilter: (filter: 'all' | 'opportunity_provider' | 'founder' | 'mentor' | 'collaborator' | 'career_seeker') => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verifiedOnly: boolean) => void;
  discoveredCount: number;
  totalNearbyCount: number;
  currentLocationName: string;
  openLocationModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openSearchModal: () => void;
  myIntentStatus: 'Hiring' | 'Looking';
  onToggleIntentStatus: () => void;
}

export const RadarControls: React.FC<RadarControlsProps> = ({
  radarActive,
  onToggleRadar,
  selectedRadiusKm,
  setSelectedRadiusKm,
  activeFilter,
  setActiveFilter,
  verifiedOnly,
  setVerifiedOnly,
  discoveredCount,
  totalNearbyCount,
  currentLocationName,
  openLocationModal,
  searchQuery,
  setSearchQuery,
  openSearchModal,
  myIntentStatus,
  onToggleIntentStatus,
}) => {
  const RADIUS_OPTIONS = [1, 3, 5, 10, 25];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
      {/* Top row: Radar Status, Discovered count & Location / Search buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onToggleRadar}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2 ${
              radarActive
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${radarActive ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
            <span>{radarActive ? 'Radar Active' : 'Radar Off'}</span>
          </button>

          {/* User's Own Intent Status Toggle */}
          <button
            onClick={onToggleIntentStatus}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            title="Click to toggle your intent between Looking and Hiring"
          >
            <span className="text-slate-400 text-[11px] hidden sm:inline">My Intent:</span>
            <IntentStatusBadge status={myIntentStatus} size="sm" />
          </button>

          <div className="text-xs text-slate-300 font-mono">
            <span className="text-emerald-400 font-bold tabular-nums">{discoveredCount}</span> discovered
            <span className="text-slate-500"> / </span>
            <span className="text-slate-400 tabular-nums">{totalNearbyCount} total in area</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={openSearchModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:text-white transition-colors cursor-pointer"
            title="Open comprehensive radar search"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search</span>
          </button>

          {/* Location Hub Button */}
          <button
            onClick={openLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentLocationName}</span>
          </button>
        </div>
      </div>

      {/* Wide Engine Search Bar */}
      <div className="pt-3 pb-2">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-emerald-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search radar airspace by skill, role, company or location (e.g. React, Co-Founder, Kololo, Nakawa)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 shadow-inner transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={openSearchModal}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-700/80 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer hidden sm:inline-flex items-center gap-1"
              title="Expand to Full Search Engine View"
            >
              <span>Expand</span>
              <kbd className="text-[10px] text-slate-400">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Quick Search Chips directly below search bar */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 text-[11px] font-mono">
          <span className="text-slate-500 shrink-0 text-[10px]">Filter:</span>
          {['React', 'TypeScript', 'Founder', 'Mentorship', 'Fintech', 'Kololo'].map((chip) => (
            <button
              key={chip}
              onClick={() => setSearchQuery(searchQuery === chip ? '' : chip)}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                searchQuery.toLowerCase() === chip.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {chip}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-300 underline text-[10px] ml-1 shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Middle row: Radius Selection Slider / Segmented Buttons */}
      <div className="pt-3 pb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span>Scanning Radius</span>
            <span className="text-slate-500 font-normal">·</span>
            <span className="font-mono text-emerald-400 tabular-nums">{selectedRadiusKm} km</span>
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            Proximity filter
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
          {RADIUS_OPTIONS.map((radius) => {
            const isSelected = selectedRadiusKm === radius;
            return (
              <button
                key={radius}
                onClick={() => setSelectedRadiusKm(radius)}
                className={`py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {radius} km
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Category Filter Buttons & Verified Toggle */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white text-slate-950 font-semibold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Active
          </button>
          <button
            onClick={() => setActiveFilter('opportunity_provider')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeFilter === 'opportunity_provider'
                ? 'bg-emerald-400 text-slate-950 font-semibold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Hiring / Jobs
          </button>
          <button
            onClick={() => setActiveFilter('career_seeker')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeFilter === 'career_seeker'
                ? 'bg-blue-400 text-slate-950 font-semibold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Looking for Roles
          </button>
          <button
            onClick={() => setActiveFilter('founder')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeFilter === 'founder'
                ? 'bg-purple-400 text-slate-950 font-semibold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Co-Founders
          </button>
          <button
            onClick={() => setActiveFilter('mentor')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeFilter === 'mentor'
                ? 'bg-sky-400 text-slate-950 font-semibold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Mentors
          </button>
          <button
            onClick={() => setActiveFilter('collaborator')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeFilter === 'collaborator'
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Collaborators
          </button>
        </div>

        {/* Verified toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded border-slate-700 bg-slate-950 text-emerald-400 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <ShieldCheck className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span className="whitespace-nowrap">Verified only</span>
        </label>
      </div>
    </div>
  );
};
