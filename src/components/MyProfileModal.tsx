import React, { useState } from 'react';
import { AvailabilityStatus } from '../types';
import { IntentStatusBadge } from './IntentStatusBadge';
import { GemmaSettingsModal } from './GemmaSettingsModal';
import { draftBioWithGemma, getGemmaConfig } from '../services/gemmaService';
import {
  X,
  ShieldCheck,
  User,
  Radio,
  Check,
  EyeOff,
  Briefcase,
  Search,
  Sparkles,
  Cpu,
  RefreshCw,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    headline: string;
    avatar: string;
    roleTag: string;
    bio: string;
    locationName: string;
    skills: string[];
    lookingFor: string;
    offering: string;
    availability: AvailabilityStatus;
    intentStatus: 'Hiring' | 'Looking';
    isVerified: boolean;
    verifiedLabel?: string;
  };
  onSaveProfile: (updated: {
    name: string;
    headline: string;
    roleTag: string;
    bio: string;
    skills: string[];
    lookingFor: string;
    offering: string;
    availability: AvailabilityStatus;
    intentStatus: 'Hiring' | 'Looking';
    isVerified: boolean;
  }) => void;
}

export const MyProfileModal: React.FC<MyProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [roleTag, setRoleTag] = useState(profile.roleTag);
  const [bio, setBio] = useState(profile.bio);
  const [skillsInput, setSkillsInput] = useState(profile.skills.join(', '));
  const [lookingFor, setLookingFor] = useState(profile.lookingFor);
  const [offering, setOffering] = useState(profile.offering);
  const [availability, setAvailability] = useState<AvailabilityStatus>(profile.availability);
  const [intentStatus, setIntentStatus] = useState<'Hiring' | 'Looking'>(profile.intentStatus || 'Looking');
  const [isVerified, setIsVerified] = useState(profile.isVerified);

  // Gemma AI Drafting & Private Mode State
  const [isGemmaSettingsOpen, setIsGemmaSettingsOpen] = useState(false);
  const [isBioDrafterOpen, setIsBioDrafterOpen] = useState(false);
  const [bioStyle, setBioStyle] = useState<'impactful' | 'technical' | 'visionary' | 'concise'>('impactful');
  const [isDrafting, setIsDrafting] = useState(false);
  const [gemmaResult, setGemmaResult] = useState<{
    headline: string;
    bio: string;
    lookingFor: string;
    offering: string;
    source: string;
    modelUsed: string;
  } | null>(null);
  const [gemmaConfig, setGemmaConfig] = useState(getGemmaConfig());

  const handleGenerateBio = async () => {
    setIsDrafting(true);
    try {
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const result = await draftBioWithGemma({
        name,
        currentHeadline: headline,
        roleTag,
        currentBio: bio,
        skills,
        intentStatus,
        locationName: profile.locationName,
        style: bioStyle,
      });

      setGemmaResult(result);
    } catch {
      // ignore
    } finally {
      setIsDrafting(false);
    }
  };

  const handleApplyGemmaDraft = () => {
    if (!gemmaResult) return;
    setBio(gemmaResult.bio);
    if (gemmaResult.headline) setHeadline(gemmaResult.headline);
    if (gemmaResult.lookingFor) setLookingFor(gemmaResult.lookingFor);
    if (gemmaResult.offering) setOffering(gemmaResult.offering);
    setIsBioDrafterOpen(false);
    setGemmaResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSaveProfile({
      name: name.trim(),
      headline: headline.trim(),
      roleTag: roleTag.trim(),
      bio: bio.trim(),
      skills,
      lookingFor: lookingFor.trim(),
      offering: offering.trim(),
      availability,
      intentStatus,
      isVerified,
    });
    onClose();
  };

  const AVAILABILITY_OPTIONS: { id: AvailabilityStatus; label: string; desc: string }[] = [
    { id: 'active', label: '🟢 Actively Looking for Roles', desc: 'Visible as career seeker ready for interviews' },
    { id: 'hiring', label: '🟣 Hiring Now / Broadcaster', desc: 'Recruiting for jobs or contracting opportunities' },
    { id: 'open_for_coffee', label: '☕ Open for Tech Coffee', desc: 'Casual informal meetups & idea exchange' },
    { id: 'mentoring', label: '🔵 Offering Mentorship', desc: 'Guiding junior and mid-level software builders' },
    { id: 'incognito', label: '⚪ Incognito / Invisible', desc: 'Scan radar silently without broadcasting your dot' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700">
              <img
                src={profile.avatar}
                alt={name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  My Career Radar Profile
                </h3>
                <IntentStatusBadge status={intentStatus} size="sm" />
              </div>
              <p className="text-xs text-slate-400">
                Discovered by nearby recruiters, founders, and peers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGemmaSettingsOpen(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors cursor-pointer ${
                gemmaConfig.mode === 'local'
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              }`}
              title="Gemma AI Settings & Private Mode"
            >
              {gemmaConfig.mode === 'local' ? (
                <>
                  <Lock className="w-3 h-3 text-purple-400" />
                  <span>Gemma Local</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  <span>Gemma Engine</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* User Intent: Hiring vs Looking */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Primary Intent Status Badge
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIntentStatus('Looking')}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                  intentStatus === 'Looking'
                    ? 'bg-blue-500/15 border-blue-500/50 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-blue-300">Looking</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Job & Roles Seeker</span>
                  </div>
                </div>
                {intentStatus === 'Looking' && <Check className="w-4 h-4 text-blue-400" />}
              </button>

              <button
                type="button"
                onClick={() => setIntentStatus('Hiring')}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                  intentStatus === 'Hiring'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-emerald-300">Hiring</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Recruiter & Provider</span>
                  </div>
                </div>
                {intentStatus === 'Hiring' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Airspace Availability Status
            </label>
            <div className="space-y-1.5">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAvailability(opt.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                    availability === opt.id
                      ? 'bg-slate-800 border-emerald-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block text-slate-200">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {opt.desc}
                    </span>
                  </div>
                  {availability === opt.id && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Radar Role Tag
              </label>
              <input
                type="text"
                value={roleTag}
                onChange={(e) => setRoleTag(e.target.value)}
                placeholder="e.g. Open to Roles & Projects"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          {/* Bio & Focus with Gemma AI Drafter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Bio & Focus
              </label>
              <button
                type="button"
                onClick={() => setIsBioDrafterOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-gradient-to-r from-purple-500/20 to-emerald-500/20 hover:from-purple-500/30 hover:to-emerald-500/30 border border-purple-500/40 text-purple-200 transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{isBioDrafterOpen ? 'Hide Gemma Drafter' : 'Draft Bio with Gemma AI'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                  {gemmaConfig.mode === 'local' ? '🔒 Local' : '⚡ Gemma 2'}
                </span>
              </button>
            </div>

            {/* Gemma Bio Drafter Interactive Drawer */}
            {isBioDrafterOpen && (
              <div className="bg-slate-950 border border-purple-500/40 rounded-xl p-3.5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-purple-500/20 text-purple-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        <span>Gemma 2 Bio & Portfolio Studio</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {gemmaConfig.mode === 'local'
                          ? `Local Private Inference (${gemmaConfig.modelName}) · 0 Data Leakage`
                          : 'Gemma 2 Neural Context Engine'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGemmaSettingsOpen(true)}
                    className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    Engine Settings
                  </button>
                </div>

                {/* Tone Style selector */}
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Select Tone Style:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    {(['impactful', 'technical', 'visionary', 'concise'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setBioStyle(st)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-mono capitalize border transition-colors cursor-pointer ${
                          bioStyle === st
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerateBio}
                  disabled={isDrafting}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isDrafting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing with Gemma 2...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Tailored Bio & Headline</span>
                    </>
                  )}
                </button>

                {/* Generated Output Preview */}
                {gemmaResult && (
                  <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3 space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Gemma Draft Ready
                      </span>
                      <span className="text-slate-400 text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Model: {gemmaResult.modelUsed}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">
                          Refined Headline:
                        </span>
                        <p className="text-slate-200 font-semibold">{gemmaResult.headline}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">
                          Crafted Bio:
                        </span>
                        <p className="text-slate-300 leading-relaxed italic bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                          "{gemmaResult.bio}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleApplyGemmaDraft}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Apply Draft to Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGemmaResult(null)}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Core Skills & Technologies (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Next.js"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          {/* Looking For & Offering */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                What You are Looking For
              </label>
              <textarea
                rows={2}
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                What You Offer
              </label>
              <textarea
                rows={2}
                value={offering}
                onChange={(e) => setOffering(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>
          </div>

          {/* Verification Badge Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-emerald-400 focus:ring-0 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">
                    Verified Practitioner Credential
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Displays verified checkmark and gives higher priority in smart matching.
                </span>
              </div>
            </label>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
            >
              Save Profile
            </button>
          </div>
        </form>

        {/* Gemma Engine Settings & Privacy Modal */}
        <GemmaSettingsModal
          isOpen={isGemmaSettingsOpen}
          onClose={() => setIsGemmaSettingsOpen(false)}
          onConfigChange={(cfg) => setGemmaConfig(cfg)}
        />
      </div>
    </div>
  );
};
