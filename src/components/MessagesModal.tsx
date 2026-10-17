import React, { useState } from 'react';
import { CareerProfile, ChatMessage } from '../types';
import { X, Send, Coffee, Paperclip, CheckCheck, MapPin, Sparkles } from 'lucide-react';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  connections: CareerProfile[];
  messages: ChatMessage[];
  onSendMessage: (receiverId: string, text: string, attachment?: ChatMessage['attachment']) => void;
  activeChatUser: CareerProfile | null;
  setActiveChatUser: (user: CareerProfile) => void;
  currentLocationName: string;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  connections,
  messages,
  onSendMessage,
  activeChatUser,
  setActiveChatUser,
  currentLocationName,
}) => {
  if (!isOpen) return null;

  const [inputText, setInputText] = useState('');

  const currentMessages = activeChatUser
    ? messages.filter(
        (m) =>
          (m.senderId === 'current_user' && m.receiverId === activeChatUser.id) ||
          (m.senderId === activeChatUser.id && m.receiverId === 'current_user')
      )
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatUser) return;
    onSendMessage(activeChatUser.id, inputText.trim());
    setInputText('');
  };

  const handleProposeCoffee = () => {
    if (!activeChatUser) return;
    onSendMessage(activeChatUser.id, `Would you be open to grabbing a quick coffee nearby in ${activeChatUser.locationName}?`, {
      type: 'coffee_invite',
      title: 'Coffee & Tech Sync Invite',
      detail: `Proposed venue: Coffee spot near ${activeChatUser.locationName}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Connected Contacts */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/60 shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Direct Messages</h3>
              <span className="text-[11px] font-mono text-emerald-400">
                Connected radar peers
              </span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {connections.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No active connections yet. Discover nearby peers on the radar and send connection requests!
              </div>
            ) : (
              connections.map((conn) => {
                const isActive = activeChatUser?.id === conn.id;
                return (
                  <button
                    key={conn.id}
                    onClick={() => setActiveChatUser(conn)}
                    className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      isActive ? 'bg-slate-800/80 text-white' : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                        <img
                          src={conn.avatar}
                          alt={conn.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold truncate text-white">
                          {conn.name}
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {conn.distanceKm} km
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {conn.roleTag}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Conversation Stream */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
          {activeChatUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                    <img
                      src={activeChatUser.avatar}
                      alt={activeChatUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      {activeChatUser.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span className="text-emerald-400">{activeChatUser.distanceKm} km away</span>
                      <span>·</span>
                      <span className="truncate">{activeChatUser.locationName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleProposeCoffee}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
                    title="Propose quick meetup"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Coffee Chat</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <Sparkles className="w-8 h-8 text-emerald-400/50 mb-2" />
                    <p className="text-xs font-mono text-slate-400">
                      Connected on Career Radar. Send a message to start collaborating!
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg) => {
                    const isMe = msg.senderId === 'current_user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 text-xs leading-relaxed ${
                            isMe
                              ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/15'
                              : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80'
                          }`}
                        >
                          <p>{msg.text}</p>

                          {/* Attachment Card if coffee invite or opportunity */}
                          {msg.attachment && (
                            <div
                              className={`mt-2.5 p-2.5 rounded-xl border flex items-start gap-2.5 ${
                                isMe
                                  ? 'bg-emerald-600/30 border-emerald-600/50 text-slate-950'
                                  : 'bg-slate-950/70 border-slate-700 text-slate-200'
                              }`}
                            >
                              <Coffee className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                              <div className="text-[11px]">
                                <span className="font-bold block">
                                  {msg.attachment.title}
                                </span>
                                <span className="opacity-80 block font-mono text-[10px]">
                                  {msg.attachment.detail}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 mt-1 px-1">
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleProposeCoffee}
                  className="p-2 text-slate-400 hover:text-amber-300 rounded-lg transition-colors cursor-pointer"
                  title="Quick Coffee Invite"
                >
                  <Coffee className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeChatUser.name.split(' ')[0]}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
