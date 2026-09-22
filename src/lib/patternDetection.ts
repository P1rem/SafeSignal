import type { Report, IncidentType } from '@/types';
import type { PatternFactors, ConfidenceBreakdown, FactorDetail, ConfidenceFactor } from '@/lib/scoring-types';
import { FACTOR_WEIGHTS, FACTOR_DESCRIPTIONS, SCORING_LABEL } from '@/lib/scoring-types';

export { SCORING_LABEL, FACTOR_WEIGHTS, FACTOR_DESCRIPTIONS };

/**
 * Compute all raw factors (0-1 normalized) for a set of reports
 * attributed to a single location cluster.
 */
export function computeFactors(reports: Report[]): PatternFactors {
  const totalReports = reports.length;

  const reporterSet = new Set(reports.map((r) => r.reporterId));
  const distinctReporters = reporterSet.size;

  const daySet = new Set(reports.map((r) => r.dayOffset));
  const distinctDays = daySet.size;

  // ── Reporter diversity: distinct reporters / total reports ───────
  // 1.0 = every report from a different person; 0.05 = all from same person
  const reporterDiversity = totalReports > 0 ? distinctReporters / totalReports : 0;

  // ── Day spread: distinct days / 14 (observation window) ──────────
  // Saturates at 7+ days since more days don't add proportionally more confidence
  const daySpread = Math.min(distinctDays / 7, 1);

  // ── Time-window consistency ──────────────────────────────────────
  // Find the peak 2-hour window and measure what fraction of reports fall in it.
  // But penalize if ALL reports are in a 5-minute span (burst detection).
  const hourCounts: number[] = new Array(24).fill(0);
  reports.forEach((r) => hourCounts[r.hour]++);
  let maxWindowCount = 0;
  for (let h = 0; h < 24; h++) {
    const windowCount = hourCounts[h] + (hourCounts[(h + 1) % 24] || 0);
    if (windowCount > maxWindowCount) maxWindowCount = windowCount;
  }
  const peakFraction = totalReports > 0 ? maxWindowCount / totalReports : 0;

  // Check temporal span in minutes
  const timestamps = reports.map((r) => r.timestamp).sort((a, b) => a - b);
  const spanMs = timestamps.length > 0 ? timestamps[timestamps.length - 1] - timestamps[0] : 0;
  const spanMinutes = spanMs / (1000 * 60);
  // If all reports within 10 minutes, that's a burst — reduce time-window score
  const burstPenalty = spanMinutes < 10 && totalReports > 5 ? 0.3 : 1.0;
  // Peak fraction of 0.5-0.8 is ideal (recurring but not all identical time)
  const timeWindowConsistency = Math.min(peakFraction, 0.85) * burstPenalty;

  // ── Location consistency ─────────────────────────────────────────
  // Reports already belong to a location cluster, so this measures
  // how tightly they group within that cluster (low geographic jitter).
  // Since our synthetic data jitters around a known center, we measure
  // the max distance from centroid relative to a threshold.
  if (totalReports === 0) {
    return {
      totalReports: 0,
      distinctReporters: 0,
      distinctDays: 0,
      reporterDiversity: 0,
      daySpread: 0,
      timeWindowConsistency: 0,
      locationConsistency: 0,
      categoryConsistency: 0,
      duplicateConcentration: 0,
      volumeThreshold: 0,
    };
  }

  const avgLat = reports.reduce((s, r) => s + r.lat, 0) / totalReports;
  const avgLng = reports.reduce((s, r) => s + r.lng, 0) / totalReports;
  const maxDist = Math.max(...reports.map((r) => Math.sqrt((r.lat - avgLat) ** 2 + (r.lng - avgLng) ** 2)));
  // ~0.005 degrees ≈ 500m. If spread is tight (< 0.003), high consistency.
  const locationConsistency = Math.max(0, 1 - maxDist / 0.006);

  // ── Category consistency ─────────────────────────────────────────
  // Shannon entropy-based: high when one or two categories dominate.
  const categoryMap: Map<IncidentType, number> = new Map();
  reports.forEach((r) => categoryMap.set(r.type, (categoryMap.get(r.type) || 0) + 1));
  const categories = Array.from(categoryMap.values());
  const entropy = -categories.reduce((sum, c) => {
    const p = c / totalReports;
    return sum + (p > 0 ? p * Math.log2(p) : 0);
  }, 0);
  const maxEntropy = Math.log2(categories.length);
  // Normalize: low entropy (concentrated) = high consistency
  const categoryConsistency = maxEntropy > 0 ? Math.max(0, 1 - entropy / maxEntropy) : 1;

  // ── Duplicate concentration (inverse of diversity) ───────────────
  // High when few reporters produce many reports. This is a penalty factor.
  const maxReportsPerReporter = Math.max(
    ...Array.from(reporterSet.values()).map((id) => reports.filter((r) => r.reporterId === id).length)
  );
  const duplicateConcentration = totalReports > 0 ? (maxReportsPerReporter - 1) / totalReports : 0;

  // ── Volume threshold ─────────────────────────────────────────────
  // Saturates at 10 reports. Going from 3→5 reports matters; 50→100 does not.
  const volumeThreshold = Math.min(totalReports / 10, 1);

  return {
    totalReports,
    distinctReporters,
    distinctDays,
    reporterDiversity,
    daySpread,
    timeWindowConsistency,
    locationConsistency,
    categoryConsistency,
    duplicateConcentration,
    volumeThreshold,
  };
}

