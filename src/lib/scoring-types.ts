export type ConfidenceFactor =
  | 'reporterDiversity'
  | 'daySpread'
  | 'timeWindowConsistency'
  | 'locationConsistency'
  | 'categoryConsistency'
  | 'duplicateConcentration'
  | 'volumeThreshold';

export interface FactorDetail {
  key: ConfidenceFactor;
  label: string;
  description: string;
  rawValue: number; // 0-1 normalized
  weight: number; // 0-1 share of total
  contribution: number; // 0-100 points contributed
}

export interface ConfidenceBreakdown {
  factors: FactorDetail[];
  totalScore: number; // 0-100
  label: string;
}

export interface PatternFactors {
  totalReports: number;
  distinctReporters: number;
  distinctDays: number;
  reporterDiversity: number; // 0-1
  daySpread: number; // 0-1
  timeWindowConsistency: number; // 0-1
  locationConsistency: number; // 0-1
  categoryConsistency: number; // 0-1
  duplicateConcentration: number; // 0-1 (high = bad)
  volumeThreshold: number; // 0-1
}

export const SCORING_LABEL = 'Prototype heuristic scoring, not a validated risk probability.';

export const FACTOR_WEIGHTS: Record<ConfidenceFactor, number> = {
  reporterDiversity: 0.30,
  daySpread: 0.20,
  timeWindowConsistency: 0.15,
  locationConsistency: 0.10,
  categoryConsistency: 0.10,
  duplicateConcentration: 0.10,
  volumeThreshold: 0.05,
};

export const FACTOR_DESCRIPTIONS: Record<ConfidenceFactor, { label: string; description: string }> = {
  reporterDiversity: {
    label: 'Reporter diversity',
    description: 'Ratio of distinct reporters to total reports. Higher means more independent sources corroborating the pattern.',
  },
  daySpread: {
    label: 'Day spread',
    description: 'Distribution of reports across distinct days. Higher means the concern persists over time, not a single-day spike.',
  },
  timeWindowConsistency: {
    label: 'Time-window consistency',
    description: 'How concentrated reports are within a recurring time window. Higher means reports cluster at similar hours.',
  },
  locationConsistency: {
    label: 'Location consistency',
    description: 'How tightly reports cluster geographically. Higher means reports are co-located within a small area.',
  },
  categoryConsistency: {
    label: 'Category consistency',
    description: 'Whether reports describe similar incident types. Higher means multiple reports describe the same kind of concern.',
  },
  duplicateConcentration: {
    label: 'Duplicate concentration',
    description: 'Inverse of reporter diversity. High concentration means few sources produced many reports — a potential coordination signal.',
  },
  volumeThreshold: {
    label: 'Volume threshold',
    description: 'Whether enough reports exist to form a pattern. Saturates at 10+ reports — raw count does not keep increasing the score.',
  },
};
