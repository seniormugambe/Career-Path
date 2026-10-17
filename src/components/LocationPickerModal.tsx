import React, { useState } from 'react';
import { HubLocation, POPULAR_TECH_HUBS } from '../utils/geo';
import { X, MapPin, Navigation, Check } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHubId: string;
  onSelectHub: (hub: HubLocation) => void;
  onUseBrowserLocation: () => void;
  isLocating: boolean;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentHubId,
  onSelectHub,
  onUseBrowserLocation,
  isLocating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Scanning Hub Location
              </h3>
              <p className="text-xs text-slate-400">
                Calibrates Career Radar coordinates and local airspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Real Browser Geolocation Button */}
          <button
            onClick={onUseBrowserLocation}
            disabled={isLocating}
            className="w-full p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
              <div className="text-left">
                <span className="text-xs font-bold block">
                  {isLocating ? 'Acquiring GPS Fix...' : 'Use My Exact Device GPS'}
                </span>
                <span className="text-[11px] text-emerald-400/80 block font-mono">
                  Browser Geolocation API (Requests Permission)
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20">
              Active GPS
            </span>
          </button>

          {/* Preset Tech Innovation Hubs */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase font-mono block mb-2">
              Featured Tech Ecosystems
            </label>
            <div className="space-y-2">
              {POPULAR_TECH_HUBS.map((hub) => {
                const isSelected = currentHubId === hub.id;
                return (
                  <button
                    key={hub.id}
                    onClick={() => {
                      onSelectHub(hub);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {hub.name}, {hub.country}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {hub.description}
                      </span>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