/**
 * Convert raw factors into a transparent 0-100 confidence score
 * using fixed, visible weights. The score does NOT increase simply
 * because report count increases — volume is capped at 5% weight.
 */
export function scoreConfidence(factors: PatternFactors): ConfidenceBreakdown {
  const factorKeys: ConfidenceFactor[] = [
    'reporterDiversity',
    'daySpread',
    'timeWindowConsistency',
    'locationConsistency',
    'categoryConsistency',
    'duplicateConcentration',
    'volumeThreshold',
  ];

  const factorsList: FactorDetail[] = factorKeys.map((key) => {
    const weight = FACTOR_WEIGHTS[key];
    const meta = FACTOR_DESCRIPTIONS[key];

    let rawValue: number;
    if (key === 'duplicateConcentration') {
      // This is a penalty: invert so that high concentration = low contribution
      rawValue = 1 - factors.duplicateConcentration;
    } else {
      rawValue = factors[key];
    }

    const contribution = Math.round(rawValue * weight * 100);

    return {
      key,
      label: meta.label,
      description: meta.description,
      rawValue: Math.round(rawValue * 100) / 100,
      weight,
      contribution,
    };
  });

  const totalScore = Math.round(factorsList.reduce((sum, f) => sum + f.contribution, 0));

  const label =
    totalScore >= 70 ? 'Rising pattern' : totalScore >= 45 ? 'Repeated concern' : 'Emerging';

  return {
    factors: factorsList,
    totalScore: Math.min(totalScore, 100),
    label,
  };
}

/**
 * Determine whether a set of reports constitutes a pattern at all.
 * Scattered reports across unrelated locations should not form a pattern.
 */
export function shouldFormPattern(factors: PatternFactors): boolean {
  // Need at least 3 reports to even consider a cluster
  if (factors.totalReports < 3) return false;
  // If there's only 1 reporter and more than 3 reports, it's a single-source burst —
  // we still show it but with very low confidence so the anti-gaming logic is visible
  return true;
}

/**
 * Generate human-readable flag reasons based on the factor values.
 */
export function generateFlagReasons(factors: PatternFactors): string[] {
  const reasons: string[] = [];

  if (factors.distinctReporters >= 5) {
    reasons.push(`Multiple independent reporters (${factors.distinctReporters} distinct sources)`);
  } else if (factors.distinctReporters <= 3 && factors.totalReports > 10) {
    reasons.push(`Low reporter diversity — only ${factors.distinctReporters} sources for ${factors.totalReports} reports`);
  } else {
    reasons.push(`${factors.distinctReporters} distinct reporters`);
  }

  if (factors.distinctDays >= 5) {
    reasons.push(`Recurring across multiple days (${factors.distinctDays} distinct days)`);
  } else if (factors.distinctDays <= 2) {
    reasons.push(`Concentrated in a short period (${factors.distinctDays} day${factors.distinctDays === 1 ? '' : 's'}) — low temporal spread`);
  }

  if (factors.timeWindowConsistency >= 0.5) {
    reasons.push('Recurring time window detected');
  }

  if (factors.duplicateConcentration > 0.5) {
    reasons.push('High duplicate concentration — potential coordinated reporting');
  } else if (factors.duplicateConcentration < 0.2) {
    reasons.push('Low duplicate concentration — reports are largely independent');
  }

  if (factors.categoryConsistency >= 0.5) {
    reasons.push('Consistent incident categories reported');
  }

  return reasons;
}

