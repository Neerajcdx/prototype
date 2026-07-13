import React, { useState } from 'react';
import { UserSession, Activity } from '../types';
import { ShieldAlert, MapPin, Key, Wifi, AlertOctagon, Fingerprint, Activity as ActivityIcon, Compass, Globe } from 'lucide-react';
import { getDistanceKm } from '../utils/geoUtils';

interface InsiderThreatEngineProps {
  users: UserSession[];
  activities: Activity[];
  onSelectUser: (username: string) => void;
  selectedUsername: string;
}

export default function InsiderThreatEngine({
  users,
  activities,
  onSelectUser,
  selectedUsername
}: InsiderThreatEngineProps) {
  
  // Find current selected user details
  const selectedUser = users.find(u => u.username === selectedUsername) || users[0];

  // Filter activities corresponding to selected user
  const userActivities = activities.filter(act => act.username === selectedUser.username);

  // Sorting users by risk score descending
  const sortedUsers = [...users].sort((a, b) => b.currentRiskScore - a.currentRiskScore);

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500 border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
    if (score >= 60) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    if (score >= 30) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUSPENDED':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-red-950 text-red-400 border border-red-800/40 rounded">LOCKED</span>;
      case 'MFA_REQUIRED':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800/40 rounded">MFA REQ</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800/40 rounded">REVIEW</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 rounded">SECURE</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: Ranked Session List */}
      <div className="lg:col-span-5 border border-slate-800 bg-slate-950 rounded-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-4.5 w-4.5 text-red-500" />
            <h4 className="text-sm font-sans font-bold text-white tracking-tight uppercase">
              Top Risky Sessions (AI Evaluated)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            Sorted by Risk
          </span>
        </div>

        {/* User List Scroll Area */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {sortedUsers.map((user) => {
            const isSelected = user.username === selectedUser.username;
            const riskColor = getRiskScoreColor(user.currentRiskScore);

            return (
              <button
                key={user.username}
                onClick={() => onSelectUser(user.username)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-slate-900 border-slate-700 shadow-md'
                    : 'bg-slate-950 hover:bg-slate-900/60 border-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-9 w-9 rounded-full object-cover border border-slate-800 group-hover:border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 ${
                      user.status === 'SUSPENDED' ? 'bg-red-500' : 'bg-emerald-500'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-white group-hover:text-red-400 transition-colors">
                        {user.username}
                      </span>
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-[10px] text-slate-500 font-sans truncate max-w-[150px] lg:max-w-[180px]">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Score badge */}
                <div className={`flex flex-col items-center justify-center border rounded px-2.5 py-1 min-w-[50px] ${riskColor}`}>
                  <span className="text-[10px] font-mono text-slate-400 font-medium leading-none">RISK</span>
                  <span className="text-sm font-mono font-bold leading-none mt-0.5">{user.currentRiskScore}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Informative footprint footer */}
        <div className="mt-4 p-2.5 bg-slate-900/40 rounded border border-slate-900 text-[10px] font-mono text-slate-500 leading-relaxed">
          💡 <span className="text-slate-400">Telemetry Engine:</span> Dynamic weightings evaluate IP distance, record counts, active change tickets, and decoys touched.
        </div>
      </div>

      {/* RIGHT: Selected User Deep Dive Analysis */}
      <div className="lg:col-span-7 border border-slate-800 bg-slate-950 rounded-lg p-4 flex flex-col justify-between">
        
        {/* Profile Card Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-3.5 mb-4 gap-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.username}
                className="h-12 w-12 rounded-full border border-slate-800 object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  {selectedUser.username}
                  <span className="text-xs text-slate-400 font-normal">({selectedUser.role})</span>
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-slate-500" /> {selectedUser.ipAddress}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" /> {selectedUser.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Score Circle */}
            <div className="flex items-center gap-2 self-start sm:self-center bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <div className="text-right">
                <p className="text-[9px] font-mono text-slate-500 uppercase leading-none">AI Score</p>
                <p className="text-xs font-mono text-slate-400 leading-none mt-1">Anomalous Delta</p>
              </div>
              <div className={`text-lg font-mono font-bold px-2 py-1 rounded border ${getRiskScoreColor(selectedUser.currentRiskScore)}`}>
                {selectedUser.currentRiskScore}
              </div>
            </div>
          </div>

          {/* Explainable Risk Factors Breakdown */}
          <div className="mb-4">
            <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Explainable Risk Breakdown &quot;WHY&quot;
            </h5>
            
            <div className="space-y-2.5">
              {selectedUser.riskFactors.map((factor, idx) => {
                const percentage = Math.min(100, (factor.score / 100) * 100);
                return (
                  <div key={idx} className="bg-slate-900/60 border border-slate-900/80 p-2 rounded">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">{factor.factor}</span>
                      <span className="text-red-400 font-bold">+{factor.score} pts</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-red-500 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {selectedUser.riskFactors.length === 0 && (
                <div className="text-xs text-slate-500 font-mono italic text-center py-4 bg-slate-900/30 rounded border border-slate-900 border-dashed">
                  No anomalous behavior variables recorded. Baseline fully nominal.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Geo-Velocity Trace Card (Interactive Simulated Map) */}
        <div className="mb-6 p-4 bg-slate-900/60 border border-slate-900 rounded-lg">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-blue-400 animate-spin-slow" />
              <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Geographical Trace & Impossible Travel Matrix
              </h5>
            </div>
            <span className="text-[9px] font-mono font-semibold bg-blue-950 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-full uppercase">
              Proximity Scan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Simulated Vector Graph */}
            <div className="md:col-span-7 bg-slate-950 border border-slate-900 rounded p-2 relative h-36 flex flex-col justify-between overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-5 pointer-events-none">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-white"></div>
                ))}
              </div>

              {/* Coordinate projection SVG */}
              <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Draw trace lines */}
                {(() => {
                  const getSvgCoords = (lat: number, lng: number) => {
                    const minLng = -110;
                    const maxLng = 140;
                    const minLat = -10;
                    const maxLat = 60;
                    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
                    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
                    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
                  };

                  const homeSvg = getSvgCoords(selectedUser.homeBaseCoords?.lat || 19.0760, selectedUser.homeBaseCoords?.lng || 72.8777);
                  const activeSvg = getSvgCoords(selectedUser.currentCoords?.lat || 19.0760, selectedUser.currentCoords?.lng || 72.8777);
                  const distance = getDistanceKm(
                    selectedUser.homeBaseCoords || { lat: 19.0760, lng: 72.8777 },
                    selectedUser.currentCoords || { lat: 19.0760, lng: 72.8777 }
                  );
                  
                  // Scan if any activity logged impossible travel
                  const impossibleTravelLog = userActivities.find(act => act.isImpossibleTravel);
                  
                  let lines = [];
                  if (distance > 0) {
                    lines.push(
                      <path
                        key="hq-trace"
                        d={`M ${homeSvg.x} ${homeSvg.y} Q ${(homeSvg.x + activeSvg.x)/2} ${(homeSvg.y + activeSvg.y)/2 - 12} ${activeSvg.x} ${activeSvg.y}`}
                        fill="none"
                        stroke={distance > 1000 ? "#ef4444" : "#f59e0b"}
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />
                    );
                  }

                  if (impossibleTravelLog) {
                    const frankfurtSvg = getSvgCoords(50.1109, 8.6821); // Frankfurt
                    const kanpurSvg = getSvgCoords(26.4499, 80.3319); // Kanpur
                    lines.push(
                      <g key="impossible-trace">
                        {/* Dot for Frankfurt */}
                        <circle cx={frankfurtSvg.x} cy={frankfurtSvg.y} r="3" fill="#c084fc" className="animate-pulse" />
                        {/* Connecting arc */}
                        <path
                          d={`M ${frankfurtSvg.x} ${frankfurtSvg.y} Q ${(frankfurtSvg.x + kanpurSvg.x)/2} ${(frankfurtSvg.y + kanpurSvg.y)/2 - 18} ${kanpurSvg.x} ${kanpurSvg.y}`}
                          fill="none"
                          stroke="#c084fc"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                      </g>
                    );
                  }

                  return lines;
                })()}

                {/* Nodes */}
                {(() => {
                  const getSvgCoords = (lat: number, lng: number) => {
                    const minLng = -110;
                    const maxLng = 140;
                    const minLat = -10;
                    const maxLat = 60;
                    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
                    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
                    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
                  };

                  const homeSvg = getSvgCoords(selectedUser.homeBaseCoords?.lat || 19.0760, selectedUser.homeBaseCoords?.lng || 72.8777);
                  const activeSvg = getSvgCoords(selectedUser.currentCoords?.lat || 19.0760, selectedUser.currentCoords?.lng || 72.8777);
                  const distance = getDistanceKm(
                    selectedUser.homeBaseCoords || { lat: 19.0760, lng: 72.8777 },
                    selectedUser.currentCoords || { lat: 19.0760, lng: 72.8777 }
                  );

                  return (
                    <>
                      {/* Home Node */}
                      <circle cx={homeSvg.x} cy={homeSvg.y} r="4" fill="#10b981" />
                      
                      {/* Current active login node */}
                      <circle cx={activeSvg.x} cy={activeSvg.y} r="5" fill={distance > 1000 ? "#ef4444" : distance > 0 ? "#f59e0b" : "#10b981"} />
                      {distance > 0 && (
                        <circle cx={activeSvg.x} cy={activeSvg.y} r="9" fill="none" stroke={distance > 1000 ? "#ef4444" : "#f59e0b"} strokeWidth="1" className="animate-ping" style={{ transformOrigin: `${activeSvg.x}px ${activeSvg.y}px` }} />
                      )}
                    </>
                  );
                })()}
              </svg>

              {/* Labels on SVG Map Overlay */}
              <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 bg-slate-950/80 px-1 rounded border border-slate-900 pointer-events-none">
                LAT/LONG GLOBAL GRID PROJECTION MAP
              </div>

              {/* Dynamic Map Legends */}
              <div className="flex items-center justify-between z-10 text-[8px] font-mono text-slate-400 mt-auto bg-slate-950/90 px-2 py-1 rounded border-t border-slate-900 pointer-events-none">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Home base HQ</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span> Active Session</span>
                  {userActivities.some(act => act.isImpossibleTravel) && (
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></span> Impossible Flight Node</span>
                  )}
                </div>
              </div>
            </div>

            {/* Geo-Stats Breakdown Details Panel */}
            <div className="md:col-span-5 space-y-2 text-xs font-mono">
              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-900/60">
                <div className="text-[10px] text-slate-500">REGISTERED OFFICE (HOME BASE):</div>
                <div className="text-white font-bold truncate mt-0.5 flex items-center gap-1">
                  🏢 {selectedUser.homeBase || 'Mumbai, India (Headquarters)'}
                </div>
              </div>

              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-900/60">
                <div className="text-[10px] text-slate-500">ACTIVE SESSION LOCATION:</div>
                <div className="text-white font-bold truncate mt-0.5 flex items-center gap-1">
                  📍 {selectedUser.location}
                </div>
              </div>

              {/* Distance delta and warning level */}
              {(() => {
                const distance = getDistanceKm(
                  selectedUser.homeBaseCoords || { lat: 19.0760, lng: 72.8777 },
                  selectedUser.currentCoords || { lat: 19.0760, lng: 72.8777 }
                );
                const isThreat = distance > 1000;
                
                return (
                  <div className={`p-2.5 rounded border transition-all ${
                    isThreat 
                      ? 'bg-red-950/20 border-red-500/20 text-red-400' 
                      : distance > 0 
                        ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                        : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                  }`}>
                    <div className="text-[10px] text-slate-500">LOCATION DISTANCE DELTA:</div>
                    <div className="font-bold mt-0.5 flex items-center justify-between text-[11px]">
                      <span>{distance === 0 ? '✔ Match HQ (0 km)' : `⚠ ${distance.toLocaleString()} km away`}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold ${
                        distance === 0 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                          : isThreat 
                            ? 'bg-red-950 text-red-400 border border-red-500/20 animate-pulse' 
                            : 'bg-amber-950 text-amber-400 border border-amber-500/20'
                      }`}>
                        {distance === 0 ? 'Nominal' : isThreat ? '3x Rekey Risk' : 'Elevated'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Selected User Recent Logs (Activity) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ActivityIcon className="h-3.5 w-3.5 text-slate-400" />
            <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Recent Log Entries ({selectedUser.username})
            </h5>
          </div>

          <div className="border border-slate-900 rounded overflow-hidden max-h-[140px] overflow-y-auto font-mono text-[10px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <th className="p-2">Timestamp</th>
                  <th className="p-2">Resource</th>
                  <th className="p-2">Action</th>
                  <th className="p-2 text-right">Anomaly Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {userActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-2 text-slate-500 whitespace-nowrap">{act.timestamp}</td>
                    <td className="p-2 font-semibold text-slate-400 truncate max-w-[120px]" title={act.resource}>
                      {act.resource}
                    </td>
                    <td className="p-2">
                      <span className={`px-1 py-0.5 rounded text-[9px] ${
                        act.action === 'EXPORT' || act.action === 'DECRYPT' 
                          ? 'bg-amber-950 text-amber-400 border border-amber-900/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {act.action}
                      </span>
                    </td>
                    <td className={`p-2 text-right font-bold ${
                      act.isAnomaly ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {act.isAnomaly ? `+${act.riskContribution}` : 'None'}
                    </td>
                  </tr>
                ))}

                {userActivities.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500 italic">
                      No active sessions in the last 24h.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
