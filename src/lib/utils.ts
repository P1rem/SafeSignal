import type { PatternStatus } from '@/types';

export function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display} ${period}`;
}

export function formatHourRange(start: number, end: number): string {
  return `${formatHour(start)} – ${formatHour(end)}`;
}

export function statusConfidence(confidence: number): PatternStatus {
  if (confidence >= 70) return 'Rising pattern';
  if (confidence >= 45) return 'Repeated concern';
  return 'Emerging';
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateReportId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'SS-';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
