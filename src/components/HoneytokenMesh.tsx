import React from 'react';
import { Honeytoken } from '../types';
import { Eye, EyeOff, Server, Database, KeyRound, Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HoneytokenMeshProps {
  honeytokens: Honeytoken[];
  onTriggerDecoy: (id: string) => void;
}

export default function HoneytokenMesh({
  honeytokens,
  onTriggerDecoy
}: HoneytokenMeshProps) {
  
  const getDecoyIcon = (type: string) => {
    switch (type) {
      case 'DATABASE_TABLE':
        return <Database className="h-4.5 w-4.5 text-blue-400" />;
      case 'CREDENTIAL':
        return <KeyRound className="h-4.5 w-4.5 text-amber-400" />;
      case 'ADMIN_PORTAL':
        return <Terminal className="h-4.5 w-4.5 text-purple-400" />;
      default:
        return <Server className="h-4.5 w-4.5 text-cyan-400" />;
    }
  };

  const getDecoyTypeLabel = (type: string) => {
    return type.replace('_', ' ');
  };

  return (
    <div className="border border-slate-800 bg-slate-950 rounded-lg p-4 flex flex-col h-full">
      
      {/* Title & Stats */}
      <div className="flex items-center justify-between border-b border-slate-950 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="h-4.5 w-4.5 text-purple-400" />
          <h4 className="text-sm font-sans font-bold text-white tracking-tight uppercase">
            Honeytoken Mesh Decoys
          </h4>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Status: <span className="text-emerald-400 font-bold">ARMED & WATCHING</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
        We have seeded the banking network with high-value decoy assets. Touch events are deterministic indicators of malicious intent (zero false-positives), immediately forcing security containment and post-quantum vault rotation.
      </p>

      {/* Grid of Decoy Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {honeytokens.map((decoy) => {
          const isTriggered = decoy.status === 'TRIGGERED';
          
          return (
            <div
              key={decoy.id}
              className={`border p-3.5 rounded-lg transition-all duration-300 relative ${
                isTriggered
                  ? 'bg-red-950/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                  : 'bg-slate-900/30 border-slate-850 hover:border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded border ${
                    isTriggered ? 'bg-red-950 text-red-400 border-red-500/20' : 'bg-slate-800/40 text-slate-300 border-slate-750'
                  }`}>
                    {getDecoyIcon(decoy.type)}
                  </div>
                  <div>
                    <h5 className="text-xs font-mono font-bold text-white truncate max-w-[170px] xl:max-w-[190px]">
                      {decoy.name}
                    </h5>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      {getDecoyTypeLabel(decoy.type)}
                    </span>
                  </div>
                </div>

                {/* Status Badging */}
                <div>
                  {isTriggered ? (
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-red-950 text-red-500 border border-red-500/30 rounded-full flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="h-3 w-3" />
                      TRIGGERED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      ARMED
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-3">
                {decoy.description}
              </p>

              {/* Location Path */}
              <div className="bg-slate-950 border border-slate-900 rounded p-1.5 mb-3 text-[10px] font-mono text-slate-500 break-all select-all flex items-center justify-between">
                <span className="truncate pr-2">{decoy.location}</span>
                <span className="text-[8px] uppercase font-bold text-slate-600 shrink-0">Path</span>
              </div>

              {/* Action buttons on card */}
              {isTriggered ? (
                <div className="text-[10px] font-mono text-red-400 leading-relaxed bg-red-950/20 p-2 border border-red-500/10 rounded">
                  <span className="font-bold">Breached by:</span> {decoy.triggeredBy} <br />
                  <span className="font-bold">Triggered at:</span> {decoy.triggeredAt} <br />
                  <span className="text-slate-400 font-sans italic text-[9px] mt-1 block">
                    ❌ Automated self-heal executed. Session halted & QPC credentials rotated.
                  </span>
                </div>
              ) : (
                <button
                  id={`btn-trigger-${decoy.id}`}
                  onClick={() => onTriggerDecoy(decoy.id)}
                  className="w-full py-1.5 text-center text-[10px] font-mono font-bold text-red-400 hover:text-white bg-red-950/20 hover:bg-red-900/80 border border-red-500/20 hover:border-red-500/40 rounded transition-all shadow-sm"
                >
                  Simulate Decoy Touch (Trigger Breach)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
