import { cn } from '@/lib/utils';
import type { PatternStatus } from '@/types';
import { STATUS_COLORS } from '@/types';

interface BadgeProps {
  status: PatternStatus;
  size?: 'sm' | 'md';
  withDot?: boolean;
}

export function StatusBadge({ status, size = 'sm', withDot = true }: BadgeProps) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      )}
    >
      {withDot && <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />}
      {status}
    </span>
  );
}

interface ConfidenceBadgeProps {
  confidence: number;
  size?: 'sm' | 'md';
}

export function ConfidenceBadge({ confidence, size = 'sm' }: ConfidenceBadgeProps) {
  const color =
    confidence >= 70
      ? 'bg-red-50 text-red-700'
      : confidence >= 45
      ? 'bg-orange-50 text-orange-700'
      : 'bg-amber-50 text-amber-700';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        color,
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      )}
    >
      {confidence}% confidence
    </span>
  );
}

interface TagBadgeProps {
  children: React.ReactNode;
  color?: 'teal' | 'navy' | 'amber' | 'slate';
}

export function TagBadge({ children, color = 'slate' }: TagBadgeProps) {
  const colors = {
    teal: 'bg-teal-50 text-teal-700',
    navy: 'bg-navy-100 text-navy-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-navy-50 text-navy-600',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium', colors[color])}>
      {children}
    </span>
  );
}
