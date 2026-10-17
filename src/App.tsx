import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RadarScreen } from './components/RadarScreen';
import { RadarControls } from './components/RadarControls';
import { DiscoveryList } from './components/DiscoveryList';
import { ProfileModal } from './components/ProfileModal';
import { ConnectModal } from './components/ConnectModal';
import { BroadcastModal } from './components/BroadcastModal';
import { MessagesModal } from './components/MessagesModal';
import { MyProfileModal } from './components/MyProfileModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { SearchModal } from './components/SearchModal';
import { GemmaSettingsModal } from './components/GemmaSettingsModal';
import { ConnectionsView } from './components/ConnectionsView';
import { OpportunitiesView } from './components/OpportunitiesView';
import {
  CareerProfile,
  OpportunityBeacon,
  ConnectionRequest,
  ChatMessage,
  AvailabilityStatus,
  UserProfile,
} from './types';
import { INITIAL_USER_PROFILE, SEED_PROFILES } from './data/mockUsers';
import { calculateDistanceKm, calculateBearingDeg, HubLocation, POPULAR_TECH_HUBS } from './utils/geo';
import { playSonarPing, playBlipDetected } from './utils/audio';
import { Radio, MapPin, Navigation, ShieldCheck, Sparkles, Send, Coffee, AlertCircle, Search } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'radar' | 'opportunities' | 'connections' | 'messages'>('radar');
  const [radarActive, setRadarActive] = useState<boolean>(false);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(5);
  const [activeFilter, setActiveFilter] = useState<'all' | 'opportunity_provider' | 'founder' | 'mentor' | 'collaborator' | 'career_seeker'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Keyboard shortcut listener (Cmd/Ctrl + K to open search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // User Profile & Location
  const [myProfile, setMyProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [currentHubId, setCurrentHubId] = useState<string>('kampala');
  const [currentLocationName, setCurrentLocationName] = useState<string>('Kololo, Kampala');
  const [currentLat, setCurrentLat] = useState<number>(0.3476);
  const [currentLng, setCurrentLng] = useState<number>(32.5825);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(false);

  // Profiles and Beacons
  const [profiles, setProfiles] = useState<CareerProfile[]>(SEED_PROFILES);
  const [opportunities, setOpportunities] = useState<OpportunityBeacon[]>(() => {
    return SEED_PROFILES.filter((p) => p.activeOpportunity).map(
      (p) => p.activeOpportunity!
    );
  });

  // Connections and Messages
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([
    {
      id: 'req_1',
      fromUserId: 'user_2',
      fromUserName: 'Grace Nansubuga',
      fromUserAvatar: '/src/assets/images/avatar_startup_founder_1792225931380.jpg',
      fromUserHeadline: 'Founder & CEO @ FarmPulse · Nakawa Innovation Village',
      toUserId: 'current_user',
      toUserName: 'Alex Mugisha',
      message: 'Hey Alex! Discovered your profile on Career Radar nearby. We are building the farmer web platform in Nakawa and your React & TypeScript experience looks stellar. Would love to sync up!',
      status: 'pending',
      createdAt: '15m ago',
    },
  ]);

  const [connectedProfiles, setConnectedProfiles] = useState<CareerProfile[]>([
    SEED_PROFILES[0], // WavePay Africa pre-connected
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      conversationId: 'user_1',
      senderId: 'user_1',
      receiverId: 'current_user',
      text: 'Hello Alex! I discovered your profile on Career Radar. We are hiring a Senior React Developer for our merchant platform in Kololo. Are you available for a coffee chat nearby?',
      timestamp: '10:45 AM',
      attachment: {
        type: 'coffee_invite',
        title: 'WavePay Tech Coffee Chat',
        detail: 'Location: Cafe Javas, Lugogo Mall / Kololo',
      },
    },
  ]);

  // Modal States
  const [selectedProfile, setSelectedProfile] = useState<CareerProfile | null>(null);
  const [connectTargetProfile, setConnectTargetProfile] = useState<CareerProfile | null>(null);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState<boolean>(false);
  const [isGemmaSettingsOpen, setIsGemmaSettingsOpen] = useState<boolean>(false);
  const [activeChatUser, setActiveChatUser] = useState<CareerProfile | null>(SEED_PROFILES[0]);

  // Recalculate relative distances and bearings whenever location changes
  const updateProfilesForLocation = (lat: number, lng: number) => {
    setProfiles((prev) =>
      prev.map((profile) => {
        const distanceKm = calculateDistanceKm(lat, lng, profile.lat, profile.lng);
        const angleDeg = calculateBearingDeg(lat, lng, profile.lat, profile.lng);
        return {
          ...profile,
          distanceKm,
          angleDeg,
        };
      })
    );
  };

  // Turn on radar with realistic permission flow
  const handleActivateRadar = () => {
    if (!radarActive) {
      setShowPermissionPrompt(true);
    } else {
      setRadarActive(false);
    }
  };

  const handleGrantLocationPermission = (useDeviceGps: boolean = false) => {
    setShowPermissionPrompt(false);
    if (useDeviceGps && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const { latitude, longitude } = pos.coords;
          setCurrentLat(latitude);
          setCurrentLng(longitude);
          setCurrentLocationName(`GPS: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
          updateProfilesForLocation(latitude, longitude);
          setRadarActive(true);
          if (soundEnabled) playSonarPing(880, 0.35, 0.1);
        },
        () => {
          setIsLocating(false);
          // Fallback to Kampala default
          setRadarActive(true);
          if (soundEnabled) playSonarPing(880, 0.35, 0.1);
        },
        { timeout: 8000 }
      );
    } else {
      setRadarActive(true);
      if (soundEnabled) playSonarPing(880, 0.35, 0.1);
    }
  };

  const handleSelectHub = (hub: HubLocation) => {
    setCurrentHubId(hub.id);
    setCurrentLocationName(`${hub.name}, ${hub.country}`);
    setCurrentLat(hub.lat);
    setCurrentLng(hub.lng);

    // Adjust coordinates of seeds to be centered around the chosen hub
    setProfiles((prev) =>
      prev.map((p, idx) => {
        const offsetLat = (idx - 3) * 0.012 + (Math.sin(idx) * 0.008);
        const offsetLng = (idx - 2) * 0.014 + (Math.cos(idx) * 0.009);
        const pLat = hub.lat + offsetLat;
        const pLng = hub.lng + offsetLng;
        const dist = calculateDistanceKm(hub.lat, hub.lng, pLat, pLng);
        const bearing = calculateBearingDeg(hub.lat, hub.lng, pLat, pLng);

        return {
          ...p,
          lat: pLat,
          lng: pLng,
          locationName: `${p.locationName.split(',')[0]}, ${hub.name}`,
          distanceKm: dist,
          angleDeg: bearing,
        };
      })
    );
  };

  const handleUseBrowserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setCurrentLat(latitude);
        setCurrentLng(longitude);
        setCurrentLocationName('Current Device Location');
        updateProfilesForLocation(latitude, longitude);
        setIsLocationOpen(false);
        if (soundEnabled) playSonarPing(1100, 0.25, 0.08);
      },
      (err) => {
        setIsLocating(false);
        alert(`Location permission required: ${err.message}`);
      }
    );
  };

  // Broadcast a new career opportunity into airspace
  const handleBroadcastBeacon = (beacon: OpportunityBeacon) => {
    setOpportunities((prev) => [beacon, ...prev]);

    // Attach beacon to user profile as active opportunity
    setMyProfile((prev) => ({
      ...prev,
      availability: 'hiring',
      intentStatus: 'Hiring',
      roleTag: `Broadcasting · ${beacon.title}`,
    }));

    if (soundEnabled) playBlipDetected();
  };

  const handleToggleMyIntent = () => {
    const nextIntent = myProfile.intentStatus === 'Looking' ? 'Hiring' : 'Looking';
    setMyProfile((prev) => ({
      ...prev,
      intentStatus: nextIntent,
      type: nextIntent === 'Hiring' ? 'opportunity_provider' : 'career_seeker',
      availability: nextIntent === 'Hiring' ? 'hiring' : 'active',
      roleTag: nextIntent === 'Hiring' ? 'Hiring · Senior Software Engineers' : 'Open to Roles & High-Impact Projects',
    }));
    if (soundEnabled) playSonarPing(nextIntent === 'Hiring' ? 980 : 1260, 0.2, 0.08);
  };

  // Send Connection Request
  const handleSendConnectionRequest = (targetProfile: CareerProfile, introMessage: string) => {
    const newRequest: ConnectionRequest = {
      id: `req_${Date.now()}`,
      fromUserId: 'current_user',
      fromUserName: myProfile.name,
      fromUserAvatar: myProfile.avatar,
      fromUserHeadline: myProfile.headline,
      toUserId: targetProfile.id,
      toUserName: targetProfile.name,
      message: introMessage,
      status: 'pending',
      createdAt: 'Just now',
      opportunityTitle: targetProfile.activeOpportunity?.title,
    };

    setConnectionRequests((prev) => [newRequest, ...prev]);

    // Simulate real-time acceptance & warm reply after 2.5 seconds
    setTimeout(() => {
      setConnectedProfiles((prev) => {
        if (prev.some((p) => p.id === targetProfile.id)) return prev;
        return [targetProfile, ...prev];
      });

      const replyText = targetProfile.type === 'founder'
        ? `Hey ${myProfile.name.split(' ')[0]}! Thanks for reaching out via Career Radar! Your stack is exactly what we need. Let's schedule a call this week.`
        : targetProfile.type === 'mentor'
        ? `Delighted to connect, ${myProfile.name.split(' ')[0]}. Happy to look over your React architecture or discuss staff-level career roadmaps!`
        : `Great to connect, ${myProfile.name.split(' ')[0]}! Looking forward to chatting further.`;

      const replyMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId: targetProfile.id,
        senderId: targetProfile.id,
        receiverId: 'current_user',
        text: replyText,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, replyMessage]);
      if (soundEnabled) playBlipDetected();
    }, 2500);
  };

  // Accept incoming request
  const handleAcceptRequest = (request: ConnectionRequest) => {
    setConnectionRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: 'accepted' } : r))
    );

    const senderProfile = profiles.find((p) => p.id === request.fromUserId);
    if (senderProfile) {
      setConnectedProfiles((prev) => {
        if (prev.some((p) => p.id === senderProfile.id)) return prev;
        return [senderProfile, ...prev];
      });

      // Add their intro message into chat thread
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId: senderProfile.id,
        senderId: senderProfile.id,
        receiverId: 'current_user',
        text: request.message,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, newMsg]);
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    setConnectionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'declined' } : r))
    );
  };

  // Send Chat Message
  const handleSendMessage = (receiverId: string, text: string, attachment?: ChatMessage['attachment']) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: receiverId,
      senderId: 'current_user',
      receiverId,
      text,
      timestamp: 'Just now',
      attachment,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated quick reply from peer
    setTimeout(() => {
      const target = profiles.find((p) => p.id === receiverId);
      const replyMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        conversationId: receiverId,
        senderId: receiverId,
        receiverId: 'current_user',
        text: attachment
          ? `Sounds fantastic! Let's meet up. Does tomorrow at 3:00 PM work for you?`
          : `Thanks for the note! Let's coordinate our calendars and review details.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, replyMsg]);
      if (soundEnabled) playBlipDetected();
    }, 1800);
  };

  // Filter profiles by category, verified status, and search query
  const filteredProfiles = profiles.filter((p) => {
    if (verifiedOnly && !p.isVerified) return false;
    if (activeFilter !== 'all' && p.type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q) ||
        p.roleTag.toLowerCase().includes(q) ||
        p.locationName.toLowerCase().includes(q) ||
        p.company?.toLowerCase().includes(q) ||
        p.skills.some((sk) => sk.toLowerCase().includes(q)) ||
        (p.activeOpportunity &&
          (p.activeOpportunity.title.toLowerCase().includes(q) ||
            p.activeOpportunity.description.toLowerCase().includes(q)));
      if (!matchesSearch) return false;
    }
    return true;
  });

  const discoveredWithinRadius = filteredProfiles.filter(
    (p) => p.distanceKm <= selectedRadiusKm
  );

  const pendingRequestsCount = connectionRequests.filter(
    (r) => r.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract Compliant Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        radarActive={radarActive}
        onToggleRadar={handleActivateRadar}
        openBroadcastModal={() => setIsBroadcastOpen(true)}
        openProfileModal={() => setIsProfileOpen(true)}
        openLocationModal={() => setIsLocationOpen(true)}
        openSearchModal={() => setIsSearchOpen(true)}
        openGemmaSettings={() => setIsGemmaSettingsOpen(true)}
        currentLocationName={currentLocationName}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        unreadCount={messages.length > 0 ? 1 : 0}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'radar' && (
          <div className="space-y-6">
            {/* Top Tactical Controls */}
            <RadarControls
              radarActive={radarActive}
              onToggleRadar={handleActivateRadar}
              selectedRadiusKm={selectedRadiusKm}
              setSelectedRadiusKm={setSelectedRadiusKm}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              discoveredCount={discoveredWithinRadius.length}
              totalNearbyCount={profiles.length}
              currentLocationName={currentLocationName}
              openLocationModal={() => setIsLocationOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              openSearchModal={() => setIsSearchOpen(true)}
              myIntentStatus={myProfile.intentStatus}
              onToggleIntentStatus={handleToggleMyIntent}
            />

            {/* Split Grid: Radar Sonar Scope on Left, Discovered Feed on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Radar Screen Column (5 cols on lg) */}
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Sonar Scope
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Radius: {selectedRadiusKm} km
                  </span>
                </div>

                <RadarScreen
                  radarActive={radarActive}
                  onActivateRadar={handleActivateRadar}
                  profiles={filteredProfiles}
                  selectedRadiusKm={selectedRadiusKm}
                  selectedProfileId={selectedProfile?.id || null}
                  onSelectProfile={(p) => setSelectedProfile(p)}
                  soundEnabled={soundEnabled}
                  myProfileName={myProfile.name}
                />
              </div>

              {/* Discovery Feed Column (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-300">
                    Discovered Active Profiles ({discoveredWithinRadius.length})
                  </h2>
                  <span className="text-[11px] font-mono text-slate-500">
                    Sorted by Smart Match Score
                  </span>
                </div>

                <DiscoveryList
                  profiles={discoveredWithinRadius}
                  myProfile={myProfile}
                  onSelectProfile={(p) => setSelectedProfile(p)}
                  onConnect={(p) => setConnectTargetProfile(p)}
                  selectedProfileId={selectedProfile?.id || null}
                  radarActive={radarActive}
                  onActivateRadar={handleActivateRadar}
                />
              </div>
            </div>
          </div>
        )}

        {currentTab === 'opportunities' && (
          <OpportunitiesView
            opportunities={opportunities}
            profiles={profiles}
            onOpenBroadcastModal={() => setIsBroadcastOpen(true)}
            onSelectProfile={(p) => setSelectedProfile(p)}
            onConnect={(p) => setConnectTargetProfile(p)}
            mySkills={myProfile.skills}
          />
        )}

        {currentTab === 'connections' && (
          <ConnectionsView
            requests={connectionRequests}
            connections={connectedProfiles}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onOpenChat={(p) => {
              setActiveChatUser(p);
              setIsMessagesOpen(true);
            }}
            onSelectProfile={(p) => setSelectedProfile(p)}
          />
        )}

        {currentTab === 'messages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[78vh] overflow-hidden flex flex-col md:flex-row">
            {/* Embedded Messages view when navigating directly to Messages Tab */}
            <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/60 flex flex-col">
              <div className="p-4 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Active Dialogues</h3>
                <span className="text-[11px] font-mono text-emerald-400">
                  {connectedProfiles.length} connected peers
                </span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
                {connectedProfiles.map((conn) => (
                  <button
                    key={conn.id}
                    onClick={() => setActiveChatUser(conn)}
                    className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      activeChatUser?.id === conn.id
                        ? 'bg-slate-800/90 text-white'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                      <img
                        src={conn.avatar}
                        alt={conn.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">
                          {conn.name}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {conn.distanceKm} km
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {conn.roleTag}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
              {activeChatUser ? (
                <>
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                        <img
                          src={activeChatUser.avatar}
                          alt={activeChatUser.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {activeChatUser.name}
                        </h3>
                        <span className="text-[11px] font-mono text-emerald-400">
                          {activeChatUser.distanceKm} km away · {activeChatUser.locationName}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProfile(activeChatUser)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-800 hover:text-white transition-colors cursor-pointer"
                    >
                      View Dossier
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages
                      .filter(
                        (m) =>
                          (m.senderId === 'current_user' && m.receiverId === activeChatUser.id) ||
                          (m.senderId === activeChatUser.id && m.receiverId === 'current_user')
                      )
                      .map((msg) => {
                        const isMe = msg.senderId === 'current_user';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                              }`}
                            >
                              <p>{msg.text}</p>
                              {msg.attachment && (
                                <div className="mt-2 p-2 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-200 flex items-center gap-2">
                                  <Coffee className="w-4 h-4 text-amber-300 shrink-0" />
                                  <div className="text-[11px]">
                                    <span className="font-bold block">{msg.attachment.title}</span>
                                    <span className="text-[10px] font-mono text-slate-400">{msg.attachment.detail}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                              {msg.timestamp}
                            </span>
                          </div>
                        );
                      })}
                  </div>

                  <div className="p-3 border-t border-slate-800 bg-slate-950/40">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.currentTarget.elements.namedItem('msgInput') as HTMLInputElement);
                        if (input && input.value.trim()) {
                          handleSendMessage(activeChatUser.id, input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          handleSendMessage(
                            activeChatUser.id,
                            `Would you be open to grabbing coffee nearby in ${activeChatUser.locationName}?`,
                            {
                              type: 'coffee_invite',
                              title: 'Coffee Chat Invitation',
                              detail: `Proposed venue near ${activeChatUser.locationName}`,
                            }
                          );
                        }}
                        className="p-2 text-slate-400 hover:text-amber-300 rounded-lg transition-colors cursor-pointer"
                        title="Propose Coffee"
                      >
                        <Coffee className="w-4 h-4" />
                      </button>

                      <input
                        name="msgInput"
                        type="text"
                        placeholder={`Message ${activeChatUser.name.split(' ')[0]}...`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                      />

                      <button
                        type="submit"
                        className="p-2 rounded-xl text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  Select a contact on the left to start communicating.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Geolocation Permission Modal (Simulating step 2 of user story) */}
      {showPermissionPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Allow Location Access for Career Radar?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Career Radar discovers active recruiters, co-founders, and tech mentors around you. Your exact coordinates are never revealed to others—only approximate distance within your selected radius.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 mb-5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Scanning Hub: {currentLocationName}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                onClick={() => handleGrantLocationPermission(false)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Use Hub Location
              </button>
              <button
                onClick={() => handleGrantLocationPermission(true)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Allow GPS Geolocation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Detail Dossier Modal */}
      <ProfileModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onConnect={(p) => setConnectTargetProfile(p)}
        isConnected={connectedProfiles.some((p) => p.id === selectedProfile?.id)}
        onOpenChat={(p) => {
          setActiveChatUser(p);
          setIsMessagesOpen(true);
        }}
        myProfile={myProfile}
        currentHub={{
          id: currentHubId,
          name: POPULAR_TECH_HUBS.find((h) => h.id === currentHubId)?.name || currentLocationName || 'Current Hub',
          lat: currentLat,
          lng: currentLng,
          locationName: currentLocationName,
        }}
      />

      {/* Connect Modal */}
      <ConnectModal
        profile={connectTargetProfile}
        onClose={() => setConnectTargetProfile(null)}
        onSendRequest={handleSendConnectionRequest}
      />

      {/* Broadcast Opportunity Beacon Modal */}
      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        onBroadcast={handleBroadcastBeacon}
        currentLocationName={currentLocationName}
        currentLat={currentLat}
        currentLng={currentLng}
        myProfile={myProfile}
      />

      {/* Messages Dialog Modal (when opened from anywhere) */}
      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        connections={connectedProfiles}
        messages={messages}
        onSendMessage={handleSendMessage}
        activeChatUser={activeChatUser}
        setActiveChatUser={setActiveChatUser}
        currentLocationName={currentLocationName}
      />

      {/* Edit My Profile Modal */}
      <MyProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={myProfile}
        onSaveProfile={(updated) => setMyProfile((prev) => ({ ...prev, ...updated }))}
      />

      {/* Location Hub Switcher Modal */}
      <LocationPickerModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentHubId={currentHubId}
        onSelectHub={handleSelectHub}
        onUseBrowserLocation={handleUseBrowserLocation}
        isLocating={isLocating}
      />

      {/* Global Comprehensive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        profiles={profiles}
        opportunities={opportunities}
        onSelectProfile={(p) => setSelectedProfile(p)}
      />

      {/* Gemma AI Engine & Local Mode Settings */}
      <GemmaSettingsModal
        isOpen={isGemmaSettingsOpen}
        onClose={() => setIsGemmaSettingsOpen(false)}
      />
    </div>
  );
}
