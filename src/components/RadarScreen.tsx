import React, { useState } from 'react';
import { CareerProfile } from '../types';
import { playBlipHover } from '../utils/audio';
import { Radio, Compass, ShieldCheck, Sparkles, User, Briefcase, GraduationCap, Users, Coffee } from 'lucide-react';

interface RadarScreenProps {
  radarActive: boolean;
  onActivateRadar: () => void;
  profiles: CareerProfile[];
  selectedRadiusKm: number;
  selectedProfileId: string | null;
  onSelectProfile: (profile: CareerProfile) => void;
  soundEnabled: boolean;
  myProfileName: string;
}

export const RadarScreen: React.FC<RadarScreenProps> = ({
  radarActive,
  onActivateRadar,
  profiles,
  selectedRadiusKm,
  selectedProfileId,
  onSelectProfile,
  soundEnabled,
  myProfileName,
}) => {
  const [hoveredProfile, setHoveredProfile] = useState<CareerProfile | null>(null);

  // Filter profiles within the selected radius
  const visibleProfiles = profiles.filter((p) => p.distanceKm <= selectedRadiusKm);

  // Helper to calculate pixel position inside a 500x500 radar scope
  const calculatePosition = (distanceKm: number, angleDeg: number) => {
    const center = 250;
    const maxRadiusPx = 215; // stay safely inside borders
    const normalizedDistance = Math.min(1, distanceKm / selectedRadiusKm);
    const radiusPx = normalizedDistance * maxRadiusPx;

    // Angle: 0 is North (up), 90 is East (right), etc.
    // In math standard, 0 is right, 90 is up.
    // So angle in standard math: (angleDeg - 90) * PI / 180
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const x = center + radiusPx * Math.cos(rad);
    const y = center + radiusPx * Math.sin(rad);

    return { x, y };
  };

  const getBlipColor = (type: string) => {
    switch (type) {
      case 'opportunity_provider':
        return 'bg-emerald-400 border-emerald-300 text-emerald-400 shadow-emerald-500/50';
      case 'founder':
        return 'bg-purple-400 border-purple-300 text-purple-400 shadow-purple-500/50';
      case 'mentor':
        return 'bg-sky-400 border-sky-300 text-sky-400 shadow-sky-500/50';
      case 'collaborator':
        return 'bg-amber-400 border-amber-300 text-amber-400 shadow-amber-500/50';
      case 'career_seeker':
        return 'bg-blue-400 border-blue-300 text-blue-400 shadow-blue-500/50';
      default:
        return 'bg-teal-400 border-teal-300 text-teal-400 shadow-teal-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity_provider':
        return <Briefcase className="w-3 h-3" />;
      case 'founder':
        return <Sparkles className="w-3 h-3" />;
      case 'mentor':
        return <GraduationCap className="w-3 h-3" />;
      case 'collaborator':
        return <Users className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Radar Container */}
      <div className="relative w-full max-w-[520px] aspect-square rounded-full border border-slate-800 bg-slate-950/80 shadow-2xl shadow-emerald-950/20 overflow-hidden flex items-center justify-center">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(16, 185, 129, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Concentric Sonar Distance Rings */}
        <div className="absolute w-[86%] h-[86%] rounded-full border border-emerald-500/15 pointer-events-none" />
        <div className="absolute w-[65%] h-[65%] rounded-full border border-emerald-500/15 pointer-events-none" />
        <div className="absolute w-[43%] h-[43%] rounded-full border border-emerald-500/20 pointer-events-none" />
        <div className="absolute w-[22%] h-[22%] rounded-full border border-emerald-500/25 pointer-events-none" />

        {/* Crosshairs & Diagonal Guidelines */}
        <div className="absolute w-full h-[1px] bg-emerald-500/15 pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-emerald-500/15 pointer-events-none" />
        <div className="absolute w-full h-[1px] bg-emerald-500/8 rotate-45 pointer-events-none" />
        <div className="absolute w-full h-[1px] bg-emerald-500/8 -rotate-45 pointer-events-none" />

        {/* Compass Cardinal Points */}
        <span className="absolute top-3 text-[11px] font-mono font-bold tracking-widest text-emerald-400/80 select-none">
          N
        </span>
        <span className="absolute right-3 text-[11px] font-mono font-bold tracking-widest text-emerald-400/80 select-none">
          E
        </span>
        <span className="absolute bottom-3 text-[11px] font-mono font-bold tracking-widest text-emerald-400/80 select-none">
          S
        </span>
        <span className="absolute left-3 text-[11px] font-mono font-bold tracking-widest text-emerald-400/80 select-none">
          W
        </span>

        {/* Distance Labels on concentric rings */}
        <span className="absolute top-[37%] right-[52%] text-[10px] font-mono text-emerald-500/60 select-none pointer-events-none">
          {(selectedRadiusKm * 0.25).toFixed(1)} km
        </span>
        <span className="absolute top-[26%] right-[52%] text-[10px] font-mono text-emerald-500/60 select-none pointer-events-none">
          {(selectedRadiusKm * 0.5).toFixed(1)} km
        </span>
        <span className="absolute top-[16%] right-[52%] text-[10px] font-mono text-emerald-500/60 select-none pointer-events-none">
          {(selectedRadiusKm * 0.75).toFixed(1)} km
        </span>
        <span className="absolute top-[6%] right-[52%] text-[10px] font-mono text-emerald-500/60 select-none pointer-events-none">
          {selectedRadiusKm.toFixed(1)} km
        </span>

        {/* Sweeping Radar Beam (Active Mode) */}
        {radarActive && (
          <div className="absolute inset-0 pointer-events-none animate-radar-sweep">
            <div
              className="w-1/2 h-1/2 absolute top-0 right-0 origin-bottom-left"
              style={{
                background:
                  'conic-gradient(from 0deg at 0% 100%, rgba(16, 185, 129, 0.32) 0deg, rgba(16, 185, 129, 0.08) 45deg, transparent 75deg)',
              }}
            />
            {/* The razor sweep lead line */}
            <div className="w-1/2 h-[1px] absolute top-1/2 right-0 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
        )}

        {/* Center Point - YOU */}
        <div className="absolute z-20 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {radarActive && (
              <span className="absolute w-8 h-8 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />
            )}
            <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-lg shadow-emerald-400/80 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
          </div>
          <span className="mt-1 text-[10px] font-mono font-semibold text-emerald-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
            YOU
          </span>
        </div>

        {/* Inactive Radar Overlay Prompt */}
        {!radarActive && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
              <Radio className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Career Radar Inactive
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
              Activate to scan within {selectedRadiusKm} km for active opportunities, startup founders, mentors, and local collaborators.
            </p>
            <button
              onClick={onActivateRadar}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Activate Career Radar</span>
            </button>
          </div>
        )}

        {/* Active Discovered Blips */}
        {radarActive &&
          visibleProfiles.map((profile) => {
            const { x, y } = calculatePosition(profile.distanceKm, profile.angleDeg);
            // Convert to percentage of 500px box
            const leftPct = (x / 500) * 100;
            const topPct = (y / 500) * 100;
            const isSelected = selectedProfileId === profile.id;
            const colorClass = getBlipColor(profile.type);

            return (
              <div
                key={profile.id}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                onMouseEnter={() => {
                  setHoveredProfile(profile);
                  if (soundEnabled) playBlipHover();
                }}
                onMouseLeave={() => setHoveredProfile(null)}
              >
                <button
                  onClick={() => onSelectProfile(profile)}
                  className={`group relative flex items-center justify-center w-8 h-8 rounded-full cursor-pointer focus:outline-none transition-transform hover:scale-125 ${
                    isSelected ? 'scale-125' : ''
                  }`}
                  aria-label={`View profile of ${profile.name}`}
                >
                  {/* Outer pulse beacon for opportunities */}
                  {profile.activeOpportunity && (
                    <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-beacon-ping pointer-events-none" />
                  )}

                  {/* Visual blip icon dot */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-slate-950 shadow-md ${colorClass} ${
                      isSelected ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    {getTypeIcon(profile.type)}
                  </div>
                </button>
              </div>
            );
          })}

        {/* Hover / Quick Preview Tooltip */}
        {hoveredProfile && (
          <div className="absolute bottom-4 left-4 right-4 z-30 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                <img
                  src={hoveredProfile.avatar}
                  alt={hoveredProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate">
                    {hoveredProfile.name}
                  </h4>
                  {hoveredProfile.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {hoveredProfile.roleTag}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 mt-0.5">
                  <span>{hoveredProfile.distanceKm} km away</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{hoveredProfile.locationName}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Radar Legend & Quick Stats */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 max-w-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
          <span>Job Seeker</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span>Hiring / Company</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
          <span>Startup Founder</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
          <span>Senior Mentor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
          <span>Collaborator</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
          <span>· Tap blip for full dossier</span>
        </div>
      </div>
    </div>
  );
};
