import React, { useState } from 'react';
import { Alert, UserSession } from '../types';
import { ShieldAlert, AlertOctagon, RefreshCw, Check, ShieldOff, Skull, AlertTriangle, Play, HelpCircle, Activity } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
  users: UserSession[];
  onSelectAlert: (alertId: string) => void;
  selectedAlertId: string;
  onRemediateAlert: (alertId: string, action: 'APPROVE' | 'ESCALATE' | 'SUSPEND') => void;
}

export default function AlertsPanel({
  alerts,
  users,
  onSelectAlert,
  selectedAlertId,
  onRemediateAlert
}: AlertsPanelProps) {
  const [filterType, setFilterType] = useState<'ALL' | 'CONFIRMED' | 'SUSPECTED'>('ALL');

  // Find currently selected alert details
  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  // Apply filters
  const filteredAlerts = alerts.filter(a => {
    if (filterType === 'CONFIRMED') return a.type === 'CONFIRMED';
    if (filterType === 'SUSPECTED') return a.type === 'SUSPECTED';
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-red-950 text-red-500 border border-red-500/30 rounded">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-500/30 rounded">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-500/20 rounded">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded">LOW</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    if (type === 'CONFIRMED') {
      return (
        <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-red-950 text-red-500 border border-red-500/40 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.15)]">
          <Skull className="h-3 w-3 animate-pulse" />
          HONEYTOKEN TRIGGERED
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-500/20 rounded flex items-center gap-1">
        <Activity className="h-3 w-3" />
        AI BEHAVIOR ANOMALY
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONTAINED':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded">CONTAINED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800 rounded">RESOLVED</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-900/30 rounded">TRIAGING</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-red-950/20 text-red-400 border border-red-500/20 rounded animate-pulse">OPEN</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* COLUMN 1: Alerts List */}
      <div className="lg:col-span-5 border border-slate-800 bg-slate-950 rounded-lg p-4 flex flex-col justify-between">
        
        <div>
          {/* Header & Filter Controls */}
          <div className="flex flex-col gap-3 pb-3 border-b border-slate-950 mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-red-500" />
              <h4 className="text-sm font-sans font-bold text-white tracking-tight uppercase">
                Active Alerts Log Queue
              </h4>
            </div>

            {/* Filters bar */}
            <div className="flex bg-slate-900 rounded p-1 border border-slate-800 text-[10px] font-mono">
              <button
                id="btn-alert-filter-all"
                onClick={() => setFilterType('ALL')}
                className={`flex-1 py-1 rounded font-bold transition-all ${
                  filterType === 'ALL' ? 'bg-slate-950 text-white border border-slate-850' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                id="btn-alert-filter-confirmed"
                onClick={() => setFilterType('CONFIRMED')}
                className={`flex-1 py-1 rounded font-bold transition-all ${
                  filterType === 'CONFIRMED' ? 'bg-red-950 text-red-400 border border-red-900/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Confirmed ({alerts.filter(a => a.type === 'CONFIRMED').length})
              </button>
              <button
                id="btn-alert-filter-suspected"
                onClick={() => setFilterType('SUSPECTED')}
                className={`flex-1 py-1 rounded font-bold transition-all ${
                  filterType === 'SUSPECTED' ? 'bg-amber-950 text-amber-400 border border-amber-900/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Suspected ({alerts.filter(a => a.type === 'SUSPECTED').length})
              </button>
            </div>
          </div>

          {/* List scroll area */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredAlerts.map((alert) => {
              const isSelected = alert.id === selectedAlert.id;
              
              return (
                <button
                  key={alert.id}
                  onClick={() => onSelectAlert(alert.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 block ${
                    isSelected
                      ? 'bg-slate-900 border-slate-700 shadow-md'
                      : 'bg-slate-950 hover:bg-slate-900/40 border-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                    <div className="flex items-center gap-1.5">
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                    </div>
                  </div>

                  <h5 className="text-xs font-mono font-bold text-white truncate max-w-[280px]">
                    {alert.title}
                  </h5>

                  <p className="text-[10px] font-sans text-slate-400 truncate max-w-[280px] mt-1 mb-2">
                    {alert.description}
                  </p>

                  <div className="flex items-center justify-between text-[9px] font-mono border-t border-slate-900/40 pt-1.5 text-slate-500">
                    <span>User: <strong className="text-slate-400">{alert.username}</strong></span>
                    <span className={`px-1 py-0.2 rounded font-semibold ${
                      alert.type === 'CONFIRMED' ? 'text-red-400 bg-red-950/20' : 'text-amber-400 bg-amber-950/20'
                    }`}>
                      {alert.type === 'CONFIRMED' ? 'Confirmed Decoy Breach' : 'AI Suspected Anomaly'}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredAlerts.length === 0 && (
              <div className="text-xs text-slate-500 font-mono italic text-center py-8 bg-slate-900/20 rounded border border-slate-900 border-dashed">
                No alerts logged in this filter index.
              </div>
            )}
          </div>
        </div>

        {/* Informative alert telemetry footer */}
        <div className="mt-4 p-2 bg-slate-900/40 rounded border border-slate-900 text-[10px] font-mono text-slate-500 leading-normal">
          🔒 <span className="text-slate-400">SOC SLA Standard:</span> Critical Honeytoken traps bypass operator review; associated credentials rotated within 300ms.
        </div>
      </div>

      {/* COLUMN 2: Deep Investigation & Chronological Log Timeline */}
      <div className="lg:col-span-7 border border-slate-800 bg-slate-950 rounded-lg p-5 flex flex-col justify-between">
        
        <div>
          {/* Detailed Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-3 mb-4 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertOctagon className="h-4.5 w-4.5 text-red-500" />
                <h4 className="text-sm font-mono font-bold text-white">
                  Investigation Report: {selectedAlert.id}
                </h4>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Subject: <strong className="text-slate-300">{selectedAlert.username}</strong> ({selectedAlert.timestamp})
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              {getTypeBadge(selectedAlert.type)}
              {selectedAlert.rekeyTriggered && (
                <span className="px-2 py-0.5 text-[9px] font-mono bg-blue-950 text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-1">
                  <RefreshCw className="h-2.5 w-2.5 text-blue-400 animate-spin" />
                  QPC RE-KEY FIRED (280ms)
                </span>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-4 bg-slate-900/40 border border-slate-900 p-3 rounded-lg text-xs leading-relaxed text-slate-300 font-sans">
            <h5 className="font-mono font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
              Event Details
            </h5>
            {selectedAlert.description}
          </div>

          {/* Chronological Action Timeline */}
          <div className="mb-4">
            <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Incident Timeline (Chronological Path)
            </h5>
            
            <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-2 before:w-[1px] before:bg-slate-800">
              {selectedAlert.timeline.map((event, idx) => {
                
                // Color code line/node based on phase
                const getPhaseColor = (phase: string) => {
                  switch (phase) {
                    case 'SECURED':
                      return 'bg-emerald-500 border-emerald-400 text-emerald-400';
                    case 'ROTATE':
                    case 'VAULT_TRIGGER':
                      return 'bg-blue-500 border-blue-400 text-blue-400';
                    case 'ANALYZE':
                      return 'bg-amber-500 border-amber-400 text-amber-400';
                    default:
                      return 'bg-red-500 border-red-400 text-red-400';
                  }
                };

                return (
                  <div key={idx} className="flex items-start gap-3.5 text-[11px] font-mono relative pl-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 z-10 ${getPhaseColor(event.phase)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-slate-500 text-[10px] mb-0.5">
                        <span>{event.time}</span>
                        <span className="text-[8px] uppercase tracking-wider border border-slate-800 px-1 py-0.2 rounded bg-slate-900">
                          {event.phase}
                        </span>
                      </div>
                      <p className="text-slate-200 leading-normal">{event.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Remediations bar */}
        <div className="border-t border-slate-900 pt-4">
          <div className="flex items-center justify-between text-[11px] font-mono mb-3 text-slate-400">
            <span>Remediation Strategy:</span>
            <span>Current Status: <strong className="text-red-400 uppercase">{selectedAlert.status}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            {/* Action 1: Approve / Mute */}
            <button
              id="btn-alert-action-approve"
              onClick={() => onRemediateAlert(selectedAlert.id, 'APPROVE')}
              disabled={selectedAlert.status === 'RESOLVED' || selectedAlert.status === 'CONTAINED'}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded transition-all"
            >
              <Check className="h-4 w-4 text-emerald-400" />
              Mute / Whitelist
            </button>

            {/* Action 2: Escalate */}
            <button
              id="btn-alert-action-escalate"
              onClick={() => onRemediateAlert(selectedAlert.id, 'ESCALATE')}
              disabled={selectedAlert.status === 'RESOLVED' || selectedAlert.status === 'CONTAINED'}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-amber-950 text-amber-400 hover:text-white border border-slate-800 hover:border-amber-500/20 disabled:opacity-40 disabled:pointer-events-none rounded transition-all"
            >
              <AlertTriangle className="h-4 w-4" />
              Escalate to CISO
            </button>

            {/* Action 3: Halt & Lockout */}
            <button
              id="btn-alert-action-suspend"
              onClick={() => onRemediateAlert(selectedAlert.id, 'SUSPEND')}
              disabled={selectedAlert.status === 'RESOLVED' || selectedAlert.status === 'CONTAINED'}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500/40 disabled:opacity-40 disabled:pointer-events-none rounded transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)]"
            >
              <ShieldOff className="h-4 w-4" />
              Halt & Lock User
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
