export interface Activity {
  id: string;
  username: string;
  role: string;
  timestamp: string;
  resource: string;
  action: string;
  volume: number; // in MB or Records
  ipAddress: string;
  location: string;
  riskContribution: number;
  isAnomaly: boolean;
  anomalyReason: string;
  honeytokenTriggered: string | null;
  coords?: { lat: number; lng: number };
  distanceKm?: number;
  isImpossibleTravel?: boolean;
  speedKmH?: number;
  prevLocation?: string;
  timeGapMinutes?: number;
}

export interface UserSession {
  username: string;
  role: string;
  avatar: string;
  currentRiskScore: number;
  status: 'ACTIVE' | 'MFA_REQUIRED' | 'SUSPENDED' | 'UNDER_REVIEW';
  ipAddress: string;
  location: string;
  lastActive: string;
  riskFactors: { factor: string; score: number }[];
  credentialId: string;
  homeBase?: string;
  homeBaseCoords?: { lat: number; lng: number };
  currentCoords?: { lat: number; lng: number };
}

export type HoneytokenType = 'CREDENTIAL' | 'DATABASE_TABLE' | 'ADMIN_PORTAL' | 'CONFIG_FILE';

export interface Honeytoken {
  id: string;
  name: string;
  type: HoneytokenType;
  description: string;
  location: string;
  status: 'UNTOUCHED' | 'TRIGGERED';
  triggeredBy: string | null;
  triggeredAt: string | null;
}

export interface Alert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'CONFIRMED' | 'SUSPECTED'; // Confirmed = Honeytoken, Suspected = Behavioral Anomaly
  title: string;
  description: string;
  username: string;
  timestamp: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CONTAINED';
  honeytokenName: string | null;
  rekeyTriggered: boolean;
  rekeyDurationMs: number | null;
  timeline: { time: string; message: string; phase: 'DETECT' | 'ANALYZE' | 'VAULT_TRIGGER' | 'ROTATE' | 'SECURED' }[];
}

export interface VaultCredential {
  id: string;
  name: string;
  owner: string;
  type: 'API_KEY' | 'ROOT_PASSWORD' | 'SSH_KEY' | 'DB_CONN_STRING';
  cipherType: 'RSA-4096 (Vulnerable)' | 'Kyber-1024 (Quantum-Resistant)';
  originalValue: string;
  encryptedValue: string;
  lastRotated: string;
  rotationCount: number;
  isQuantumProof: boolean;
}

export interface AccessPolicy {
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scoreRange: string;
  mfaEnforced: boolean;
  accessRestricted: boolean;
  autoRekeyTriggered: boolean;
  sessionTermination: boolean;
  description: string;
}
