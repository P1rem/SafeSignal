import { ShieldCheck, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ActivityByHourChart, IncidentCategoryChart } from '@/components/Charts';
import { DemoDataBanner } from '@/components/ui/States';
import { STATS, PATTERNS, INCIDENT_CATEGORY_DATA, SCORING_LABEL } from '@/lib/data';
import { StatCard } from '@/components/ui/StatCard';
import { ScenarioCard } from '@/components/FactorBreakdown';
import { SCENARIO_EXAMPLES } from '@/lib/patternDetection';

export function AuthorityAnalytics() {
  // Top and bottom confidence patterns for comparison
  const sortedByConfidence = [...PATTERNS].sort((a, b) => b.confidence - a.confidence);
  const topPattern = sortedByConfidence[0];
  const bottomPattern = sortedByConfidence[sortedByConfidence.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-navy-950">Analytics</h1>
        <p className="text-sm text-navy-500 mt-0.5">Signal analysis, anti-gaming heuristics, and trend breakdowns</p>
      </div>

      <div className="mb-4">
        <DemoDataBanner />
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Reports" value={STATS.totalReports} icon="reports" accent="teal" />
        <StatCard label="Active Patterns" value={STATS.activePatterns} icon="patterns" accent="navy" />
        <StatCard label="High Confidence" value={STATS.highConfidence} icon="confidence" accent="red" />
        <StatCard label="Areas Monitored" value={STATS.areasMonitored} icon="areas" accent="amber" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card padding="md">
          <h2 className="text-sm font-semibold text-navy-800 mb-1">Activity by hour</h2>
          <p className="text-xs text-navy-400 mb-3">Report distribution across 24 hours</p>
          <ActivityByHourChart height={240} />
        </Card>

        <Card padding="md">
          <h2 className="text-sm font-semibold text-navy-800 mb-1">Incident categories</h2>
          <p className="text-xs text-navy-400 mb-3">Breakdown by reported incident type</p>
          <IncidentCategoryChart data={INCIDENT_CATEGORY_DATA} height={240} />
        </Card>
      </div>

      {/* Anti-gaming section with three scenarios */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={20} className="text-teal-600" />
          <h2 className="text-sm font-semibold text-navy-800">Anti-gaming heuristic scoring</h2>
        </div>
        <p className="text-sm text-navy-600 mb-4">
          Raw report volume alone is not enough to establish a credible safety pattern. Coordinated fake reports
          from few sources could otherwise manipulate the system. SafeSignal uses a transparent, weighted-factor
          scoring system that values reporter diversity, day spread, and temporal consistency over raw count.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <ScenarioCard
            title="Scenario A: Coordinated burst"
            summary="20 reports · 2 reporters · same 5-minute period"
            score={SCENARIO_EXAMPLES[0].breakdown.totalScore}
            interpretation={SCENARIO_EXAMPLES[0].interpretation}
            factors={SCENARIO_EXAMPLES[0].breakdown.factors.map(f => ({
              key: f.key,
              label: f.label,
              description: f.description,
              rawValue: f.rawValue,
              weight: f.weight,
              contribution: f.contribution,
            }))}
            variant="low"
          />
          <ScenarioCard
            title="Scenario B: Distributed pattern"
            summary="12 reports · 9 reporters · 7 different days"
            score={SCENARIO_EXAMPLES[1].breakdown.totalScore}
            interpretation={SCENARIO_EXAMPLES[1].interpretation}
            factors={SCENARIO_EXAMPLES[1].breakdown.factors.map(f => ({
              key: f.key,
              label: f.label,
              description: f.description,
              rawValue: f.rawValue,
              weight: f.weight,
              contribution: f.contribution,
            }))}
            variant="high"
          />
          <ScenarioCard
            title="Scenario C: Scattered noise"
            summary="4 reports · 4 reporters · 4 locations · different times"
            score={SCENARIO_EXAMPLES[2].breakdown.totalScore}
            interpretation={SCENARIO_EXAMPLES[2].interpretation}
            factors={SCENARIO_EXAMPLES[2].breakdown.factors.map(f => ({
              key: f.key,
              label: f.label,
              description: f.description,
              rawValue: f.rawValue,
              weight: f.weight,
              contribution: f.contribution,
            }))}
            variant="none"
          />
        </div>

        <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2.5">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>
            <span className="font-semibold">Prototype heuristic scoring, not a validated risk probability.</span>{' '}
            Confidence scores are indicative and require human review before any action is taken.
          </span>
        </div>
      </Card>

      {/* Pattern confidence comparison */}
      <Card padding="md">
        <h2 className="text-sm font-semibold text-navy-800 mb-3">Pattern confidence comparison</h2>
        <div className="space-y-2">
          {sortedByConfidence.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-xs text-navy-600 w-28 sm:w-40 truncate flex-shrink-0">{p.locationName}</span>
              <div className="flex-1 bg-navy-50 rounded-full h-6 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all ${
                    p.confidence >= 70 ? 'bg-red-500' : p.confidence >= 45 ? 'bg-orange-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${p.confidence}%` }}
                />
                <span className="absolute inset-0 flex items-center px-2 text-xs font-semibold text-navy-800 tabular-nums">
                  {p.confidence}%
                </span>
              </div>
              <span className="text-xs text-navy-400 hidden sm:inline w-20 text-right flex-shrink-0">
                {p.reportCount} reports
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Highest vs lowest */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Card padding="md" className="bg-teal-50 border border-teal-100">
          <div className="text-xs font-semibold text-teal-700 mb-1">Highest confidence pattern</div>
          <div className="text-sm font-bold text-navy-900">{topPattern.locationName}</div>
          <div className="text-xs text-navy-500 mt-1">
            {topPattern.confidence}% · {topPattern.reportCount} reports · {topPattern.distinctReporters} reporters
          </div>
        </Card>
        <Card padding="md" className="bg-amber-50 border border-amber-100">
          <div className="text-xs font-semibold text-amber-700 mb-1">Lowest confidence pattern</div>
          <div className="text-sm font-bold text-navy-900">{bottomPattern.locationName}</div>
          <div className="text-xs text-navy-500 mt-1">
            {bottomPattern.confidence}% · {bottomPattern.reportCount} reports · {bottomPattern.distinctReporters} reporters
          </div>
        </Card>
      </div>
    </div>
  );
}
