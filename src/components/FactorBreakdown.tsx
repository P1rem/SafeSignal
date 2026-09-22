import type { ConfidenceFactorDetail } from '@/types';
import { Card } from '@/components/ui/Card';
import { Info } from 'lucide-react';
import { useState } from 'react';

interface FactorBreakdownProps {
  factors: ConfidenceFactorDetail[];
  totalScore: number;
}

export function FactorBreakdown({ factors }: FactorBreakdownProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {factors.map((factor) => {
        const isOpen = expanded === factor.key;
        const isPenalty = factor.key === 'duplicateConcentration';
        return (
          <div key={factor.key} className="bg-navy-50 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : factor.key)}
              className="w-full text-left px-3 py-2.5 btn-touch flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-navy-700">{factor.label}</span>
                  <Info size={12} className="text-navy-400 flex-shrink-0" />
                </div>
                <div className="mt-1.5 h-1.5 bg-navy-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isPenalty
                        ? factor.rawValue > 0.5 ? 'bg-red-400' : 'bg-teal-400'
                        : 'bg-teal-500'
                    }`}
                    style={{ width: `${factor.rawValue * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-navy-800 tabular-nums">
                  {factor.contribution}<span className="text-xs text-navy-400 font-normal">pts</span>
                </div>
                <div className="text-[10px] text-navy-400">
                  {Math.round(factor.weight * 100)}% weight
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="px-3 pb-3 text-xs text-navy-500 leading-relaxed animate-fade-in">
                {factor.description}
                <div className="mt-1.5 flex gap-3 text-[11px]">
                  <span className="text-navy-400">
                    Raw: <span className="font-semibold text-navy-600 tabular-nums">{Math.round(factor.rawValue * 100)}%</span>
                  </span>
                  <span className="text-navy-400">
                    Weight: <span className="font-semibold text-navy-600 tabular-nums">{Math.round(factor.weight * 100)}%</span>
                  </span>
                  <span className="text-navy-400">
                    Contribution: <span className="font-semibold text-navy-600 tabular-nums">{factor.contribution}/100</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div className="flex items-center justify-between pt-2 px-1">
        <span className="text-sm font-semibold text-navy-700">Total confidence score</span>
        <span className="text-lg font-bold text-navy-900 tabular-nums">{factors.reduce((s, f) => s + f.contribution, 0)}<span className="text-sm text-navy-400 font-normal">/100</span></span>
      </div>
    </div>
  );
}

interface ScenarioCardProps {
  title: string;
  summary: string;
  score: number;
  interpretation: string;
  factors: ConfidenceFactorDetail[];
  variant: 'low' | 'high' | 'none';
}

export function ScenarioCard({ title, summary, score, interpretation, factors, variant }: ScenarioCardProps) {
  const borderColor =
    variant === 'high' ? 'border-teal-200 bg-teal-50/50'
    : variant === 'low' ? 'border-red-200 bg-red-50/50'
    : 'border-navy-200 bg-navy-50/50';

  const scoreColor =
    variant === 'high' ? 'text-teal-700'
    : variant === 'low' ? 'text-red-600'
    : 'text-navy-500';

  const label =
    variant === 'high' ? 'Higher confidence'
    : variant === 'low' ? 'Lower confidence'
    : 'No pattern';

  return (
    <Card padding="md" className={`border ${borderColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${scoreColor}`}>{label}</span>
        <span className={`text-2xl font-bold tabular-nums ${scoreColor}`}>{score}</span>
      </div>
      <div className="text-sm font-semibold text-navy-800 mb-1">{title}</div>
      <div className="text-xs text-navy-500 mb-3">{summary}</div>

      {/* Mini factor bars */}
      <div className="space-y-1.5 mb-3">
        {factors.map((f) => (
          <div key={f.key} className="flex items-center gap-2">
            <span className="text-[10px] text-navy-500 w-28 truncate flex-shrink-0">{f.label}</span>
            <div className="flex-1 h-1.5 bg-navy-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  f.key === 'duplicateConcentration'
                    ? f.rawValue > 0.5 ? 'bg-red-400' : 'bg-teal-400'
                    : 'bg-teal-500'
                }`}
                style={{ width: `${f.rawValue * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-navy-400 tabular-nums w-8 text-right flex-shrink-0">
              {f.contribution}p
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-navy-500 leading-relaxed">{interpretation}</p>
    </Card>
  );
}
