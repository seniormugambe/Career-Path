import React, { useState } from 'react';
import { OpportunityBeacon } from '../types';
import { GemmaSettingsModal } from './GemmaSettingsModal';
import { draftBeaconWithGemma, getGemmaConfig } from '../services/gemmaService';
import {
  X,
  Radio,
  Briefcase,
  Sparkles,
  MapPin,
  DollarSign,
  Clock,
  Cpu,
  RefreshCw,
  Lock,
  ArrowRight,
  Check,
} from 'lucide-react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (beacon: OpportunityBeacon) => void;
  currentLocationName: string;
  currentLat: number;
  currentLng: number;
  myProfile: {
    name: string;
    avatar: string;
    company?: string;
  };
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
  currentLocationName,
  currentLat,
  currentLng,
  myProfile,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<OpportunityBeacon['type']>('full-time');
  const [organization, setOrganization] = useState(myProfile.company || myProfile.name);
  const [description, setDescription] = useState('');
  const [compensation, setCompensation] = useState('');
  const [equity, setEquity] = useState('');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Tailwind CSS');
  const [radiusKm, setRadiusKm] = useState(10);

  // Gemma Beacon Drafter & Settings State
  const [isGemmaSettingsOpen, setIsGemmaSettingsOpen] = useState(false);
  const [isDrafterOpen, setIsDrafterOpen] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState<{
    title: string;
    description: string;
    skills: string[];
    compensation?: string;
    equity?: string;
    source: string;
    modelUsed: string;
  } | null>(null);
  const [gemmaConfig, setGemmaConfig] = useState(getGemmaConfig());

  const handleDraftWithGemma = async () => {
    setIsDrafting(true);
    try {
      const result = await draftBeaconWithGemma({
        category: type,
        promptIdea: draftPrompt || title || 'Software Engineer',
        locationName: currentLocationName,
        organization,
      });
      setDraftResult(result);
    } catch {
      // ignore
    } finally {
      setIsDrafting(false);
    }
  };

  const handleApplyDraft = () => {
    if (!draftResult) return;
    setTitle(draftResult.title);
    setDescription(draftResult.description);
    if (draftResult.skills && draftResult.skills.length > 0) {
      setSkillsInput(draftResult.skills.join(', '));
    }
    if (draftResult.compensation) {
      setCompensation(draftResult.compensation);
    }
    if (draftResult.equity) {
      setEquity(draftResult.equity);
    }
    setIsDrafterOpen(false);
    setDraftResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newBeacon: OpportunityBeacon = {
      id: `beacon_${Date.now()}`,
      creatorId: 'current_user',
      creatorName: myProfile.name,
      creatorAvatar: myProfile.avatar,
      title: title.trim(),
      type,
      organization: organization.trim() || 'Independent Project',
      description: description.trim(),
      compensation: compensation.trim() || undefined,
      equity: equity.trim() || undefined,
      skills,
      radiusKm,
      locationName: currentLocationName,
      lat: currentLat,
      lng: currentLng,
      postedAgo: 'Just now',
      isVerifiedOrg: true,
    };

    onBroadcast(newBeacon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Broadcast Career Beacon
              </h3>
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
          {/* Opportunity Type */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Beacon Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'full-time', label: 'Full-Time Role' },
                { id: 'co-founder', label: 'Co-Founder Search' },
                { id: 'contract', label: 'Contract / Freelance' },
                { id: 'mentorship', label: 'Offer Mentorship' },
                { id: 'collaboration', label: 'Hackathon / Collab' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setType(cat.id as OpportunityBeacon['type'])}
                  className={`py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer border text-center ${
                    type === cat.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gemma AI Beacon Drafter Button & Drawer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Opportunity Headline
              </label>
              <button
                type="button"
                onClick={() => setIsDrafterOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-gradient-to-r from-purple-500/20 to-emerald-500/20 hover:from-purple-500/30 hover:to-emerald-500/30 border border-purple-500/40 text-purple-200 transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{isDrafterOpen ? 'Hide Gemma Drafter' : 'Auto-Draft with Gemma AI'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                  {gemmaConfig.mode === 'local' ? '🔒 Local' : '⚡ Gemma 2'}
                </span>
              </button>
            </div>

            {/* Gemma Drafter Interactive Drawer */}
            {isDrafterOpen && (
              <div className="bg-slate-950 border border-purple-500/40 rounded-xl p-3.5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-purple-500/20 text-purple-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">
                        Gemma 2 Opportunity Drafter
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {gemmaConfig.mode === 'local'
                          ? `Local Private Mode (${gemmaConfig.modelName})`
                          : 'Gemma 2 Neural Context Engine'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGemmaSettingsOpen(true)}
                    className="text-[11px] font-mono text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    Settings
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    What are you looking for? (Brief keywords or idea):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={draftPrompt}
                      onChange={(e) => setDraftPrompt(e.target.value)}
                      placeholder="e.g. Senior React & TypeScript developer for mobile fintech"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleDraftWithGemma}
                      disabled={isDrafting}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      {isDrafting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Draft Result Box */}
                {draftResult && (
                  <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Gemma Broadcast Proposal
                      </span>
                      <span className="text-slate-400 text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {draftResult.modelUsed}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">
                          Title:
                        </span>
                        <p className="text-slate-200 font-semibold">{draftResult.title}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">
                          Description:
                        </span>
                        <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                          {draftResult.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                        {draftResult.compensation && (
                          <div>
                            <span className="text-slate-500 text-[10px] block">Comp:</span>
                            <span className="text-slate-200">{draftResult.compensation}</span>
                          </div>
                        )}
                        {draftResult.equity && (
                          <div>
                            <span className="text-slate-500 text-[10px] block">Equity:</span>
                            <span className="text-emerald-400">{draftResult.equity}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-slate-500 text-[10px] block">Skills:</span>
                          <span className="text-slate-300">{draftResult.skills.slice(0, 3).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleApplyDraft}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Apply to Beacon Form</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDraftResult(null)}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior React Developer needed for Fintech app"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          {/* Organization / Project Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Organization or Project Name
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Kampala Labs / Stealth AgriTech"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Description & Requirements
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you are looking for, team structure, tech stack, and what makes this special..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
              required
            />
          </div>

          {/* Compensation & Equity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Compensation / Budget
              </label>
              <input
                type="text"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                placeholder="e.g. $50k - $75k / yr or $3,500/mo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Equity / Stake (if applicable)
              </label>
              <input
                type="text"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                placeholder="e.g. 15% - 20% Co-founder equity"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Key Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS, GraphQL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          {/* Broadcast Radius Scope */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Broadcast Radius Scope
              </label>
              <span className="text-xs font-mono text-emerald-400">{radiusKm} km</span>
            </div>
            <div className="flex gap-2">
              {[3, 5, 10, 25, 50].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusKm(r)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                    radiusKm === r
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
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
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast into Airspace</span>
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
