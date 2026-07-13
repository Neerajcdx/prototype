import React, { useState, useEffect, useCallback } from 'react';
import { UserSession, Honeytoken, Alert, Activity, VaultCredential } from './types';
import {
  INITIAL_USERS,
  INITIAL_HONEYTOKENS,
  INITIAL_CREDENTIALS,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
  ACCESS_POLICIES,
  NORMAL_RESOURCES,
  ANOMALOUS_RESOURCES,
  generatePostQuantumCipher
} from './data/mockData';
import { getDistanceKm, parseTimeToMinutes, CITIES } from './utils/geoUtils';

// Component imports
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import RiskTrendChart from './components/RiskTrendChart';
import InsiderThreatEngine from './components/InsiderThreatEngine';
import HoneytokenMesh from './components/HoneytokenMesh';
import QuantumVault from './components/QuantumVault';
import AlertsPanel from './components/AlertsPanel';
import PolicyEngine from './components/PolicyEngine';

import { Shield, KeyRound, Radio, Zap, Clock, ShieldAlert, Sparkles, Terminal, Bell } from 'lucide-react';

export default function App() {
  // --- CORE STATE ---
  const [users, setUsers] = useState<UserSession[]>(INITIAL_USERS);
  const [honeytokens, setHoneytokens] = useState<Honeytoken[]>(INITIAL_HONEYTOKENS);
  const [credentials, setCredentials] = useState<VaultCredential[]>(INITIAL_CREDENTIALS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [rekeyHistory, setRekeyHistory] = useState<{ time: string; credName: string; user: string; duration: number }[]>([]);

  // Selection states
  const [selectedUsername, setSelectedUsername] = useState<string>('admin_raj');
  const [selectedAlertId, setSelectedAlertId] = useState<string>('alert_001');

  // Navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'behavioral' | 'decoys' | 'vault' | 'alerts' | 'policies'>('dashboard');

  // Live simulation event trackers
  const [lastRotatedCredId, setLastRotatedCredId] = useState<string | null>(null);
  const [lastRotatedTimestamp, setLastRotatedTimestamp] = useState<string | null>(null);
  const [triggerType, setTriggerType] = useState<'NONE' | 'HONEYTOKEN' | 'ANOMALY'>('NONE');
  const [triggerEventTime, setTriggerEventTime] = useState<string | null>(null);
  const [showAutoRekeyBanner, setShowAutoRekeyBanner] = useState<boolean>(false);
  const [bannerUser, setBannerUser] = useState<string>('');

  // --- TIME UTILS ---
  const getFormattedTime = () => {
    const d = new Date();
    let hh = d.getHours();
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12;
    hh = hh ? hh : 12; // hour '0' should be '12'
    return `${String(hh).padStart(2, '0')}:${mm}:${ss} ${ampm}`;
  };

  // --- LOG ROTATION / REKEY MECHANISM ---
  const executeAutoRekey = useCallback((userObj: UserSession, honeytokenName: string | null) => {
    const timestamp = getFormattedTime();
    
    // 1. Locate credential for this user
    const credToRotate = credentials.find(c => c.id === userObj.credentialId);
    if (!credToRotate) return;

    // 2. Perform rotation and upgrade to Kyber-1024 Quantum-Resistant algorithm
    const rotatedCreds = credentials.map(c => {
      if (c.id === userObj.credentialId) {
        return {
          ...c,
          isQuantumProof: true,
          cipherType: 'Kyber-1024 (Quantum-Resistant)' as const,
          encryptedValue: generatePostQuantumCipher(c.originalValue),
          rotationCount: c.rotationCount + 1,
          lastRotated: `${new Date().toISOString().slice(0,10)} ${timestamp}`
        };
      }
      return c;
    });

    setCredentials(rotatedCreds);
    setLastRotatedCredId(userObj.credentialId);
    setLastRotatedTimestamp(timestamp);

    // 3. Append to rotation history
    setRekeyHistory(prev => [
      {
        time: timestamp,
        credName: credToRotate.name,
        user: userObj.username,
        duration: 0.28 // Secured in 280ms
      },
      ...prev
    ]);

    // 4. Trigger visual banner notification
    setBannerUser(userObj.username);
    setShowAutoRekeyBanner(true);
  }, [credentials]);

  // --- ACTION: MANUAL ROTATE ---
  const handleManualRotate = (credId: string) => {
    const timestamp = getFormattedTime();
    const credToRotate = credentials.find(c => c.id === credId);
    if (!credToRotate) return;

    const rotated = credentials.map(c => {
      if (c.id === credId) {
        return {
          ...c,
          isQuantumProof: true,
          cipherType: 'Kyber-1024 (Quantum-Resistant)' as const,
          encryptedValue: generatePostQuantumCipher(c.originalValue),
          rotationCount: c.rotationCount + 1,
          lastRotated: `${new Date().toISOString().slice(0,10)} ${timestamp}`
        };
      }
      return c;
    });

    setCredentials(rotated);
    setRekeyHistory(prev => [
      {
        time: timestamp,
        credName: credToRotate.name,
        user: credToRotate.owner,
        duration: 0.24
      },
      ...prev
    ]);
  };

  // --- SIMULATION ACTION: TRIGGER HONEYTOKEN BREACH ---
  const handleTriggerHoneytoken = () => {
    const timestamp = getFormattedTime();
    
    // Choose an untouched decoy honeytoken
    const untouchedDecoys = honeytokens.filter(ht => ht.status === 'UNTOUCHED');
    if (untouchedDecoys.length === 0) return;
    const chosenDecoy = untouchedDecoys[Math.floor(Math.random() * untouchedDecoys.length)];

    // Suspect actor: Let's assign it to vendor_acct_09 for maximum demo satisfaction
    const suspectUsername = 'vendor_acct_09';
    const suspectUserObj = users.find(u => u.username === suspectUsername)!;

    // 1. Mark Decoy as TRIGGERED
    const updatedDecoys = honeytokens.map(ht => {
      if (ht.id === chosenDecoy.id) {
        return {
          ...ht,
          status: 'TRIGGERED' as const,
          triggeredBy: suspectUsername,
          triggeredAt: timestamp
        };
      }
      return ht;
    });
    setHoneytokens(updatedDecoys);

    // 2. Spike the suspect's risk score to 98 (CRITICAL)
    const updatedUsers = users.map(u => {
      if (u.username === suspectUsername) {
        return {
          ...u,
          currentRiskScore: 98,
          status: 'SUSPENDED' as const,
          riskFactors: [
            { factor: `🚨 SEVERE: Triggered Honeytoken: ${chosenDecoy.name}`, score: 60 },
            ...u.riskFactors
          ]
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    // 3. Append highly critical activity log
    const newActivity: Activity = {
      id: `act_ht_trigger_${Date.now()}`,
      username: suspectUsername,
      role: suspectUserObj.role,
      timestamp,
      resource: chosenDecoy.location,
      action: 'DECRYPT',
      volume: 1,
      ipAddress: suspectUserObj.ipAddress,
      location: suspectUserObj.location,
      riskContribution: 60,
      isAnomaly: true,
      anomalyReason: `Honeytoken Breach: Read access to decoy asset purposed to trap insider threats.`,
      honeytokenTriggered: chosenDecoy.name
    };
    setActivities(prev => [newActivity, ...prev]);

    // 4. Create confirmed security alert
    const newAlert: Alert = {
      id: `alert_ht_${Date.now().toString().slice(-3)}`,
      severity: 'CRITICAL',
      type: 'CONFIRMED',
      title: `Decoy Honeytoken Compromised: ${chosenDecoy.name}`,
      description: `Insider threat detected. User ${suspectUsername} touched high-value decoy asset ${chosenDecoy.name} at location ${chosenDecoy.location}. Touch events are deterministic indicators of privilege misuse.`,
      username: suspectUsername,
      timestamp,
      status: 'CONTAINED',
      honeytokenName: chosenDecoy.name,
      rekeyTriggered: true,
      rekeyDurationMs: 280,
      timeline: [
        { time: timestamp, message: `Access attempt detected on restricted honeypot resource`, phase: 'DETECT' },
        { time: timestamp, message: `Deterministic trap confirmed: Zero false-positive signature matching`, phase: 'ANALYZE' },
        { time: timestamp, message: `Automated containment: Session terminated & associated user accounts locked`, phase: 'VAULT_TRIGGER' },
        { time: timestamp, message: `PQC Vault called: Revolving Master encryption key to Kyber-1024`, phase: 'ROTATE' },
        { time: timestamp, message: `Decoy defense closed: Credentials rotated and fully secured in 280ms`, phase: 'SECURED' }
      ]
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    setSelectedAlertId(newAlert.id);

    // 5. Update chart telemetry metrics
    setTriggerType('HONEYTOKEN');
    setTriggerEventTime(timestamp);

    // 6. EXECUTE THE AUTOMATIC VAULT ROTATION
    executeAutoRekey(suspectUserObj, chosenDecoy.name);
  };

  // --- SIMULATION ACTION: TRIGGER ANOMALOUS ACTIVITY SPURT ---
  const handleTriggerAnomalousActivity = () => {
    const timestamp = getFormattedTime();
    
    // Choose admin_raj to show a principal admin going rogue or compromised
    const targetUsername = 'admin_raj';
    const targetUserObj = users.find(u => u.username === targetUsername)!;

    // 1. Increase risk score to 76 (HIGH)
    const updatedUsers = users.map(u => {
      if (u.username === targetUsername) {
        return {
          ...u,
          currentRiskScore: 76,
          status: 'UNDER_REVIEW' as const,
          riskFactors: [
            { factor: '🚨 HIGH: Bulk export of VIP Account profiles (5,000 files)', score: 45 },
            { factor: 'Anomalous off-hours administrative Decrypt command', score: 20 },
            ...u.riskFactors
          ]
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    // 2. Append anomalous activity log
    const newActivity: Activity = {
      id: `act_anom_${Date.now()}`,
      username: targetUsername,
      role: targetUserObj.role,
      timestamp,
      resource: 'SQL_SERVER_DB.public.vip_balances_unencrypted',
      action: 'EXPORT',
      volume: 5000,
      ipAddress: targetUserObj.ipAddress,
      location: targetUserObj.location,
      riskContribution: 45,
      isAnomaly: true,
      anomalyReason: 'Bulk database query size exceeded typical admin behavior profiles.',
      honeytokenTriggered: null
    };
    setActivities(prev => [newActivity, ...prev]);

    // 3. Create high anomaly alert
    const newAlert: Alert = {
      id: `alert_anom_${Date.now().toString().slice(-3)}`,
      severity: 'HIGH',
      type: 'SUSPECTED',
      title: 'Bulk Export & Decryption Anomalies',
      description: `Administrator ${targetUsername} logged in from typical IP but executed a high-volume decrypt and bulk records dump on HNW accounts table. Risk contribution exceeded safe policy limits.`,
      username: targetUsername,
      timestamp,
      status: 'OPEN',
      honeytokenName: null,
      rekeyTriggered: true,
      rekeyDurationMs: 280,
      timeline: [
        { time: timestamp, message: `Massive query size threshold exceeded on production databases`, phase: 'DETECT' },
        { time: timestamp, message: `Anomaly engine flags deviation from standard administrative behavior (+45 Risk)`, phase: 'ANALYZE' },
        { time: timestamp, message: `Access Policy enforces automatic key rotation for admin credentials`, phase: 'VAULT_TRIGGER' },
        { time: timestamp, message: `Regenerating master passwords using Lattice geometric models`, phase: 'ROTATE' },
        { time: timestamp, message: `Secured: Admin master password rotated in 280ms`, phase: 'SECURED' }
      ]
    };
    setAlerts(prev => [newAlert, ...prev]);
    setSelectedAlertId(newAlert.id);

    // 4. Update chart telemetry metrics
    setTriggerType('ANOMALY');
    setTriggerEventTime(timestamp);

    // 5. EXECUTE THE AUTOMATIC VAULT ROTATION (High risk threshold auto-rekey)
    executeAutoRekey(targetUserObj, null);
  };

  // --- SIMULATION ACTION: TRIGGER GEOGRAPHICAL ANOMALY & IMPOSSIBLE TRAVEL ---
  const handleTriggerGeoAnomaly = () => {
    const timestamp = getFormattedTime();
    
    // Target user: admin_raj (Mumbai home base)
    const targetUsername = 'admin_raj';
    const targetUserObj = users.find(u => u.username === targetUsername)!;

    // 1. Calculate and update risk scores and status
    const updatedUsers = users.map(u => {
      if (u.username === targetUsername) {
        return {
          ...u,
          currentRiskScore: 82,
          status: 'SUSPENDED' as const,
          location: 'Kanpur, India',
          currentCoords: CITIES.kanpur.coords,
          riskFactors: [
            { factor: '🚨 CRITICAL: Physically Impossible Travel (Frankfurt ➔ Kanpur within 3m)', score: 40 },
            { factor: 'Login from unrecognized location Kanpur (1,120 km from Mumbai HQ)', score: 25 },
            ...u.riskFactors
          ]
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    // 2. Append activities to the telemetry feed
    const frankfurtTime = '02:37:00 AM';
    const kanpurTime = timestamp; // Current simulated timestamp
    
    const activityFrankfurt: Activity = {
      id: `act_geo_1_${Date.now()}`,
      username: targetUsername,
      role: targetUserObj.role,
      timestamp: frankfurtTime,
      resource: 'sentinel_auth_gateway',
      action: 'LOGIN',
      volume: 1,
      ipAddress: '194.25.100.89', // Frankfurt IP
      location: 'Frankfurt, Germany',
      riskContribution: 25,
      isAnomaly: true,
      anomalyReason: 'Login from unrecognized location 6,560 km from Home Base (+25)',
      honeytokenTriggered: null,
      coords: CITIES.frankfurt.coords,
      distanceKm: 6560
    };

    const activityKanpur: Activity = {
      id: `act_geo_2_${Date.now()}`,
      username: targetUsername,
      role: targetUserObj.role,
      timestamp: kanpurTime,
      resource: 'sentinel_auth_gateway',
      action: 'LOGIN',
      volume: 1,
      ipAddress: '157.34.120.45', // Kanpur IP
      location: 'Kanpur, India',
      riskContribution: 40,
      isAnomaly: true,
      anomalyReason: 'Physically impossible travel velocity: Frankfurt to Kanpur in 3 mins (126,000 km/h) (+40)',
      honeytokenTriggered: null,
      coords: CITIES.kanpur.coords,
      distanceKm: 1120, // distance to Mumbai Home Base
      isImpossibleTravel: true,
      speedKmH: 126000,
      prevLocation: 'Frankfurt, Germany',
      timeGapMinutes: 3
    };

    setActivities(prev => [activityKanpur, activityFrankfurt, ...prev]);

    // 3. Create a high severity geo-alert
    const newAlert: Alert = {
      id: `alert_geo_${Date.now().toString().slice(-3)}`,
      severity: 'CRITICAL',
      type: 'SUSPECTED',
      title: 'Geographical Impossible Travel Violation',
      description: `Multiple authenticated sessions detected for admin_raj within 3 minutes from Frankfurt, Germany and Kanpur, India (usual home base: Mumbai). Required flight speed is 126,000 km/h, confirming credential theft or session hijacking.`,
      username: targetUsername,
      timestamp: kanpurTime,
      status: 'CONTAINED',
      honeytokenName: null,
      rekeyTriggered: true,
      rekeyDurationMs: 280,
      timeline: [
        { time: frankfurtTime, message: `Access attempt validated from Frankfurt IP: 194.25.100.89`, phase: 'DETECT' },
        { time: frankfurtTime, message: `Anomalous Location flagged: 6,560 km away from registered home base (Mumbai)`, phase: 'ANALYZE' },
        { time: kanpurTime, message: `Secondary login request validated from Kanpur IP: 157.34.120.45`, phase: 'DETECT' },
        { time: kanpurTime, message: `CRITICAL: Impossible travel velocity triggered! Distance: 6,300 km, Time gap: 3 mins. Speed: 126,000 km/h`, phase: 'ANALYZE' },
        { time: kanpurTime, message: `Policy response activated: Immediate session termination for all active logins`, phase: 'VAULT_TRIGGER' },
        { time: kanpurTime, message: `Kyber-1024 quantum protection rotates principal credentials automatically`, phase: 'ROTATE' },
        { time: kanpurTime, message: `Security perimeter restored. Systems secured.`, phase: 'SECURED' }
      ]
    };
    setAlerts(prev => [newAlert, ...prev]);
    setSelectedAlertId(newAlert.id);

    // 4. Update chart telemetry metrics
    setTriggerType('ANOMALY');
    setTriggerEventTime(kanpurTime);

    // 5. Execute Auto-Rekey
    executeAutoRekey(targetUserObj, null);
  };

  // --- ACTION: REMEDIATE ALERT ---
  const handleRemediateAlert = (alertId: string, action: 'APPROVE' | 'ESCALATE' | 'SUSPEND') => {
    const timestamp = getFormattedTime();
    const targetedAlert = alerts.find(a => a.id === alertId);
    if (!targetedAlert) return;

    // Update alert state
    const updatedAlerts = alerts.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: action === 'APPROVE' ? ('RESOLVED' as const) : ('CONTAINED' as const),
          timeline: [
            ...a.timeline,
            { time: timestamp, message: `Operator manually remediated alert via [${action}] action`, phase: 'SECURED' }
          ]
        };
      }
      return a;
    });
    setAlerts(updatedAlerts);

    // Update user state if suspended
    if (action === 'SUSPEND') {
      const updatedUsers = users.map(u => {
        if (u.username === targetedAlert.username) {
          return {
            ...u,
            status: 'SUSPENDED' as const
          };
        }
        return u;
      });
      setUsers(updatedUsers);
    }
  };

  // --- ACTION: RESET DEMO STATE ---
  const handleResetDemo = () => {
    setUsers(INITIAL_USERS);
    setHoneytokens(INITIAL_HONEYTOKENS);
    setCredentials(INITIAL_CREDENTIALS);
    setAlerts(INITIAL_ALERTS);
    setActivities(INITIAL_ACTIVITIES);
    setRekeyHistory([]);
    setLastRotatedCredId(null);
    setLastRotatedTimestamp(null);
    setTriggerType('NONE');
    setTriggerEventTime(null);
    setShowAutoRekeyBanner(false);
  };

  // --- PERIODIC LOG SIMULATION TICKER ---
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = getFormattedTime();

      // Find a random non-suspended user
      const nonSuspended = users.filter(u => u.status !== 'SUSPENDED');
      if (nonSuspended.length === 0) return;
      const randomUser = nonSuspended[Math.floor(Math.random() * nonSuspended.length)];

      // Pick a random standard activity
      const randomResource = NORMAL_RESOURCES[Math.floor(Math.random() * NORMAL_RESOURCES.length)];

      const newLog: Activity = {
        id: `act_tick_${Date.now()}`,
        username: randomUser.username,
        role: randomUser.role,
        timestamp,
        resource: randomResource.resource,
        action: randomResource.action,
        volume: Math.floor(Math.random() * 20) + 1,
        ipAddress: randomUser.ipAddress,
        location: randomUser.location,
        riskContribution: randomResource.risk,
        isAnomaly: false,
        anomalyReason: '',
        honeytokenTriggered: null,
        coords: randomUser.homeBaseCoords,
        distanceKm: 0
      };

      setActivities(prev => [newLog, ...prev].slice(0, 30)); // Cap activities size to keep layout responsive
    }, 8000); // Feed activities every 8 seconds

    return () => clearInterval(interval);
  }, [users]);

  // --- CALCULATE COMPOSITE METRICS ---
  const totalUsers = users.length;
  const activeSessions = users.filter(u => u.status === 'ACTIVE' || u.status === 'MFA_REQUIRED').length;
  const openAlerts = alerts.filter(a => a.status === 'OPEN' || a.status === 'INVESTIGATING').length;
  const decoysTriggeredCount = honeytokens.filter(ht => ht.status === 'TRIGGERED').length;

  const calculateRiskLevel = (): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    const maxScore = Math.max(...users.map(u => u.currentRiskScore));
    if (maxScore >= 80) return 'CRITICAL';
    if (maxScore >= 60) return 'HIGH';
    if (maxScore >= 30) return 'MEDIUM';
    return 'LOW';
  };

  const riskLevel = calculateRiskLevel();
  const currentMaxScore = Math.max(...users.map(u => u.currentRiskScore));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500/30 selection:text-white">
      
      {/* Header */}
      <Header
        onReset={handleResetDemo}
        onTriggerHoneytoken={handleTriggerHoneytoken}
        onTriggerAnomalousActivity={handleTriggerAnomalousActivity}
        onTriggerGeoAnomaly={handleTriggerGeoAnomaly}
        decoysTriggeredCount={decoysTriggeredCount}
        totalDecoys={honeytokens.length}
      />

      {/* Main Content Scroll Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* Dynamic Warning Alert Banner on top if critical threat exists */}
        {riskLevel === 'CRITICAL' && (
          <div className="bg-red-950/20 border border-red-500/50 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 text-slate-950 rounded-md animate-pulse">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-sans font-bold text-white tracking-tight">
                  ACTIVE CRITICAL COMPROMISE: Deterministic Decoy Honeytoken Triggered
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  The auto-containment post-quantum pipeline has successfully locked associated administrator credentials and rotated master DB secrets.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('vault');
                setShowAutoRekeyBanner(true);
              }}
              className="px-3.5 py-1.5 text-xs font-mono font-bold text-slate-950 bg-red-500 hover:bg-red-400 rounded transition-all"
            >
              Examine Vault Logs
            </button>
          </div>
        )}

        {/* Metric Cards Banner */}
        <MetricCards
          totalUsers={totalUsers}
          activeSessions={activeSessions}
          openAlerts={openAlerts}
          riskLevel={riskLevel}
          honeytokensDeployed={honeytokens.length}
          honeytokensTriggered={decoysTriggeredCount}
          autoRekeysTriggered={rekeyHistory.length}
        />

        {/* Primary SOC View Tabs navigation */}
        <div className="border-b border-slate-900 flex flex-wrap items-center gap-1">
          {[
            { id: 'dashboard', label: 'SOC Main Board' },
            { id: 'behavioral', label: 'AI Anomaly Analyzer' },
            { id: 'decoys', label: 'Honeytoken Mesh' },
            { id: 'vault', label: 'Quantum-Proof Vault' },
            { id: 'alerts', label: 'Alert Center' },
            { id: 'policies', label: 'Access Policies' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-red-500 text-white bg-slate-900/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Renderer */}
        <div className="transition-all duration-300">
          
          {/* TAB 1: SOC Main Board (Dashboard Overview) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 24h Risk Chart */}
                <div className="lg:col-span-7 h-full">
                  <RiskTrendChart
                    currentMaxScore={currentMaxScore}
                    triggerEventTime={triggerEventTime}
                    triggerType={triggerType}
                  />
                </div>

                {/* Real-time Activity Telemetry Feed */}
                <div className="lg:col-span-5 border border-slate-800 bg-slate-950 rounded-lg p-4 flex flex-col h-full justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-950 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                        <h4 className="text-sm font-sans font-bold text-white uppercase tracking-tight">
                          Real-time Telemetry Feed
                        </h4>
                      </div>
                      <span className="text-[9px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                        <span className="h-1 w-1 bg-emerald-400 rounded-full animate-ping"></span>
                        LIVE STREAM
                      </span>
                    </div>

                    {/* Feed Rows */}
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {activities.map((act) => (
                        <div
                          key={act.id}
                          className={`p-2.5 rounded border text-[10px] font-mono leading-relaxed transition-all ${
                            act.isAnomaly
                              ? 'bg-red-950/10 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.05)]'
                              : 'bg-slate-900/40 border-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between text-slate-500 text-[9px] mb-1">
                            <span>{act.timestamp}</span>
                            <span>IP: {act.ipAddress}</span>
                          </div>
                          <div>
                            👤 <strong className="text-white">{act.username}</strong> ({act.role}){' '}
                            <span className="text-slate-400">executed</span>{' '}
                            <span className="px-1 py-0.2 bg-slate-950 border border-slate-800 rounded font-bold text-slate-300">
                              {act.action}
                            </span>{' '}
                            <span className="text-slate-400">on</span>{' '}
                            <span className="font-semibold text-slate-300 truncate inline-block max-w-[150px] align-bottom">
                              {act.resource}
                            </span>
                          </div>

                          {/* Location & Distance Badge */}
                          {act.coords && (
                            <div className="mt-1 flex items-center flex-wrap gap-1 text-[9px] text-slate-400 font-sans">
                              <span className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-[8.5px]">
                                📍 {act.location}
                              </span>
                              {act.distanceKm !== undefined && act.distanceKm > 0 && (
                                <span className={`px-1.5 py-0.5 rounded text-[8.5px] border ${
                                  act.distanceKm > 1000 
                                    ? 'bg-red-950/40 text-red-400 border-red-500/20' 
                                    : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
                                }`}>
                                  usual home base: Mumbai — {act.distanceKm.toLocaleString()} km away
                                </span>
                              )}
                              {act.isImpossibleTravel && act.speedKmH && (
                                <span className="bg-purple-950/60 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-semibold animate-pulse">
                                  ⚡ IMPOSSIBLE TRAVEL: {act.speedKmH.toLocaleString()} km/h (previous: {act.prevLocation})
                                </span>
                              )}
                            </div>
                          )}

                          {act.isAnomaly && (
                            <div className="text-red-400 mt-1 font-semibold text-[9.5px]">
                              ⚠️ AI Alert: {act.anomalyReason} (+{act.riskContribution} risk)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono italic mt-4 pt-2.5 border-t border-slate-900">
                    *Telemetric activities stream automatically. Use trigger buttons on header to test threat reactions.
                  </div>
                </div>

              </div>

              {/* Honeytoken Map & Fast Vault Details combined on main screen */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Mini Honeytoken List */}
                <div className="lg:col-span-6 border border-slate-800 bg-slate-950 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-950 pb-2 mb-3">
                      <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Decoy Honeytoken Deployments
                      </h5>
                      <button
                        onClick={() => setActiveTab('decoys')}
                        className="text-[10px] font-mono text-red-400 hover:underline"
                      >
                        Manage Decoy Mesh →
                      </button>
                    </div>

                    <div className="space-y-2">
                      {honeytokens.map((ht) => (
                        <div key={ht.id} className="flex items-center justify-between p-2 bg-slate-900/30 border border-slate-900 rounded text-xs">
                          <div>
                            <span className="font-mono font-bold text-white block">{ht.name}</span>
                            <span className="text-[9px] font-mono text-slate-500">{ht.location}</span>
                          </div>
                          <div>
                            {ht.status === 'TRIGGERED' ? (
                              <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold bg-red-950 text-red-500 border border-red-500/20 rounded-full animate-pulse">
                                TRIGGERED
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 text-[8px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded-full">
                                ARMED
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Closed-Loop Pitch/Details */}
                <div className="lg:col-span-6 border border-slate-800 bg-slate-950 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 border-b border-slate-950 pb-2 mb-3">
                      <Zap className="h-4 w-4 text-emerald-400" />
                      <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        The Post-Quantum Vault Connection
                      </h5>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                      activityaccess couples threat intelligence directly with automated containment. The moment a honeytoken decoy is read, the system is engineered to rotate access secrets in less than 300 milliseconds. 
                    </p>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-900 font-mono text-[11px] text-slate-300">
                      🛡️ <span className="text-white font-bold">Why Post-Quantum?</span> Standard RSA factoring calculations are vulnerable to future quantum compute decryption. Lattice-based cryptography remains mathematically secure.
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('vault')}
                    className="w-full mt-4 py-2 text-center text-xs font-mono font-bold bg-blue-950 text-blue-400 hover:bg-blue-900 border border-blue-500/30 hover:border-blue-500/50 rounded transition-all shadow-sm"
                  >
                    Explore Post-Quantum Kyber Vault →
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: AI Behavioral Analyzer */}
          {activeTab === 'behavioral' && (
            <InsiderThreatEngine
              users={users}
              activities={activities}
              onSelectUser={(username) => setSelectedUsername(username)}
              selectedUsername={selectedUsername}
            />
          )}

          {/* TAB 3: Honeytoken Decoy Mesh */}
          {activeTab === 'decoys' && (
            <HoneytokenMesh
              honeytokens={honeytokens}
              onTriggerDecoy={(id) => {
                // If specific id is ht_swift, trigger corresponding alert
                handleTriggerHoneytoken();
              }}
            />
          )}

          {/* TAB 4: Quantum-Proof Vault */}
          {activeTab === 'vault' && (
            <QuantumVault
              credentials={credentials}
              lastRotatedCredId={lastRotatedCredId}
              lastRotatedTimestamp={lastRotatedTimestamp}
              rekeyHistory={rekeyHistory}
              onManualRotate={handleManualRotate}
            />
          )}

          {/* TAB 5: Alert Center */}
          {activeTab === 'alerts' && (
            <AlertsPanel
              alerts={alerts}
              users={users}
              onSelectAlert={(id) => setSelectedAlertId(id)}
              selectedAlertId={selectedAlertId}
              onRemediateAlert={handleRemediateAlert}
            />
          )}

          {/* TAB 6: Access Policies */}
          {activeTab === 'policies' && (
            <PolicyEngine
              policies={ACCESS_POLICIES}
              selectedUser={users.find(u => u.username === selectedUsername) || users[0]}
            />
          )}

        </div>

      </main>

      {/* FOOTER */}
      <footer id="sentinel-footer" className="border-t border-slate-900 bg-slate-950 p-4 mt-12 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            © 2026 activityaccess Corporation. All Rights Reserved.
          </span>
          <span className="text-[11px] text-slate-600">
            Internal SOC Terminal v2.10.4-Lattice • Secure Quantum Tunnel: SHA-512-Kyber
          </span>
        </div>
      </footer>

      {/* GLORIOUS FLOATING AUTO-REKEY SUCCESS MODAL/BANNER */}
      {showAutoRekeyBanner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
            
            {/* Ambient Background Glow lines */}
            <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/5 rounded-full filter blur-xl"></div>
            
            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-lg animate-pulse">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-sans font-bold text-white uppercase tracking-tight">
                  Auto-Rekey containment Engaged
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Closed-Loop Defense Response Execution
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-[11px] text-slate-300">
              <p className="font-sans text-xs text-slate-400 leading-relaxed mb-1">
                A critical behavioral risk spike / honeytoken decoy touch was identified. activityaccess immediately severed the session and executed containment.
              </p>

              <div className="bg-slate-950 border border-slate-850 p-2.5 rounded text-[10.5px] space-y-1">
                <div>
                  <span className="text-slate-500 font-bold">Suspect User:</span>{' '}
                  <span className="text-red-400 font-bold">{bannerUser}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Action Taken:</span>{' '}
                  <span className="text-white">Domain privileges revoked, session killed</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Vault Response:</span>{' '}
                  <span className="text-blue-400 font-bold flex items-center gap-1 mt-0.5">
                    <KeyRound className="h-3.5 w-3.5" /> Kyber-1024 Lattice Re-encryption Fired
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Latency Overhead:</span>{' '}
                  <span className="text-emerald-400 font-bold">0.28 seconds (Success)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowAutoRekeyBanner(false);
                  setActiveTab('vault');
                }}
                className="px-3.5 py-1.5 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-all"
              >
                Inspect Lattice Ring Matrix
              </button>
              <button
                onClick={() => setShowAutoRekeyBanner(false)}
                className="px-4 py-1.5 text-[11px] font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-all"
              >
                Acknowledge & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
