import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, CalendarDays, Clock, AlertCircle, ShieldCheck, Lightbulb, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, ConfidenceBadge } from '@/components/ui/Badge';
import { SafetyMap } from '@/components/SafetyMap';
import { ConfidenceGauge, IncidentBreakdownPie } from '@/components/Charts';
import { FactorBreakdown } from '@/components/FactorBreakdown';
import { getPatternById, SCORING_LABEL } from '@/lib/data';
import { formatHourRange } from '@/lib/utils';
import { DemoDataBanner, ErrorState } from '@/components/ui/States';

export function PatternDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pattern = id ? getPatternById(id) : undefined;

  if (!pattern) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ErrorState
          title="Pattern not found"
          message="This pattern may have been resolved or the ID is incorrect."
          action={<Button onClick={() => navigate('/authority/patterns')}>Back to patterns</Button>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Back link */}
      <Link
        to="/authority/patterns"
        className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-4"
      >
        <ArrowLeft size={16} />
        All patterns
      </Link>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={pattern.status} size="md" />
          <ConfidenceBadge confidence={pattern.confidence} size="md" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy-950">{pattern.locationName}</h1>
        <p className="text-sm text-navy-500 mt-1">Rising safety pattern — requires review</p>
      </div>

      <div className="mb-4">
        <DemoDataBanner />
      </div>

      {/* Map */}
      <Card padding="sm" className="mb-4">
        <div className="rounded-xl overflow-hidden h-[250px] sm:h-[350px]">
          <SafetyMap
            patterns={[pattern]}
            center={[pattern.lat, pattern.lng]}
            zoom={16}
            selectedPatternId={pattern.id}
            className="w-full h-full"
          />
        </div>
      </Card>

      {/* Metrics grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {/* Confidence gauge */}
        <Card padding="md">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Pattern confidence</h3>
          <ConfidenceGauge confidence={pattern.confidence} />
          <p className="text-xs text-navy-400 text-center mt-2">
            {SCORING_LABEL}
          </p>
        </Card>

        {/* Key metrics */}
        <Card padding="md">
          <h3 className="text-sm font-semibold text-navy-800 mb-3">Key metrics</h3>
          <div className="space-y-3">
            <MetricRow icon={<Activity size={16} />} label="Reports" value={pattern.reportCount} />
            <MetricRow icon={<Users size={16} />} label="Distinct reporters" value={pattern.distinctReporters} />
            <MetricRow icon={<CalendarDays size={16} />} label="Distinct days" value={pattern.distinctDays} />
            <MetricRow icon={<Clock size={16} />} label="Peak period" value={formatHourRange(pattern.peakPeriodStart, pattern.peakPeriodEnd)} />
          </div>
        </Card>
      </div>

      {/* Factor breakdown */}
      <Card padding="md" className="mb-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-1">Confidence factor breakdown</h3>
        <p className="text-xs text-navy-400 mb-3">
          Tap any factor to see how it contributes to the score. {SCORING_LABEL}
        </p>
        <FactorBreakdown factors={pattern.confidenceFactors} totalScore={pattern.confidence} />
      </Card>

      {/* Incident breakdown */}
      <Card padding="md" className="mb-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-3">Incident breakdown</h3>
        <div className="grid sm:grid-cols-2 gap-4 items-center">
          <div className="flex justify-center">
            <IncidentBreakdownPie pattern={pattern} />
          </div>
          <div className="space-y-2">
            {pattern.incidentBreakdown.map((inc) => (
              <div key={inc.type} className="flex items-center justify-between text-sm py-1.5 border-b border-navy-50 last:border-0">
                <span className="text-navy-600">{inc.type}</span>
                <span className="font-semibold text-navy-800 tabular-nums">{inc.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Why flagged */}
      <Card padding="md" className="mb-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-3">Why was this pattern flagged?</h3>
        <div className="space-y-2">
          {pattern.flagReasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-navy-600">
              <AlertCircle size={15} className="text-teal-600 flex-shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Time intelligence */}
      <Card padding="md" className="mb-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-3">Time intelligence</h3>
        <p className="text-xs text-navy-400 mb-3">
          The same location can show different signal levels at different times of day.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {pattern.timeIntelligence.map((ti, i) => (
            <div key={i} className="bg-navy-50 rounded-xl p-3 text-center">
              <div className="text-xs text-navy-400 mb-2">{formatHourRange(ti.hour, ti.hour)}</div>
              <StatusBadge status={ti.status} withDot={false} />
            </div>
          ))}
        </div>
      </Card>

      {/* Preventive actions */}
      <Card padding="md" className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-navy-800">Suggested review actions</h3>
        </div>
        <div className="space-y-2">
          {pattern.suggestedActions.map((action, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-navy-600 bg-navy-50 rounded-lg px-3 py-2.5">
              <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <span>{action}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-600 mt-3 pt-3 border-t border-navy-50">
          <ShieldCheck size={14} />
          <span>Requires review — SafeSignal does not confirm criminal activity.</span>
        </div>
      </Card>

      {/* Anti-gaming comparison */}
      <Card padding="md" className="bg-navy-50 border border-navy-100">
        <h3 className="text-sm font-semibold text-navy-800 mb-3">Anti-gaming context</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3">
            <div className="text-xs font-semibold text-red-600 mb-1">Low confidence</div>
            <div className="text-sm text-navy-700 mb-1">20 reports from 1 source in 5 minutes</div>
            <div className="text-xs text-navy-400">High volume, low diversity — potential coordinated burst</div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-xs font-semibold text-teal-600 mb-1">Higher confidence</div>
            <div className="text-sm text-navy-700 mb-1">12 reports from 9 sources across 7 days</div>
            <div className="text-xs text-navy-400">Diverse reporters, spread across time — genuine signal</div>
          </div>
        </div>
        <div className="mt-3 bg-white rounded-xl p-3">
          <div className="text-xs font-semibold text-navy-700 mb-2">This pattern's factors</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <FactorPill label="Reporter diversity" value={`${pattern.distinctReporters}/${pattern.reportCount}`} />
            <FactorPill label="Day spread" value={`${pattern.distinctDays} days`} />
            <FactorPill label="Confidence" value={`${pattern.confidence}%`} />
          </div>
        </div>
        <p className="text-xs text-navy-400 mt-3">
          {SCORING_LABEL}
        </p>
      </Card>
    </div>
  );
}

function MetricRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-500">
        {icon}
      </div>
      <span className="text-sm text-navy-500 flex-1">{label}</span>
      <span className="text-sm font-bold text-navy-800 tabular-nums">{value}</span>
    </div>
  );
}

function FactorPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-navy-50 rounded-lg px-2.5 py-1.5">
      <div className="text-[10px] text-navy-400">{label}</div>
      <div className="text-xs font-semibold text-navy-700 tabular-nums">{value}</div>
    </div>
  );
}
