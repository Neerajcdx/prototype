export interface Coords {
  lat: number;
  lng: number;
}

export interface CityInfo {
  name: string;
  coords: Coords;
}

export const CITIES: Record<string, CityInfo> = {
  mumbai: { name: 'Mumbai, India', coords: { lat: 19.0760, lng: 72.8777 } },
  pune: { name: 'Pune, India', coords: { lat: 18.5204, lng: 73.8567 } },
  bangalore: { name: 'Bangalore, India', coords: { lat: 12.9716, lng: 77.5946 } },
  kanpur: { name: 'Kanpur, India', coords: { lat: 26.4499, lng: 80.3319 } },
  delhi: { name: 'Delhi, India', coords: { lat: 28.6139, lng: 77.2090 } },
  chicago: { name: 'Chicago, USA', coords: { lat: 41.8781, lng: -87.6298 } },
  london: { name: 'London, UK', coords: { lat: 51.5074, lng: -0.1278 } },
  frankfurt: { name: 'Frankfurt, Germany', coords: { lat: 50.1109, lng: 8.6821 } },
  singapore: { name: 'Singapore', coords: { lat: 1.3521, lng: 103.8198 } },
  tokyo: { name: 'Tokyo, Japan', coords: { lat: 35.6762, lng: 139.6503 } },
  sydney: { name: 'Sydney, Australia', coords: { lat: -33.8688, lng: 151.2093 } },
};

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 */
export function getDistanceKm(c1: Coords, c2: Coords): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLng = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Returns a random city that is NOT the specified one.
 */
export function getRandomAnomalousCity(excludeKey: string): CityInfo {
  const keys = Object.keys(CITIES).filter(k => k !== excludeKey.toLowerCase());
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return CITIES[randomKey];
}

/**
 * Parses time string (e.g. "02:30:15 AM") into minutes from a base reference
 * to calculate time differences in a simulation.
 */
export function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return Date.now() / 60000; // fallback
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[4].toUpperCase();
  
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}
