export type IncidentType =
  | 'Harassment'
  | 'Following/Stalking'
  | 'Catcalling'
  | 'Intimidation'
  | 'Unsafe Area'
  | 'Suspicious Activity'
  | 'Other';

export const INCIDENT_TYPES: IncidentType[] = [
  'Harassment',
  'Following/Stalking',
  'Catcalling',
  'Intimidation',
  'Unsafe Area',
  'Suspicious Activity',
  'Other',
];

export type PatternStatus = 'Emerging' | 'Repeated concern' | 'Rising pattern';

export const PATTERN_STATUS_ORDER: PatternStatus[] = ['Emerging', 'Repeated concern', 'Rising pattern'];

export interface SafetyLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
}

export interface Report {
  id: string;
  locationId: string;
  type: IncidentType;
  lat: number;
  lng: number;
  city: string;
  reporterId: string;
  timestamp: number; // ms epoch
  dayOffset: number; // 0-13 within 14-day window
  hour: number; // 0-23
}

export interface ConfidenceFactorDetail {
  key: string;
  label: string;
  description: string;
  rawValue: number; // 0-1
  weight: number; // 0-1
  contribution: number; // 0-100 points
}

export interface Pattern {
  id: string;
  locationId: string;
  locationName: string;
  lat: number;
  lng: number;
  status: PatternStatus;
  confidence: number; // 0-100
  confidenceFactors: ConfidenceFactorDetail[];
  reportCount: number;
  distinctReporters: number;
  distinctDays: number;
  peakPeriodStart: number; // hour 0-23
  peakPeriodEnd: number; // hour 0-23
  incidentBreakdown: { type: IncidentType; count: number }[];
  flagReasons: string[];
  suggestedActions: string[];
  timeIntelligence: { hour: number; status: PatternStatus }[];
}

export const INCIDENT_ICONS: Record<IncidentType, string> = {
  Harassment: 'UserX',
  'Following/Stalking': 'Footprints',
  Catcalling: 'MessageSquareWarning',
  Intimidation: 'AlertTriangle',
  'Unsafe Area': 'Lightbulb',
  'Suspicious Activity': 'Eye',
  Other: 'CircleAlert',
};

export const STATUS_COLORS: Record<PatternStatus, { bg: string; text: string; dot: string; ring: string; marker: string }> = {
  Emerging: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
    ring: 'ring-amber-300',
    marker: '#fbbf24',
  },
  'Repeated concern': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    ring: 'ring-orange-400',
    marker: '#f97316',
  },
  'Rising pattern': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    ring: 'ring-red-400',
    marker: '#ef4444',
  },
};
