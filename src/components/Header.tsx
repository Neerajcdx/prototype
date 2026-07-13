import React from 'react';
import { Shield, Cpu, RefreshCw, Radio, Zap, Play } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onTriggerHoneytoken: () => void;
  onTriggerAnomalousActivity: () => void;
  onTriggerGeoAnomaly: () => void;
  decoysTriggeredCount: number;
  totalDecoys: number;
}

export default function Header({
  onReset,
  onTriggerHoneytoken,
  onTriggerAnomalousActivity,
  onTriggerGeoAnomaly,
  decoysTriggeredCount,
  totalDecoys
}: HeaderProps) {
  return (
    <header id="sentinel-header" className="border-b border-slate-800 bg-slate-950 p-4 sticky top-0 z-50 shadow-lg backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse">
            <Shield className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-sans font-bold tracking-tight text-white">
                activity<span className="text-red-500">access</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider bg-red-950/60 text-red-400 border border-red-500/20 rounded-full">
                SOC ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Privileged Access & Insider Threat Detection
            </p>
          </div>
        </div>

        {/* Live Metrics Ribbons */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md">
            <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span className="text-slate-400">Honeytokens:</span>
            <span className="text-white font-semibold">{totalDecoys - decoysTriggeredCount}/{totalDecoys} Active</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md">
            <Cpu className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span className="text-slate-400">PQC Vault:</span>
            <span className="text-blue-400 font-bold">ML-KEM-1024</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">Self-Heal State:</span>
            <span className="text-emerald-400 font-semibold">AUTOMATED</span>
          </div>
        </div>

        {/* Action Controls for Demo */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Trigger Honeytoken */}
          <button
            id="btn-trigger-honeytoken"
            onClick={onTriggerHoneytoken}
            disabled={decoysTriggeredCount === totalDecoys}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-white bg-red-900 hover:bg-red-800 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800 border border-red-600 rounded transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          >
            <Play className="h-3.5 w-3.5" />
            Simulate Honeytoken Access
          </button>

          {/* Quick Trigger Anomalous Spurt */}
          <button
            id="btn-trigger-anomaly"
            onClick={onTriggerAnomalousActivity}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-white bg-amber-900/80 hover:bg-amber-950 border border-amber-500/40 rounded transition-all hover:shadow-[0_0_10px_rgba(245,158,11,0.15)]"
          >
            <Play className="h-3.5 w-3.5 text-amber-400" />
            Simulate DB Extraction
          </button>

          {/* Quick Trigger Geo Anomaly */}
          <button
            id="btn-trigger-geo"
            onClick={onTriggerGeoAnomaly}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-white bg-blue-900/80 hover:bg-blue-950 border border-blue-500/40 rounded transition-all hover:shadow-[0_0_10px_rgba(59,130,246,0.15)]"
          >
            <Play className="h-3.5 w-3.5 text-blue-400" />
            Simulate Geo Anomaly
          </button>

          {/* Reset Demo State */}
          <button
            id="btn-reset-demo"
            onClick={onReset}
            title="Reset Simulation Data"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
