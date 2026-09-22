import { REPORTS, PATTERNS, getPatternById } from '@/lib/data';
import type { Report, Pattern, IncidentType } from '@/types';

export function getSafetyReports(): Report[] {
  return REPORTS;
}

export function getSafetyPatterns(): Pattern[] {
  return PATTERNS;
}

export function getReportsByCity(city: string): Report[] {
  return REPORTS.filter((r) => r.city === city);
}

export function getReportsByCategory(category: IncidentType): Report[] {
  return REPORTS.filter((r) => r.type === category);
}

export function getReportsByTimeRange(startHour: number, endHour: number): Report[] {
  return REPORTS.filter((r) => r.hour >= startHour && r.hour <= endHour);
}

export function getEmergingPatterns(): Pattern[] {
  return PATTERNS.filter((p) => p.status === 'Emerging');
}

export function getPatternByIdService(id: string): Pattern | undefined {
  return getPatternById(id);
}
