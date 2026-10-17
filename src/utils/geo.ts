/**
 * Geo calculation utilities: Haversine distance and compass bearing
 */

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function calculateBearingDeg(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaLambda = toRad(lon2 - lon1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  const bearing = (toDeg(theta) + 360) % 360;
  return Math.round(bearing);
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export interface HubLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
}

export const POPULAR_TECH_HUBS: HubLocation[] = [
  {
    id: 'kampala',
    name: 'Kampala',
    country: 'Uganda',
    lat: 0.3476,
    lng: 32.5825,
    description: 'Silicon Savannah, Nakawa Innovation Village & Kololo tech hubs',
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    lat: -1.2921,
    lng: 36.8219,
    description: 'Kilimani, Westlands & Silicon Savannah tech corridor',
  },
  {
    id: 'lagos',
    name: 'Lagos',
    country: 'Nigeria',
    lat: 6.5244,
    lng: 3.3792,
    description: 'Yaba tech cluster & Victoria Island innovation centers',
  },
  {
    id: 'kigali',
    name: 'Kigali',
    country: 'Rwanda',
    lat: -1.9441,
    lng: 30.0619,
    description: 'Norrsken House Kigali & Innovation City',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    description: 'Silicon Roundabout, Old Street & King’s Cross tech hub',
  },
  {
    id: 'san_francisco',
    name: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    description: 'SoMa, Mission District & South Bay startup corridor',
  },
];

export function getCompassDirection(bearingDeg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((bearingDeg % 360) + 360) % 360 / 22.5) % 16;
  return directions[index];
}

export function formatCoordinates(lat: number, lng: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lngStr}`;
}
