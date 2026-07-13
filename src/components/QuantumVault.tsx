import React, { useState, useEffect } from 'react';
import { VaultCredential } from '../types';
import { generatePostQuantumCipher, generateTraditionalCipher } from '../data/mockData';
import { KeyRound, ShieldAlert, Cpu, ArrowRight, Zap, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface QuantumVaultProps {
  credentials: VaultCredential[];
  lastRotatedCredId: string | null;
  lastRotatedTimestamp: string | null;
  rekeyHistory: { time: string; credName: string; user: string; duration: number }[];
  onManualRotate: (credId: string) => void;
}

export default function QuantumVault({
  credentials,
  lastRotatedCredId,
  lastRotatedTimestamp,
  rekeyHistory,
  onManualRotate
}: QuantumVaultProps) {
  const [selectedCredId, setSelectedCredId] = useState<string>(credentials[0]?.id || '');
  const [customPlaintext, setCustomPlaintext] = useState<string>('bank_core_admin_root_token_2026');
  const [isQuantum, setIsQuantum] = useState<boolean>(true);
  const [outputCipher, setOutputCipher] = useState<string>('');
  
  // Find selected credential
  const selectedCred = credentials.find(c => c.id === selectedCredId) || credentials[0];

  // Update cipher text when custom plaintext or encryption mode changes
  useEffect(() => {
    if (isQuantum) {
      setOutputCipher(generatePostQuantumCipher(customPlaintext));
    } else {
      setOutputCipher(generateTraditionalCipher(customPlaintext));
    }
  }, [customPlaintext, isQuantum]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* COLUMN 1: Custom Post-Quantum Cryptography Playground */}
      <div className="lg:col-span-7 border border-slate-800 bg-slate-950 rounded-lg p-5 flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-950 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-blue-400" />
              <h4 className="text-sm font-sans font-bold text-white tracking-tight uppercase">
                Post-Quantum Cryptography Vault (Kyber Playground)
              </h4>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-900/30 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-blue-400" />
              Lattice-Based
            </span>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
            Test how credentials are mathematically fortified inside activityaccess. Type any administrative token below to witness how traditional linear prime factorization transforms into highly resilient high-dimensional lattice ring polynomials.
          </p>

          {/* User Input Playground */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1.5">
                Sensitive Plaintext Credential:
              </label>
              <input
                id="qpc-plaintext-input"
                type="text"
                value={customPlaintext}
                onChange={(e) => setCustomPlaintext(e.target.value)}
                placeholder="Enter a password or API key to encrypt..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Mode Selector */}
            <div className="flex items-center justify-between bg-slate-900/50 p-2 border border-slate-900 rounded">
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Encryption Protocol Profile:
              </span>
              <div className="flex bg-slate-950 rounded p-1 border border-slate-800">
                <button
                  id="btn-traditional-rsa"
                  type="button"
                  onClick={() => setIsQuantum(false)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-all ${
                    !isQuantum
                      ? 'bg-amber-950 text-amber-400 border border-amber-900/50'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  RSA-4096 (Legacy)
                </button>
                <button
                  id="btn-quantum-kyber"
                  type="button"
                  onClick={() => setIsQuantum(true)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-all ${
                    isQuantum
                      ? 'bg-blue-950 text-blue-400 border border-blue-900/50'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Kyber-1024 (PQ-Safe)
                </button>
              </div>
            </div>

            {/* Ciphertext Output Screen */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase">
                  Ciphertext Representation:
                </label>
                <span className={`text-[9px] font-mono font-bold ${isQuantum ? 'text-blue-400' : 'text-amber-400'}`}>
                  {isQuantum ? 'Difficulty: Ring-LWE Lattice Problems (NPC)' : 'Difficulty: Large Integer Factorization (Quantum-Vulnerable)'}
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 h-40 overflow-y-auto font-mono text-[10px] text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
                {outputCipher}
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Static vs PQ Auto-Rotating Comparison Table */}
        <div className="mt-5 pt-4 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-red-950/5 border border-red-900/10 rounded-lg">
            <h5 className="text-[10px] font-mono font-bold text-red-400 uppercase mb-1">
              Traditional Static Security
            </h5>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              🔑 <span className="font-bold text-slate-300">Vulnerability:</span> Keys are static. Once captured via phishing or dump, they remain valid indefinitely until manual discovery (avg. 212 days). Quantum Shor's algorithm solves RSA/ECC mathematical traps in minutes.
            </p>
          </div>
          <div className="p-3 bg-blue-950/10 border border-blue-900/10 rounded-lg">
            <h5 className="text-[10px] font-mono font-bold text-blue-400 uppercase mb-1">
              activityaccess Self-Healing Loop
            </h5>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              ⚡ <span className="font-bold text-slate-300">Defense:</span> Keys are dynamically rotated on behavioral threshold triggers. Threat actors are disarmed in &lt;300ms. Kyber is secured using multidimensional geometric equations uncrackable by quantum compute grids.
            </p>
          </div>
        </div>

      </div>

      {/* COLUMN 2: Self-Healing Automation Monitoring and Vault Registry */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Real-Time Auto-Rekey Event Timeline Console */}
        <div className="border border-slate-800 bg-slate-950 rounded-lg p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between border-b border-slate-950 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4.5 w-4.5 text-emerald-400" />
                <h4 className="text-sm font-sans font-bold text-white uppercase tracking-tight">
                  Auto-Rekey containment Loop
                </h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 animate-pulse">
                • LOGS CAPTURED
              </span>
            </div>

            {/* Animation state banner if rekey occurred */}
            {lastRotatedCredId ? (
              <div className="bg-emerald-950/10 border border-emerald-500/20 rounded p-3 mb-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-mono font-bold text-emerald-400">
                      AUTO-REKEYING COMPLETED
                    </h5>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Credential rotated and lattice-encrypted in <span className="text-white font-mono font-bold">280ms</span>.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-900 border-dashed rounded p-3.5 text-center text-[11px] font-mono text-slate-500 italic mb-3">
                No telemetry alerts triggered yet. System holding in pre-emptive passive shielding.
              </div>
            )}

            {/* Step-by-Step Micro-Log Console */}
            <div className="bg-slate-950/80 border border-slate-900 rounded p-3 h-44 overflow-y-auto font-mono text-[9.5px] leading-relaxed text-slate-300">
              {lastRotatedCredId ? (
                <div className="space-y-2">
                  <div className="text-red-400">
                    [{lastRotatedTimestamp}] [TELEMETRY] 🚨 SEVERE INTERACTION DETECTED on active honeytoken
                  </div>
                  <div className="text-amber-400">
                    [{lastRotatedTimestamp}] [POLICY_ENGINE] Access privileges suspended for session.
                  </div>
                  <div className="text-blue-400">
                    [{lastRotatedTimestamp}] [VAULT] Initiating ML-KEM rotation on credentials...
                  </div>
                  <div className="text-slate-500">
                    &gt; Ring dimension set: d = 256, q = 3329 <br />
                    &gt; Generating public matrix vector t <br />
                    &gt; Revoking old credentials block ID: {lastRotatedCredId}
                  </div>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    [{lastRotatedTimestamp}] [VAULT] Kyber encryption sequence completed in 280ms. Keys redeployed.
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 flex flex-col items-center justify-center h-full gap-2">
                  <span>&gt; QPC containment system listening on socket...</span>
                  <span>&gt; Traditional cipher legacy state: ACTIVE</span>
                  <span>&gt; Automated rotation triggers: READY</span>
                </div>
              )}
            </div>
          </div>

          {/* Historical counter of rotations */}
          <div className="mt-4 pt-3 border-t border-slate-900">
            <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recent Rotation Loop History
            </h5>
            <div className="space-y-1 max-h-[80px] overflow-y-auto">
              {rekeyHistory.map((hist, idx) => (
                <div key={idx} className="flex items-center justify-between text-[9px] font-mono border-b border-slate-900 pb-1 text-slate-400">
                  <span className="text-slate-500">{hist.time}</span>
                  <span className="text-white truncate max-w-[120px]">{hist.credName}</span>
                  <span className="text-slate-500">{hist.user}</span>
                  <span className="text-emerald-400 font-semibold">{hist.duration}s</span>
                </div>
              ))}
              {rekeyHistory.length === 0 && (
                <div className="text-[9px] font-mono text-slate-600 italic">No historical rekeys in current session</div>
              )}
            </div>
          </div>
        </div>

        {/* Sensitive Credential Vault Inventory Registry */}
        <div className="border border-slate-800 bg-slate-950 rounded-lg p-4">
          <div className="flex items-center gap-2 border-b border-slate-950 pb-2 mb-3">
            <KeyRound className="h-4 w-4 text-blue-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Protected Secrets Registry
            </h4>
          </div>

          <div className="space-y-2">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className={`p-2 rounded border transition-all flex items-center justify-between ${
                  cred.isQuantumProof
                    ? 'bg-blue-950/10 border-blue-500/20'
                    : 'bg-slate-900/30 border-slate-850'
                }`}
              >
                <div>
                  <h5 className="text-[10px] font-mono font-bold text-white">{cred.name}</h5>
                  <div className="flex items-center gap-2 text-[8px] font-mono text-slate-500 mt-0.5">
                    <span>Owner: <strong className="text-slate-400">{cred.owner}</strong></span>
                    <span>•</span>
                    <span className={cred.isQuantumProof ? 'text-blue-400' : 'text-slate-500'}>
                      {cred.cipherType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">Rotations</span>
                    <span className="text-[10px] font-mono font-bold text-slate-300">{cred.rotationCount}</span>
                  </div>

                  {/* Manual testing button */}
                  <button
                    onClick={() => onManualRotate(cred.id)}
                    className={`p-1 border rounded transition-all ${
                      cred.isQuantumProof
                        ? 'bg-blue-950 text-blue-400 hover:bg-blue-900 border-blue-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
                    }`}
                    title="Force Manual Key Rotation"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
