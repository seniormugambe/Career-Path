import React from 'react';
import { CareerProfile, UserProfile } from '../types';
import { calculateSmartMatch } from '../utils/matching';
import { IntentStatusBadge } from './IntentStatusBadge';
import { MiniMapPreview } from './MiniMapPreview';
import {
  X,
  ShieldCheck,
  MapPin,
  Sparkles,
  Send,
  Coffee,
  Briefcase,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Dribbble,
  Clock,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface ProfileModalProps {
  profile: CareerProfile | null;
  onClose: () => void;
  onConnect: (profile: CareerProfile) => void;
  isConnected: boolean;
  onOpenChat: (profile: CareerProfile) => void;
  myProfile: UserProfile;
  currentHub?: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    locationName?: string;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onConnect,
  isConnected,
  onOpenChat,
  myProfile,
  currentHub,
}) => {
  if (!profile) return null;

  const match = calculateSmartMatch(myProfile, profile, profile.activeOpportunity);

  const hubLocation = currentHub || {
    name: myProfile.locationName || 'Kampala Hub',
    lat: myProfile.lat || 0.3476,
    lng: myProfile.lng || 32.5825,
  };

  const getPortfolioIcon = (icon: string) => {
    switch (icon) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'dribbble':
        return <Dribbble className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-y-auto flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-emerald-400">
              Career Radar Dossier · {profile.distanceKm} km away
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Hero Profile Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-lg">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {profile.name}
                </h2>
                <IntentStatusBadge status={profile.intentStatus} size="md" />
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{profile.verifiedLabel || 'Verified'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-sm font-medium text-slate-200">
                  {profile.roleTag}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-2 flex-wrap">
                <span className="text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.locationName}
                </span>
                <span>·</span>
                <span>Active {profile.lastActive}</span>
              </div>
            </div>
          </div>

          {/* Smart Match Breakdown Card */}
          <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Smart Match Synergy
                </h4>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
                {match.score}% Compatible
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              {match.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini-Map Proximity Preview */}
          <MiniMapPreview profile={profile} hubLocation={hubLocation} />

          {/* Active Broadcast Beacon Section (if active) */}
          {profile.activeOpportunity && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Live Career Beacon
                </h4>
                <span className="text-[10px] font-mono text-slate-500 ml-auto">
                  Broadcasted {profile.activeOpportunity.postedAgo}
                </span>
              </div>

              <h3 className="text-sm font-bold text-emerald-300 mb-1">
                {profile.activeOpportunity.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {profile.activeOpportunity.description}
              </p>

              {(profile.activeOpportunity.compensation || profile.activeOpportunity.equity) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {profile.activeOpportunity.compensation && (
                    <div>
                      <span className="text-slate-500 text-[11px] block">Compensation:</span>
                      <span className="text-slate-200 font-semibold">{profile.activeOpportunity.compensation}</span>
                    </div>
                  )}
                  {profile.activeOpportunity.equity && (
                    <div>
                      <span className="text-slate-500 text-[11px] block">Equity Share:</span>
                      <span className="text-emerald-400 font-semibold">{profile.activeOpportunity.equity}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase font-mono text-slate-400 tracking-wider mb-2">
              Background & Vision
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Looking For & Offering */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1">
                Actively Seeking
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {profile.lookingFor}
              </p>
            </div>
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1">
                Offering & Expertise
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {profile.offering}
              </p>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase font-mono text-slate-400 tracking-wider mb-2.5">
              Core Skills & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          {profile.experience && profile.experience.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase font-mono text-slate-400 tracking-wider mb-2.5">
                Verified Experience
              </h4>
              <div className="space-y-2.5">
                {profile.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{exp.role}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{exp.company}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">{exp.period}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio & Web Links */}
          {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase font-mono text-slate-400 tracking-wider mb-2.5">
                Portfolios & Channels
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.portfolioLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {getPortfolioIcon(link.icon)}
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 z-10 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Dossier
          </button>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(profile);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open Messages</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onConnect(profile);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Propose Connection</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
