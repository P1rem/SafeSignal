import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { TrendingUp, AlertTriangle, Activity, MapPin } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: 'reports' | 'patterns' | 'confidence' | 'areas';
  accent?: 'teal' | 'amber' | 'red' | 'navy';
}

const iconMap = {
  reports: Activity,
  patterns: TrendingUp,
  confidence: AlertTriangle,
  areas: MapPin,
};

const accentMap: Record<
  NonNullable<StatCardProps['accent']>,
  { topBorder: string; iconBg: string; valueColor: string }
> = {
  teal: {
    topBorder: 'border-t-[3px] border-teal-500',
    iconBg: 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-sm shadow-teal-600/30',
    valueColor: 'text-teal-700',
  },
  amber: {
    topBorder: 'border-t-[3px] border-amber-400',
    iconBg: 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm shadow-amber-500/30',
    valueColor: 'text-amber-700',
  },
  red: {
    topBorder: 'border-t-[3px] border-red-500',
    iconBg: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm shadow-red-600/30',
    valueColor: 'text-red-700',
  },
  navy: {
    topBorder: 'border-t-[3px] border-navy-600',
    iconBg: 'bg-gradient-to-br from-navy-600 to-navy-700 text-white shadow-sm shadow-navy-700/30',
    valueColor: 'text-navy-800',
  },
};

export function StatCard({ label, value, icon = 'reports', accent = 'teal' }: StatCardProps) {
  const Icon = iconMap[icon];
  const colors = accentMap[accent];
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-card p-3 sm:p-4 flex items-center gap-3 min-w-0 overflow-hidden',
        colors.topBorder
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          colors.iconBg
        )}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div
          className={cn(
            'text-2xl sm:text-3xl font-bold leading-tight tabular-nums',
            colors.valueColor
          )}
        >
          {value}
        </div>
        <div className="text-xs text-navy-500 truncate">{label}</div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card p-3 sm:p-4 flex items-center gap-3 animate-pulse border-t-[3px] border-navy-100">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy-100" />
      <div className="min-w-0 flex-1">
        <div className="h-6 w-16 bg-navy-100 rounded mb-1" />
        <div className="h-3 w-20 bg-navy-50 rounded" />
      </div>
    </div>
  );
}
