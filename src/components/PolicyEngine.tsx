import React from 'react';
import { AccessPolicy, UserSession } from '../types';
import { ShieldCheck, ShieldAlert, Key, Ban, UserCheck } from 'lucide-react';

interface PolicyEngineProps {
  policies: AccessPolicy[];
  selectedUser: UserSession;
}

export default function PolicyEngine({
  policies,
  selectedUser
}: PolicyEngineProps) {
  
  // Find which policy is active for the current selected user
  const getUserPolicyTier = (score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  };

  const activeTier = getUserPolicyTier(selectedUser.currentRiskScore);

  const getPolicyIcon = (tier: string) => {
    switch (tier) {
      case 'CRITICAL':
        return <Ban className="h-5 w-5 text-red-500" />;
      case 'HIGH':
        return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      case 'MEDIUM':
        return <Key className="h-5 w-5 text-amber-500" />;
      default:
        return <UserCheck className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getTierGlowColor = (tier: string) => {
    switch (tier) {
      case 'CRITICAL':
        return 'border-red-500 bg-red-950/15 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
      case 'HIGH':
        return 'border-orange-500 bg-orange-950/10 shadow-[0_0_12px_rgba(249,115,22,0.1)]';
      case 'MEDIUM':
        return 'border-amber-500 bg-amber-950/10';
      default:
        return 'border-emerald-500 bg-emerald-950/5';
    }
  };

  return (
    <div className="border border-slate-800 bg-slate-950 rounded-lg p-5 flex flex-col h-full">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-950 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
          <h4 className="text-sm font-sans font-bold text-white tracking-tight uppercase">
            Risk-Based Access Control Policies (RBAC)
          </h4>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Selected User: <span className="text-red-400 font-bold">{selectedUser.username}</span> ({selectedUser.currentRiskScore} Score)
        </div>
      </div>

      <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
        activityaccess enforces dynamic security gating. As a user's risk score climbs past key behavioral markers, access is throttled, and post-quantum vault rotations are automatically executed.
      </p>

      {/* Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {policies.map((policy) => {
          const isActive = policy.riskTier === activeTier;
          
          return (
            <div
              key={policy.riskTier}
              className={`border p-4 rounded-lg transition-all duration-300 flex flex-col justify-between relative ${
                isActive
                  ? getTierGlowColor(policy.riskTier)
                  : 'bg-slate-900/20 border-slate-900 opacity-60'
              }`}
            >
              {/* Active Enforcement Badge */}
              {isActive && (
                <span className={`absolute -top-2.5 left-4 px-2 py-0.5 text-[8px] font-mono font-bold rounded-full border tracking-wide uppercase animate-pulse ${
                  policy.riskTier === 'CRITICAL'
                    ? 'bg-red-950 text-red-400 border-red-500/30'
                    : policy.riskTier === 'HIGH'
                      ? 'bg-orange-950 text-orange-400 border-orange-500/30'
                      : policy.riskTier === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                }`}>
                  • ACTIVE POLICY FOR {selectedUser.username}
                </span>
              )}

              {/* Policy Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPolicyIcon(policy.riskTier)}
                    <h5 className="text-xs font-mono font-bold text-white uppercase">
                      {policy.riskTier} RISK TIER
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-900">
                    {policy.scoreRange}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-4">
                  {policy.description}
                </p>
              </div>

              {/* Hard Rules Checklist */}
              <div className="border-t border-slate-900/50 pt-3 space-y-2 font-mono text-[9.5px]">
                {/* Rule 1: Step-up MFA */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">MFA Enforced:</span>
                  <span className={policy.mfaEnforced ? 'text-amber-400 font-bold' : 'text-slate-600'}>
                    {policy.mfaEnforced ? 'REQUIRED' : 'BYPASS'}
                  </span>
                </div>

                {/* Rule 2: Access Restrictions */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Resource Locked:</span>
                  <span className={policy.accessRestricted ? 'text-red-400 font-bold' : 'text-slate-600'}>
                    {policy.accessRestricted ? 'YES' : 'NO'}
                  </span>
                </div>

                {/* Rule 3: Auto-Rekey */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">PQ Auto-Rekey:</span>
                  <span className={policy.autoRekeyTriggered ? 'text-blue-400 font-bold' : 'text-slate-600'}>
                    {policy.autoRekeyTriggered ? 'TRIGGERED' : 'OFF'}
                  </span>
                </div>

                {/* Rule 4: Kill Session */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Halt Session:</span>
                  <span className={policy.sessionTermination ? 'text-red-500 font-bold' : 'text-slate-600'}>
                    {policy.sessionTermination ? 'IMMEDIATE' : 'KEEP_ALIVE'}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