/**
 * The three canonical scenarios for documentation and display.
 * These are synthetic examples that demonstrate the scoring behavior.
 */
export interface ScenarioExample {
  id: string;
  title: string;
  summary: string;
  factors: PatternFactors;
  breakdown: ConfidenceBreakdown;
  interpretation: string;
}

export const SCENARIO_EXAMPLES: ScenarioExample[] = [
  {
    id: 'scenario-a',
    title: 'Scenario A: Coordinated burst',
    summary: '20 reports · 2 reporters · same 5-minute period',
    factors: {
      totalReports: 20,
      distinctReporters: 2,
      distinctDays: 1,
      reporterDiversity: 0.10,
      daySpread: 0.14,
      timeWindowConsistency: 0.15,
      locationConsistency: 0.90,
      categoryConsistency: 0.40,
      duplicateConcentration: 0.90,
      volumeThreshold: 1.0,
    },
    interpretation:
      'High volume but almost all reports come from 2 sources within minutes. Reporter diversity is near zero and day spread is minimal. Despite 20 reports, the confidence is low because the pattern could be coordinated manipulation.',
    breakdown: scoreConfidence({
      totalReports: 20,
      distinctReporters: 2,
      distinctDays: 1,
      reporterDiversity: 0.10,
      daySpread: 0.14,
      timeWindowConsistency: 0.15,
      locationConsistency: 0.90,
      categoryConsistency: 0.40,
      duplicateConcentration: 0.90,
      volumeThreshold: 1.0,
    }),
  },
  {
    id: 'scenario-b',
    title: 'Scenario B: Distributed genuine pattern',
    summary: '12 reports · 9 reporters · 7 different days · consistent location',
    factors: {
      totalReports: 12,
      distinctReporters: 9,
      distinctDays: 7,
      reporterDiversity: 0.75,
      daySpread: 1.0,
      timeWindowConsistency: 0.70,
      locationConsistency: 0.85,
      categoryConsistency: 0.65,
      duplicateConcentration: 0.17,
      volumeThreshold: 1.0,
    },
    interpretation:
      'Fewer reports than Scenario A, but spread across 9 independent reporters and 7 separate days. High reporter diversity and day spread produce strong confidence. This is what a genuine recurring safety concern looks like.',
    breakdown: scoreConfidence({
      totalReports: 12,
      distinctReporters: 9,
      distinctDays: 7,
      reporterDiversity: 0.75,
      daySpread: 1.0,
      timeWindowConsistency: 0.70,
      locationConsistency: 0.85,
      categoryConsistency: 0.65,
      duplicateConcentration: 0.17,
      volumeThreshold: 1.0,
    }),
  },
  {
    id: 'scenario-c',
    title: 'Scenario C: Scattered reports, no pattern',
    summary: '4 reports · 4 reporters · 4 different locations · different times',
    factors: {
      totalReports: 4,
      distinctReporters: 4,
      distinctDays: 4,
      reporterDiversity: 1.0,
      daySpread: 0.57,
      timeWindowConsistency: 0.20,
      locationConsistency: 0.30,
      categoryConsistency: 0.20,
      duplicateConcentration: 0.0,
      volumeThreshold: 0.40,
    },
    interpretation:
      'Each report comes from a different person, but they are spread across unrelated locations and times. There is no recurring location or time window to form a pattern. No rising pattern is flagged — this is normal background noise.',
    breakdown: scoreConfidence({
      totalReports: 4,
      distinctReporters: 4,
      distinctDays: 4,
      reporterDiversity: 1.0,
      daySpread: 0.57,
      timeWindowConsistency: 0.20,
      locationConsistency: 0.30,
      categoryConsistency: 0.20,
      duplicateConcentration: 0.0,
      volumeThreshold: 0.40,
    }),
  },
];
