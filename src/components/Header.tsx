import React from 'react';
import { Radio, Bell, MapPin, Volume2, VolumeX, ShieldCheck, Search, Cpu, Lock } from 'lucide-react';
import { getGemmaConfig } from '../services/gemmaService';

interface HeaderProps {
  currentTab: 'radar' | 'opportunities' | 'connections' | 'messages';
  setCurrentTab: (tab: 'radar' | 'opportunities' | 'connections' | 'messages') => void;
  radarActive: boolean;
  onToggleRadar: () => void;
  openBroadcastModal: () => void;
  openProfileModal: () => void;
  openLocationModal: () => void;
  openSearchModal: () => void;
  openGemmaSettings?: () => void;
  currentLocationName: string;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  unreadCount: number;
  pendingRequestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  radarActive,
  onToggleRadar,
  openBroadcastModal,
  openProfileModal,
  openLocationModal,
  openSearchModal,
  openGemmaSettings,
  currentLocationName,
  soundEnabled,
  setSoundEnabled,
  unreadCount,
  pendingRequestsCount,
}) => {
  const gemmaConfig = getGemmaConfig();
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('radar')}
            className="flex items-center gap-2.5 text-left text-white group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                Career Radar
              </span>
              <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                Local Opportunity Grid
              </span>
            </div>
          </button>

          {/* Quick Hub Selector Button */}
          <button
            onClick={openLocationModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors cursor-pointer ml-3"
            title="Change scanning hub location"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[140px]">{currentLocationName}</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => setCurrentTab('radar')}
            className={`whitespace-nowrap cursor-pointer transition-colors hover:text-white relative py-1 ${
              currentTab === 'radar' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Radar Scope
            {currentTab === 'radar' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('opportunities')}
            className={`whitespace-nowrap cursor-pointer transition-colors hover:text-white relative py-1 ${
              currentTab === 'opportunities' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Opportunities
            {currentTab === 'opportunities' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('connections')}
            className={`whitespace-nowrap cursor-pointer transition-colors hover:text-white relative py-1 flex items-center gap-1.5 ${
              currentTab === 'connections' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Connections
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono rounded">
                {pendingRequestsCount}
              </span>
            )}
            {currentTab === 'connections' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('messages')}
            className={`whitespace-nowrap cursor-pointer transition-colors hover:text-white relative py-1 flex items-center gap-1.5 ${
              currentTab === 'messages' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Messages
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono rounded">
                {unreadCount}
              </span>
            )}
            {currentTab === 'messages' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Wide Search Engine Trigger */}
          <button
            onClick={openSearchModal}
            className="flex items-center justify-between gap-2.5 w-auto sm:w-44 lg:w-56 px-3 py-1.5 rounded-lg border bg-slate-900 border-slate-700/80 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs cursor-pointer transition-colors"
            title="Search skills, roles, and profiles (Cmd+K)"
            aria-label="Open search engine"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px] text-slate-400 truncate">
                Search radar...
              </span>
            </div>
            <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Audio Ping Mute/Unmute */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:border-emerald-500/50'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Sonar sound active' : 'Sonar audio muted'}
            aria-label="Toggle sonar sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Gemma AI Engine / Private Mode Trigger */}
          {openGemmaSettings && (
            <button
              onClick={openGemmaSettings}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                gemmaConfig.mode === 'local'
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              }`}
              title="Gemma AI Settings & Private Mode"
            >
              {gemmaConfig.mode === 'local' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Gemma Local</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gemma 2</span>
                </>
              )}
            </button>
          )}

          {/* Broadcast Beacon CTA */}
          <button
            onClick={openBroadcastModal}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm shadow-emerald-500/20 whitespace-nowrap"
          >
            <span>Broadcast Beacon</span>
          </button>

          {/* Personal Profile Avatar / Settings */}
          <button
            onClick={openProfileModal}
            className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 hover:border-emerald-400 transition-colors cursor-pointer shrink-0 focus:outline-none"
            title="My Career Radar Profile"
          >
            <img
              src="/src/assets/images/avatar_frontend_dev_1792225931585.jpg"
              alt="My Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip for small screens */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 px-2 py-2 text-xs font-medium text-slate-400 bg-slate-950">
        <button
          onClick={() => setCurrentTab('radar')}
          className={`px-3 py-1.5 rounded-md cursor-pointer ${
            currentTab === 'radar' ? 'text-emerald-400 font-semibold bg-slate-900' : ''
          }`}
        >
          Radar
        </button>
        <button
          onClick={() => setCurrentTab('opportunities')}
          className={`px-3 py-1.5 rounded-md cursor-pointer ${
            currentTab === 'opportunities' ? 'text-emerald-400 font-semibold bg-slate-900' : ''
          }`}
        >
          Opportunities
        </button>
        <button
          onClick={() => setCurrentTab('connections')}
          className={`px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-1 ${
            currentTab === 'connections' ? 'text-emerald-400 font-semibold bg-slate-900' : ''
          }`}
        >
          Connections
          {pendingRequestsCount > 0 && (
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setCurrentTab('messages')}
          className={`px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-1 ${
            currentTab === 'messages' ? 'text-emerald-400 font-semibold bg-slate-900' : ''
          }`}
        >
          Messages
          {unreadCount > 0 && (
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};
