import { Link } from 'react-router-dom';
import type { Pattern, PatternStatus } from '@/types';
import { cn } from '@/lib/utils';
import { StatusBadge, ConfidenceBadge } from '@/components/ui/Badge';
import { patternPeakLabel } from '@/lib/data';
import { formatHourRange } from '@/lib/utils';
import { MapPin, Users, CalendarDays, Clock, ChevronRight } from 'lucide-react';

interface PatternCardProps {
  pattern: Pattern;
  to?: string;
  onClick?: () => void;
  compact?: boolean;
}

const statusLeft: Record<PatternStatus, string> = {
  Emerging: 'border-l-4 border-amber-400',
  'Repeated concern': 'border-l-4 border-orange-500',
  'Rising pattern': 'border-l-4 border-red-500',
};

const statusTint: Record<PatternStatus, string> = {
  Emerging: 'bg-amber-50/40',
  'Repeated concern': 'bg-orange-50/40',
  'Rising pattern': 'bg-red-50/40',
};

export function PatternCard({ pattern, to, onClick, compact = false }: PatternCardProps) {
  const content = (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-card overflow-hidden w-full transition-shadow',
        to && 'hover:shadow-card-lg cursor-pointer',
        statusLeft[pattern.status]
      )}
    >
      {/* Subtle status tint strip */}
      <div className={cn('px-4 pt-3.5 pb-3', compact ? 'px-3 pt-3 pb-2.5' : '', statusTint[pattern.status])}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={14} className="text-navy-400 flex-shrink-0 mt-0.5" />
            <span className="font-semibold text-navy-900 text-sm truncate leading-snug">
              {pattern.locationName}
            </span>
          </div>
          <StatusBadge status={pattern.status} />
        </div>
        <ConfidenceBadge confidence={pattern.confidence} />
      </div>

      {/* Metrics row */}
      <div className="px-4 pb-3.5">
        <div className="grid grid-cols-3 gap-2 mt-2.5 mb-2.5">
          <Metric icon={<Users size={13} />} label="Reports" value={pattern.reportCount} />
          <Metric icon={<Users size={13} />} label="Reporters" value={pattern.distinctReporters} />
          <Metric icon={<CalendarDays size={13} />} label="Days" value={pattern.distinctDays} />
        </div>

        {!compact && (
          <div className="flex items-center justify-between border-t border-navy-50 pt-2.5">
            <div className="flex items-center gap-1.5 text-xs text-navy-500">
              <Clock size={12} />
              <span>Peak: {formatHourRange(pattern.peakPeriodStart, pattern.peakPeriodEnd)}</span>
            </div>
            {to && (
              <div className="flex items-center gap-0.5 text-xs text-teal-600 font-medium">
                Details
                <ChevronRight size={13} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} role="button" tabIndex={0}>
      {content}
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-navy-50 rounded-lg px-2 py-1.5 text-center">
      <div className="flex items-center justify-center text-navy-400 mb-0.5">{icon}</div>
      <div className="text-sm font-bold text-navy-800 tabular-nums leading-tight">{value}</div>
      <div className="text-[10px] text-navy-500">{label}</div>
    </div>
  );
}

export { patternPeakLabel };
