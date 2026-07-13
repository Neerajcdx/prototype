import React, { useState, useRef, useEffect } from 'react';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface ChartPoint {
  hour: string;
  score: number;
  event?: string;
  isTriggerPoint?: boolean;
}

interface RiskTrendChartProps {
  currentMaxScore: number;
  triggerEventTime: string | null;
  triggerType: 'NONE' | 'HONEYTOKEN' | 'ANOMALY';
}

export default function RiskTrendChart({
  currentMaxScore,
  triggerEventTime,
  triggerType
}: RiskTrendChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<ChartPoint[]>([]);

  // Generate 24 hours of trend data based on initial state and current user actions
  useEffect(() => {
    const basePoints: ChartPoint[] = [
      { hour: '02:00 AM', score: 10, event: 'Regular database diagnostics executed by admin_raj' },
      { hour: '03:00 AM', score: 12, event: 'Dev_leo pushed standard updates to staging registry' },
      { hour: '04:00 AM', score: 15, event: 'MFA re-verification successful for contractor_sam' },
      { hour: '05:00 AM', score: 11, event: 'Lead Auditor clara pulled annual access policy sheets' },
      { hour: '06:00 AM', score: 9,   event: 'Off-peak security logs rotated successfully' },
      { hour: '07:00 AM', score: 14,  event: 'Automatic AWS API key validation sweep' },
      { hour: '08:00 AM', score: 22,  event: 'Shift changeover. Regular administrative logons' },
      { hour: '09:00 AM', score: 18,  event: 'Standard diagnostic queries from London compliance team' },
      { hour: '10:00 AM', score: 25,  event: 'Contractor sam login failed once (typo in key)' },
      { hour: '11:00 AM', score: 15,  event: 'Dev leo checked server clusters and logs' },
      { hour: '12:00 PM', score: 12,  event: 'No anomalous behaviors registered' },
      { hour: '01:00 PM', score: 19,  event: 'Principal DB administrator raj modified backup policies' },
      { hour: '02:00 PM', score: 24,  event: 'API key authorization sweep completed' },
      { hour: '03:00 PM', score: 28,  event: 'Contractor sam challenged with step-up MFA' },
      { hour: '04:00 PM', score: 20,  event: 'Routine maintenance window initiated' },
      { hour: '05:00 PM', score: 16,  event: 'compliance audits compiled by Lead Auditor Clara' },
      { hour: '06:00 PM', score: 21,  event: 'Staff departures. Session sign-outs logged' },
      { hour: '07:00 PM', score: 32,  event: 'Third-party support API initiated batch synchronization' },
      { hour: '08:00 PM', score: 35,  event: 'vendor_acct_09 extracted 1,200 raw data profiles (Anomalous Spurt)' },
      { hour: '09:00 PM', score: 38,  event: 'Active Investigation on vendor_acct_09 initiated' },
      { hour: '10:00 PM', score: 22,  event: 'Temporary restriction applied to vendor API credentials' },
      { hour: '11:00 PM', score: 15,  event: 'Dev leo logged off internal engineering platform' },
      { hour: '12:00 AM', score: 12,  event: 'Regular backups executed. System idle' },
      { hour: '01:00 AM', score: 12,  event: 'All active connections monitored continuously' }
    ];

    // If an interactive event occurred, we alter the last couple of points to show a dramatic spike!
    if (triggerType !== 'NONE') {
      const updatedPoints = [...basePoints];
      // Spike the last points
      updatedPoints[22] = {
        hour: '01:03 AM',
        score: Math.max(78, currentMaxScore - 10),
        event: 'Telemetry anomaly threshold exceeded. Session restricted.',
        isTriggerPoint: true
      };
      updatedPoints[23] = {
        hour: triggerEventTime || '01:05 AM',
        score: currentMaxScore,
        event: triggerType === 'HONEYTOKEN' 
          ? '🚨 SEVERE CRITICAL THREAT: SWIFT master credential Honeytoken read triggered!'
          : '⚠️ HIGH ANOMALY ALERT: Massive database extraction sequence initiated by admin_raj!',
        isTriggerPoint: true
      };
      setPoints(updatedPoints);
    } else {
      setPoints(basePoints);
    }
  }, [currentMaxScore, triggerEventTime, triggerType]);

  // Dimensions for SVG plotting
  const paddingX = 40;
  const paddingY = 25;
  const width = 600;
  const height = 150;

  // Render SVG elements
  const renderPathAndArea = () => {
    if (points.length === 0) return { linePath: '', areaPath: '', coords: [] };

    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    const coords = points.map((p, i) => {
      const x = paddingX + (i / (points.length - 1)) * usableWidth;
      // Invert Y so 100 is at top, 0 is at bottom
      const y = paddingY + usableHeight - (p.score / 100) * usableHeight;
      return { x, y, ...p };
    });

    const linePath = coords.reduce((acc, c, i) => {
      return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
    }, '');

    // Area needs to close at the bottom axis
    const bottomY = height - paddingY;
    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${bottomY} L ${coords[0].x} ${bottomY} Z`;

    return { linePath, areaPath, coords };
  };

  const { linePath, areaPath, coords } = renderPathAndArea();

  // Mouse Move tracking for interactive Scrub
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current || coords.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (width / rect.width);
    
    // Find closest coordinate point
    let closestIndex = 0;
    let minDistance = Infinity;

    coords.forEach((c, idx) => {
      const dist = Math.abs(c.x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setHoverIndex(closestIndex);
  };

  const currentHoverPoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div id="risk-trend-container" className="border border-slate-800 bg-slate-950 p-4 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4.5 w-4.5 text-red-500" />
          <h4 className="text-sm font-sans font-bold text-white tracking-tight uppercase">
            24H Threat Risk Trend
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            <span>Anomaly</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-red-400 font-semibold">Decoy Breach</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        ref={containerRef}
        className="relative flex-1 bg-slate-900/40 border border-slate-900 rounded p-2 overflow-hidden cursor-crosshair min-h-[160px]"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Definitions for gradients */}
          <defs>
            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val, idx) => {
            const usableHeight = height - paddingY * 2;
            const y = paddingY + usableHeight - (val / 100) * usableHeight;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Horizontal X Axis Hours Labels (Sampled) */}
          {[0, 6, 12, 18, 23].map((ptIdx, idx) => {
            if (!coords[ptIdx]) return null;
            const c = coords[ptIdx];
            return (
              <text
                key={idx}
                x={c.x}
                y={height - paddingY + 12}
                fill="#64748b"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {c.hour.replace(' AM', 'A').replace(' PM', 'P')}
              </text>
            );
          })}

          {/* Shaded Area underneath the curve */}
          {areaPath && (
            <path d={areaPath} fill="url(#areaGlow)" />
          )}

          {/* Glowing Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGlow)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Threat Spike Highlight if triggered */}
          {triggerType !== 'NONE' && coords.length > 0 && (
            <g>
              <circle
                cx={coords[coords.length - 1].x}
                cy={coords[coords.length - 1].y}
                r="6"
                fill="#ef4444"
                className="animate-ping"
                opacity="0.5"
              />
              <circle
                cx={coords[coords.length - 1].x}
                cy={coords[coords.length - 1].y}
                r="3"
                fill="#ef4444"
              />
            </g>
          )}

          {/* Scrub line indicator */}
          {hoverIndex !== null && coords[hoverIndex] && (
            <g>
              <line
                x1={coords[hoverIndex].x}
                y1={paddingY}
                x2={coords[hoverIndex].x}
                y2={height - paddingY}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={coords[hoverIndex].x}
                cy={coords[hoverIndex].y}
                r="4.5"
                fill={coords[hoverIndex].score >= 70 ? '#ef4444' : coords[hoverIndex].score >= 30 ? '#f59e0b' : '#10b981'}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Hover Floating Details Banner */}
        {currentHoverPoint && (
          <div className="absolute top-2 left-2 right-2 bg-slate-950/95 border border-slate-800 p-2 rounded text-[10px] font-mono leading-relaxed shadow-xl backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-bold">{currentHoverPoint.hour}</span>
              <span className={`px-1.5 py-0.5 rounded font-bold ${
                currentHoverPoint.score >= 70 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : currentHoverPoint.score >= 30 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                Score: {currentHoverPoint.score}/100
              </span>
            </div>
            <p className="text-white truncate">{currentHoverPoint.event}</p>
          </div>
        )}

        {/* Static Prompt when not hovering */}
        {!currentHoverPoint && (
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500 select-none bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-900">
            Hover chart to scrub telemetry logs
          </div>
        )}
      </div>
    </div>
  );
}
