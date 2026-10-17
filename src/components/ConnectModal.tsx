import React, { useState } from 'react';
import { CareerProfile } from '../types';
import { X, Send, Coffee, Briefcase, Sparkles, GraduationCap } from 'lucide-react';

interface ConnectModalProps {
  profile: CareerProfile | null;
  onClose: () => void;
  onSendRequest: (targetProfile: CareerProfile, message: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  profile,
  onClose,
  onSendRequest,
}) => {
  if (!profile) return null;

  const defaultTemplates = [
    {
      id: 'coffee',
      label: 'Coffee Chat',
      icon: <Coffee className="w-3.5 h-3.5" />,
      text: `Hi ${profile.name.split(' ')[0]}, saw your beacon on Career Radar nearby in ${profile.locationName}. Would love to grab a 15-min coffee chat to discuss potential synergies!`,
    },
    {
      id: 'opportunity',
      label: 'Discuss Role',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      text: `Hi ${profile.name.split(' ')[0]}, I noticed your broadcast for ${profile.roleTag}. My engineering background in React & TypeScript matches your criteria closely. Let's connect!`,
    },
    {
      id: 'collab',
      label: 'Collaboration',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      text: `Hey ${profile.name.split(' ')[0]}, loved your profile and projects. I'm exploring active tech collaborations and hackathons around Kampala. Would be awesome to pair up.`,
    },
  ];

  const [message, setMessage] = useState(defaultTemplates[0].text);
  const [selectedTemplate, setSelectedTemplate] = useState('coffee');

  const handleSelectTemplate = (id: string, text: string) => {
    setSelectedTemplate(id);
    setMessage(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendRequest(profile, message.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              Connect with {profile.name}
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              {profile.distanceKm} km away · {profile.locationName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick Starter Templates */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Intro Message Template
            </label>
            <div className="flex flex-wrap gap-2">
              {defaultTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id, tpl.text)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedTemplate === tpl.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {tpl.icon}
                  <span>{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Personal Note
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a personalized note introducing yourself..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none font-sans"
              required
            />
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">
              Your Career Radar credentials and skills portfolio will be attached automatically.
            </span>
          </div>

          {/* Modal Actions */}
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
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Connection Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
