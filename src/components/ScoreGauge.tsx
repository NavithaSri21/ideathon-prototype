import React from 'react';
import { ReadinessBreakdown } from '../types';
import { ShieldCheck, Award, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  level: string;
  breakdown?: ReadinessBreakdown;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  level,
  breakdown,
  size = 'md',
}) => {
  // Score color logic
  const getScoreTheme = (val: number) => {
    if (val >= 80) return { stroke: '#10B981', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (val >= 65) return { stroke: '#6366F1', text: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    if (val >= 50) return { stroke: '#F59E0B', text: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { stroke: '#EF4444', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  const theme = getScoreTheme(score);
  const radius = size === 'lg' ? 64 : size === 'md' ? 52 : 40;
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Radial Meter */}
      <div className="relative flex items-center justify-center select-none flex-shrink-0">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 drop-shadow-xs"
        >
          {/* Background circle */}
          <circle
            stroke="#E2E8F0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={theme.stroke}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-black tracking-tight ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl'} text-slate-900 font-display`}>
            {score}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Readiness
          </span>
        </div>
      </div>

      {/* Breakdown or summary */}
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.bg} ${theme.text} border ${theme.border}`}>
                <Award className="w-3.5 h-3.5" />
                {level || 'Developing'}
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Industry Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {score >= 80
                ? 'High readiness! You have the core foundation and portfolio profile needed for competitive technical screening.'
                : score >= 65
                ? 'Strong trajectory. Completing targeted roadmap projects will push you into top candidate tiers.'
                : 'Great starting baseline. Focus on building real applications and expanding system fundamentals.'}
            </p>
          </div>
        </div>

        {breakdown && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Technical Depth</span>
                <span className="font-bold text-slate-900">{breakdown.technicalProficiency}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${breakdown.technicalProficiency}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Market Alignment</span>
                <span className="font-bold text-slate-900">{breakdown.marketAlignment}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${breakdown.marketAlignment}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-600 font-medium">Portfolio Polish</span>
                <span className="font-bold text-slate-900">{breakdown.portfolioReadiness}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                  style={{ width: `${breakdown.portfolioReadiness}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
