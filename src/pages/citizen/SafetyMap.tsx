import { useState, useMemo } from 'react';
import { ShieldCheck, MapPin, Users, CalendarDays, Clock, AlertCircle, Activity } from 'lucide-react';
import { SafetyMap } from '@/components/SafetyMap';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { StatusBadge, ConfidenceBadge } from '@/components/ui/Badge';
import { PATTERNS, MAP_CENTER } from '@/lib/data';
import { formatHourRange } from '@/lib/utils';
import type { Pattern } from '@/types';
import { STATUS_COLORS } from '@/types';

export function SafetyMapPage() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [filterHour, setFilterHour] = useState<number | null>(null);

  // Filter patterns by time intelligence if hour is selected
  const visiblePatterns = useMemo(() => {
    if (filterHour === null) return PATTERNS;
    return PATTERNS.map((p) => {
      const ti = p.timeIntelligence.find((t) => t.hour === filterHour);
      if (ti) return { ...p, status: ti.status };
      return p;
    });
  }, [filterHour]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-navy-950 text-white px-4 py-2.5 flex-shrink-0">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-400" />
            <h1 className="font-bold text-base">Safety Signals</h1>
          </div>
          <p className="text-xs text-navy-300 mt-0.5">Aggregated patterns from anonymous reports</p>
        </div>
      </header>

      {/* Time filter */}
      <div className="bg-white border-b border-navy-100 px-4 py-2 flex-shrink-0">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock size={14} className="text-navy-400" />
            <span className="text-xs font-medium text-navy-600">Time filter</span>
            {filterHour !== null && (
              <button
                onClick={() => setFilterHour(null)}
                className="btn-touch ml-auto text-xs text-teal-600 font-medium px-2 py-0.5 rounded-md hover:bg-teal-50"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            <FilterChip label="All times" active={filterHour === null} onClick={() => setFilterHour(null)} />
            <FilterChip label="6 PM" active={filterHour === 18} onClick={() => setFilterHour(18)} />
            <FilterChip label="9 PM" active={filterHour === 21} onClick={() => setFilterHour(21)} />
            <FilterChip label="10 PM" active={filterHour === 22} onClick={() => setFilterHour(22)} />
            <FilterChip label="12 AM" active={filterHour === 0} onClick={() => setFilterHour(0)} />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <SafetyMap
          patterns={visiblePatterns}
          center={MAP_CENTER}
          zoom={14}
          onPatternClick={(p) => setSelectedPattern(p)}
          selectedPatternId={selectedPattern?.id}
          className="w-full h-full"
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl shadow-card p-2.5 z-[1000]">
          <div className="text-[10px] font-semibold text-navy-500 uppercase tracking-wide mb-1.5">Signal levels</div>
          <div className="space-y-1">
            {(Object.keys(STATUS_COLORS) as Pattern['status'][]).map((status) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: STATUS_COLORS[status].marker }}
                />
                <span className="text-[11px] text-navy-700">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo banner */}
        <div className="absolute top-3 right-3 z-[1000] max-w-[55%]">
          <div className="flex items-start gap-1.5 rounded-lg bg-white/90 backdrop-blur border border-navy-100 px-2 py-1.5 text-[10px] text-navy-500">
            <span className="flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>
              <span className="font-semibold text-navy-700">Demo data</span> — synthetic for prototype
            </span>
          </div>
        </div>
      </div>

      {/* Bottom sheet for pattern details */}
      <BottomSheet
        open={!!selectedPattern}
        onClose={() => setSelectedPattern(null)}
        title={selectedPattern?.locationName}
      >
        {selectedPattern && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={selectedPattern.status} size="md" />
              <ConfidenceBadge confidence={selectedPattern.confidence} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <StatBox icon={<Activity size={16} />} label="Reports" value={selectedPattern.reportCount} />
              <StatBox icon={<Users size={16} />} label="Distinct reporters" value={selectedPattern.distinctReporters} />
              <StatBox icon={<CalendarDays size={16} />} label="Different days" value={selectedPattern.distinctDays} />
              <StatBox icon={<Clock size={16} />} label="Peak period" value={formatHourRange(selectedPattern.peakPeriodStart, selectedPattern.peakPeriodEnd)} />
            </div>

            {/* Why flagged */}
            <div>
              <h4 className="text-sm font-semibold text-navy-800 mb-2">Why was this flagged?</h4>
              <div className="space-y-1.5">
                {selectedPattern.flagReasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-navy-600">
                    <AlertCircle size={15} className="text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time intelligence for this pattern */}
            <div>
              <h4 className="text-sm font-semibold text-navy-800 mb-2">Time intelligence</h4>
              <div className="flex gap-1.5">
                {selectedPattern.timeIntelligence.map((ti, i) => (
                  <div key={i} className="flex-1 bg-navy-50 rounded-lg p-2 text-center min-w-0">
                    <div className="text-xs text-navy-400 mb-1">{formatHourRange(ti.hour, ti.hour)}</div>
                    <StatusBadge status={ti.status} withDot={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Incident breakdown */}
            <div>
              <h4 className="text-sm font-semibold text-navy-800 mb-2">Incident breakdown</h4>
              <div className="space-y-1.5">
                {selectedPattern.incidentBreakdown.map((inc) => (
                  <div key={inc.type} className="flex items-center justify-between text-sm">
                    <span className="text-navy-600">{inc.type}</span>
                    <span className="font-semibold text-navy-800 tabular-nums">{inc.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-navy-400 pt-2 border-t border-navy-50">
              <MapPin size={12} className="flex-shrink-0" />
              <span>Requires review — not confirmed criminal activity.</span>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`btn-touch whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
        active ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
      }`}
    >
      {label}
    </button>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-navy-50 rounded-xl p-3 min-w-0">
      <div className="flex items-center gap-1.5 text-navy-400 mb-1">
        {icon}
        <span className="text-xs truncate">{label}</span>
      </div>
      <div className="text-base font-bold text-navy-800 tabular-nums truncate">{value}</div>
    </div>
  );
}
