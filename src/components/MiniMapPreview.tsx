import React, { useState, useMemo } from 'react';
import { CareerProfile } from '../types';
import { formatCoordinates, getCompassDirection, calculateDistanceKm, calculateBearingDeg } from '../utils/geo';
import {
  MapPin,
  Navigation2,
  Compass,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Footprints,
  Car,
} from 'lucide-react';

interface MiniMapPreviewProps {
  profile: CareerProfile;
  hubLocation: {
    name: string;
    lat: number;
    lng: number;
  };
}

export const MiniMapPreview: React.FC<MiniMapPreviewProps> = ({ profile, hubLocation }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapStyle, setMapStyle] = useState<'radar' | 'satellite'>('radar');
  const [focusMode, setFocusMode] = useState<'fit' | 'user' | 'hub'>('fit');
  const [tileError, setTileError] = useState<boolean>(false);

  // Exact relative calculations
  const distanceKm = useMemo(() => {
    return profile.distanceKm !== undefined
      ? profile.distanceKm
      : calculateDistanceKm(hubLocation.lat, hubLocation.lng, profile.lat, profile.lng);
  }, [profile, hubLocation]);

  const bearingDeg = useMemo(() => {
    return profile.angleDeg !== undefined
      ? profile.angleDeg
      : calculateBearingDeg(hubLocation.lat, hubLocation.lng, profile.lat, profile.lng);
  }, [profile, hubLocation]);

  const compassDir = useMemo(() => getCompassDirection(bearingDeg), [bearingDeg]);

  // Rough travel time estimates based on direct distance
  const walkMinutes = Math.max(1, Math.round((distanceKm / 4.5) * 60));
  const driveMinutes = Math.max(1, Math.round((distanceKm / 28) * 60));

  // Latitude and Longitude deltas (1 deg lat ~ 111.32 km, 1 deg lng ~ 111.32 * cos(lat) km)
  const dLatKm = (profile.lat - hubLocation.lat) * 111.32;
  const avgLat = ((profile.lat + hubLocation.lat) / 2) * (Math.PI / 180);
  const dLngKm = (profile.lng - hubLocation.lng) * (111.32 * Math.cos(avgLat));

  // Map dimensions
  const mapWidth = 560;
  const mapHeight = 260;
  const centerX = mapWidth / 2;
  const centerY = mapHeight / 2;

  // Determine span in km to comfortably fit both points with padding
  const baseSpanKm = Math.max(distanceKm * 1.6, 1.2);
  const currentSpanKm = baseSpanKm / zoomLevel;

  // Pixels per km
  const pixelsPerKm = (Math.min(mapWidth, mapHeight) * 0.72) / currentSpanKm;

  // Coordinate projection offset based on focus mode
  let centerOffsetX = 0;
  let centerOffsetY = 0;

  if (focusMode === 'fit') {
    // Center is midpoint between hub and user
    centerOffsetX = (dLngKm / 2) * pixelsPerKm;
    centerOffsetY = (-dLatKm / 2) * pixelsPerKm;
  } else if (focusMode === 'user') {
    centerOffsetX = dLngKm * pixelsPerKm;
    centerOffsetY = -dLatKm * pixelsPerKm;
  } else {
    // Focus hub
    centerOffsetX = 0;
    centerOffsetY = 0;
  }

  // Hub coordinates on SVG canvas
  const hubX = centerX - centerOffsetX;
  const hubY = centerY - centerOffsetY;

  // Profile coordinates on SVG canvas (East is +X, North is -Y)
  const userX = hubX + dLngKm * pixelsPerKm;
  const userY = hubY - dLatKm * pixelsPerKm;

  // Concentric rings around hub for distance reference
  const rings = [0.5, 1, 2, 5, 10].filter((r) => r * pixelsPerKm < Math.max(mapWidth, mapHeight));

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.35, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.35, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setFocusMode('fit');
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${hubLocation.lat},${hubLocation.lng}&destination=${profile.lat},${profile.lng}`;

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3.5">
      {/* Mini-Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Relative Location & Mini-Map
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono text-emerald-400 font-semibold">
                {distanceKm} km · {compassDir} ({bearingDeg}°)
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Target in <span className="text-slate-200">{profile.locationName}</span> relative to <span className="text-cyan-300">{hubLocation.name}</span>
            </p>
          </div>
        </div>

        {/* Tactical Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setMapStyle('radar')}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                mapStyle === 'radar' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Tactical Radar HUD"
            >
              Radar HUD
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                mapStyle === 'satellite' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Cartographic Preview"
            >
              Satellite
            </button>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
              title="Reset View"
              aria-label="Reset view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mini-Map Visual Canvas / Scope */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner select-none">
        {/* Background Layer: Satellite or Radar Grid */}
        {mapStyle === 'satellite' && !tileError ? (
          <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
            <img
              src={`https://tile.openstreetmap.org/13/${Math.floor(((hubLocation.lng + 180) / 360) * Math.pow(2, 13))}/${Math.floor((1 - Math.log(Math.tan((hubLocation.lat * Math.PI) / 180) + 1 / Math.cos((hubLocation.lat * Math.PI) / 180)) / Math.PI) / 2 * Math.pow(2, 13))}.png`}
              alt="Map Tile Backdrop"
              className="w-full h-full object-cover filter contrast-125 brightness-75 invert hue-rotate-180"
              onError={() => setTileError(true)}
            />
            <div className="absolute inset-0 bg-slate-950/60" />
          </div>
        ) : null}

        {/* SVG Tactical Vector Scope */}
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="absolute inset-0 w-full h-full pointer-events-auto"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="miniGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="0.8" />
            </pattern>
            {/* Glow Filter */}
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="vectorGrad" x1={hubX} y1={hubY} x2={userX} y2={userY} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width={mapWidth} height={mapHeight} fill="url(#miniGrid)" />

          {/* Radial concentric rings centered on Hub */}
          {rings.map((ringKm) => {
            const rPx = ringKm * pixelsPerKm;
            return (
              <g key={`ring-${ringKm}`}>
                <circle
                  cx={hubX}
                  cy={hubY}
                  r={rPx}
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={hubX + rPx + 4}
                  y={hubY - 3}
                  fill="rgba(6, 182, 212, 0.5)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {ringKm}km
                </text>
              </g>
            );
          })}

          {/* Crosshair Axes at Hub */}
          <line
            x1={hubX - 24}
            y1={hubY}
            x2={hubX + 24}
            y2={hubY}
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="1"
          />
          <line
            x1={hubX}
            y1={hubY - 24}
            x2={hubX}
            y2={hubY + 24}
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="1"
          />

          {/* Connecting Displacement Vector Line */}
          <line
            x1={hubX}
            y1={hubY}
            x2={userX}
            y2={userY}
            stroke="url(#vectorGrad)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Distance Indicator along Vector */}
          <g transform={`translate(${(hubX + userX) / 2}, ${(hubY + userY) / 2})`}>
            <rect
              x="-32"
              y="-11"
              width="64"
              height="20"
              rx="4"
              fill="#020617"
              stroke="#059669"
              strokeWidth="1"
              opacity="0.92"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill="#34d399"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {distanceKm} km
            </text>
          </g>

          {/* HUB MARKER (Base station / Current Hub) */}
          <g transform={`translate(${hubX}, ${hubY})`} className="cursor-pointer" onClick={() => setFocusMode('hub')}>
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="14" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3">
              <animate attributeName="r" values="8;22" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="7" fill="#0891b2" filter="url(#cyanGlow)" />
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" />

            {/* Hub Label */}
            <g transform="translate(0, -16)">
              <rect
                x="-42"
                y="-13"
                width="84"
                height="16"
                rx="3"
                fill="#090d16"
                stroke="#0891b2"
                strokeWidth="0.8"
                opacity="0.9"
              />
              <text
                x="0"
                y="-1"
                textAnchor="middle"
                fill="#22d3ee"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                ● Hub: {hubLocation.name.slice(0, 10)}
              </text>
            </g>
          </g>

          {/* USER / TARGET MARKER */}
          <g transform={`translate(${userX}, ${userY})`} className="cursor-pointer" onClick={() => setFocusMode('user')}>
            {/* Sonar beacon pulse */}
            <circle cx="0" cy="0" r="16" fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.4">
              <animate attributeName="r" values="8;26" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle
              cx="0"
              cy="0"
              r="8"
              fill={profile.intentStatus === 'Hiring' ? '#3b82f6' : '#10b981'}
              filter="url(#emeraldGlow)"
            />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />

            {/* Target Label */}
            <g transform="translate(0, 24)">
              <rect
                x="-48"
                y="-14"
                width="96"
                height="18"
                rx="4"
                fill="#020617"
                stroke={profile.intentStatus === 'Hiring' ? '#3b82f6' : '#10b981'}
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x="0"
                y="-1"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                {profile.name.split(' ')[0]} ({profile.intentStatus})
              </text>
            </g>
          </g>
        </svg>

        {/* Top-Right HUD Coordinates Readout */}
        <div className="absolute top-2.5 right-2.5 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] font-mono space-y-0.5 text-right pointer-events-none">
          <div className="text-slate-400">
            Target Lat/Lng: <span className="text-emerald-400 font-semibold">{formatCoordinates(profile.lat, profile.lng)}</span>
          </div>
          <div className="text-slate-400">
            Hub Lat/Lng: <span className="text-cyan-400 font-semibold">{formatCoordinates(hubLocation.lat, hubLocation.lng)}</span>
          </div>
        </div>

        {/* Bottom-Left Compass Rose */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-300 pointer-events-none">
          <Navigation2
            className="w-3.5 h-3.5 text-emerald-400 transition-transform"
            style={{ transform: `rotate(${bearingDeg}deg)` }}
          />
          <span>Bearing: {bearingDeg}° {compassDir}</span>
        </div>

        {/* Bottom-Right Focus Mode Buttons */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg p-0.5 text-[10px] font-mono">
          <button
            onClick={() => setFocusMode('fit')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              focusMode === 'fit' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fit
          </button>
          <button
            onClick={() => setFocusMode('user')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              focusMode === 'user' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setFocusMode('hub')}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${
              focusMode === 'hub' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hub
          </button>
        </div>
      </div>

      {/* Proximity & Travel Insights Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 text-xs">
          <Footprints className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-mono block">Estimated Walk</span>
            <span className="font-mono text-slate-200 font-semibold">~{walkMinutes} mins</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 text-xs">
          <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 font-mono block">Drive / Transit</span>
            <span className="font-mono text-slate-200 font-semibold">~{driveMinutes} mins</span>
          </div>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-1.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-lg p-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] font-medium">Open in Google Maps</span>
          </div>
          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
        </a>
      </div>
    </div>
  );
};
