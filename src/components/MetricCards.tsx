import React from 'react';
import { Users, Radio, AlertTriangle, Shield, Eye, KeyRound } from 'lucide-react';

interface MetricCardsProps {
  totalUsers: number;
  activeSessions: number;
  openAlerts: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  honeytokensDeployed: number;
  honeytokensTriggered: number;
  autoRekeysTriggered: number;
}

export default function MetricCards({
  totalUsers,
  activeSessions,
  openAlerts,
  riskLevel,
  honeytokensDeployed,
  honeytokensTriggered,
  autoRekeysTriggered
}: MetricCardsProps) {
  
  // Custom styling based on system-wide risk level
  const getRiskStyles = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/20 border-red-500/40 hover:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.07)]',
          text: 'text-red-500',
          badge: 'bg-red-500/10 text-red-400 border-red-500/30'
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-950/20 border-orange-500/40 hover:border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.07)]',
          text: 'text-orange-500',
          badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60',
          text: 'text-amber-500',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
      default:
        return {
          bg: 'bg-slate-900 border-slate-800 hover:border-slate-700',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
    }
  };

  const riskStyle = getRiskStyles(riskLevel);

  const cardsData = [
    {
      id: 'metric-users',
      title: 'Privileged Accounts',
      value: totalUsers,
      subtext: '4 Internal Admin, 1 Vendor',
      icon: Users,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-950/30 border-blue-500/20',
      borderStyle: 'bg-slate-900 border-slate-800 hover:border-slate-700'
    },
    {
      id: 'metric-sessions',
      title: 'Active Core Sessions',
      value: activeSessions,
      subtext: 'Real-time telemetry active',
      icon: Radio,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-950/30 border-emerald-500/20',
      borderStyle: 'bg-slate-900 border-slate-800 hover:border-slate-700',
      pulse: true
    },
    {
      id: 'metric-alerts',
      title: 'Open Alerts',
      value: openAlerts,
      subtext: openAlerts > 0 ? `${openAlerts} requiring triaging` : 'SOC queue cleared',
      icon: AlertTriangle,
      iconColor: openAlerts > 0 ? 'text-red-400' : 'text-slate-400',
      iconBg: openAlerts > 0 ? 'bg-red-950/30 border-red-500/20' : 'bg-slate-800/30 border-slate-700/20',
      borderStyle: openAlerts > 0 ? 'bg-slate-900 border-red-900/30' : 'bg-slate-900 border-slate-800'
    },
    {
      id: 'metric-risk',
      title: 'Composite Risk Level',
      value: riskLevel,
      subtext: 'Calculated by AI Engine',
      icon: Shield,
      iconColor: riskStyle.text,
      iconBg: `${riskStyle.badge} border`,
      borderStyle: riskStyle.bg
    },
    {
      id: 'metric-honeytokens',
      title: 'Decoy Honeytokens',
      value: `${honeytokensDeployed - honeytokensTriggered}/${honeytokensDeployed}`,
      subtext: honeytokensTriggered > 0 ? `⚠️ ${honeytokensTriggered} DECOYS TRIGGERED` : 'All decoys untouched',
      icon: Eye,
      iconColor: honeytokensTriggered > 0 ? 'text-red-500 font-bold' : 'text-purple-400',
      iconBg: honeytokensTriggered > 0 ? 'bg-red-950/50 border-red-500/40' : 'bg-purple-950/30 border-purple-500/20',
      borderStyle: honeytokensTriggered > 0 ? 'bg-slate-900 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'bg-slate-900 border-slate-800'
    },
    {
      id: 'metric-rekeys',
      title: 'Auto-Rekeys (QPC)',
      value: autoRekeysTriggered,
      subtext: 'Proactive rotations executed',
      icon: KeyRound,
      iconColor: autoRekeysTriggered > 0 ? 'text-blue-400' : 'text-slate-400',
      iconBg: autoRekeysTriggered > 0 ? 'bg-blue-950/40 border-blue-500/30' : 'bg-slate-850/30 border-slate-750/20',
      borderStyle: autoRekeysTriggered > 0 ? 'bg-slate-900 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]' : 'bg-slate-900 border-slate-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cardsData.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`border rounded-lg p-4 transition-all duration-300 relative overflow-hidden group ${card.borderStyle}`}
          >
            {/* Pulsing indicator for active sessions */}
            {card.pulse && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium tracking-wide uppercase font-sans">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold font-sans text-white mt-1 leading-none">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2 border rounded-md ${card.iconBg} ${card.iconColor}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 font-mono">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
