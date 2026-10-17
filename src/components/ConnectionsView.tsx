import React from 'react';
import { ConnectionRequest, CareerProfile } from '../types';
import { IntentStatusBadge } from './IntentStatusBadge';
import { ShieldCheck, Check, X, Send, Coffee, MessageSquare, ArrowUpRight } from 'lucide-react';

interface ConnectionsViewProps {
  requests: ConnectionRequest[];
  connections: CareerProfile[];
  onAcceptRequest: (request: ConnectionRequest) => void;
  onDeclineRequest: (requestId: string) => void;
  onOpenChat: (profile: CareerProfile) => void;
  onSelectProfile: (profile: CareerProfile) => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  requests,
  connections,
  onAcceptRequest,
  onDeclineRequest,
  onOpenChat,
  onSelectProfile,
}) => {
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Connection Requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <span>Incoming Connection Requests</span>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                {pendingRequests.length} pending
              </span>
            )}
          </h3>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-500">
            No pending incoming requests. Other nearby professionals who discover you on the radar will show up here.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                    <img
                      src={req.fromUserAvatar}
                      alt={req.fromUserName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {req.fromUserName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {req.fromUserHeadline}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 italic">
                      "{req.message}"
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      Received {req.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onDeclineRequest(req.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Decline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAcceptRequest(req)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept & Connect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connected Network */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Connected Network ({connections.length})
          </h3>
        </div>

        {connections.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
            You haven’t connected with anyone yet. Explore the radar and connect with local founders, engineers, and mentors!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                    <img
                      src={conn.avatar}
                      alt={conn.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white truncate">
                        {conn.name}
                      </h4>
                      <IntentStatusBadge status={conn.intentStatus} size="sm" />
                      {conn.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {conn.roleTag}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 mt-1">
                      <span>{conn.distanceKm} km away</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 truncate">{conn.locationName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProfile(conn)}
                    className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>View Dossier</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenChat(conn)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
