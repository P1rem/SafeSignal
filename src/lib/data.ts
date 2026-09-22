import type { Report, SafetyLocation, Pattern, IncidentType, PatternStatus } from '@/types';
import { formatHourRange } from '@/lib/utils';
import { computeFactors, scoreConfidence, shouldFormPattern, generateFlagReasons } from '@/lib/patternDetection';
import { SCORING_LABEL } from '@/lib/patternDetection';

// Deterministic PRNG for reproducible demo data
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(73219);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function jitter(base: number, amount: number): number {
  return base + (rand() - 0.5) * amount;
}

// India center — used as default map center
const MAP_CENTER: [number, number] = [19.0760, 72.8777]; // Mumbai

export const LOCATIONS: SafetyLocation[] = [
  // Navi Mumbai
  { id: 'vashi-station', name: 'Vashi Railway Station', lat: 19.1207, lng: 72.8405, category: 'Transit' },
  { id: 'cbd-belapur', name: 'CBD Belapur Junction', lat: 19.0330, lng: 73.0380, category: 'Transit' },
  { id: 'kharghar-junction', name: 'Kharghar Junction', lat: 19.1066, lng: 73.0710, category: 'Commercial' },
  // Mumbai
  { id: 'bandra-station', name: 'Bandra Railway Station', lat: 19.0550, lng: 72.8300, category: 'Transit' },
  { id: 'andheri-east', name: 'Andheri East Metro', lat: 19.1136, lng: 72.8697, category: 'Transit' },
  { id: 'dadar-junction', name: 'Dadar Junction', lat: 19.0200, lng: 72.8400, category: 'Transit' },
  // Delhi
  { id: 'cp-outer-circle', name: 'Connaught Place Outer Circle', lat: 28.6315, lng: 77.2167, category: 'Commercial' },
  { id: 'dwarka-sector-12', name: 'Dwarka Sector 12', lat: 28.5920, lng: 77.0460, category: 'Residential' },
  // Bengaluru
  { id: 'mg-road-bangalore', name: 'MG Road, Bengaluru', lat: 12.9756, lng: 77.6050, category: 'Commercial' },
  { id: 'electronic-city', name: 'Electronic City Phase 1', lat: 12.8450, lng: 77.6600, category: 'Industrial' },
  // Hyderabad
  { id: 'hitech-city', name: 'HITEC City Junction', lat: 17.4435, lng: 78.3772, category: 'Commercial' },
  // Pune
  { id: 'hinjewani-phase2', name: 'Hinjewadi Phase 2', lat: 18.5900, lng: 73.7390, category: 'Industrial' },
  { id: 'fc-road-pune', name: 'FC Road, Pune', lat: 18.5300, lng: 73.8400, category: 'Commercial' },
  // Chennai
  { id: 't-nagar-chennai', name: 'T Nagar, Chennai', lat: 13.0418, lng: 80.2341, category: 'Commercial' },
  // Kolkata
  { id: 'park-street-kolkata', name: 'Park Street, Kolkata', lat: 22.5535, lng: 88.3520, category: 'Commercial' },
];

// Map location → city
const LOCATION_CITY: Record<string, string> = {
  'vashi-station': 'Navi Mumbai',
  'cbd-belapur': 'Navi Mumbai',
  'kharghar-junction': 'Navi Mumbai',
  'bandra-station': 'Mumbai',
  'andheri-east': 'Mumbai',
  'dadar-junction': 'Mumbai',
  'cp-outer-circle': 'Delhi',
  'dwarka-sector-12': 'Delhi',
  'mg-road-bangalore': 'Bengaluru',
  'electronic-city': 'Bengaluru',
  'hitech-city': 'Hyderabad',
  'hinjewani-phase2': 'Pune',
  'fc-road-pune': 'Pune',
  't-nagar-chennai': 'Chennai',
  'park-street-kolkata': 'Kolkata',
};

export function getCityByLocation(locationId: string): string {
  return LOCATION_CITY[locationId] || 'Unknown';
}

const INCIDENT_WEIGHTS: { type: IncidentType; weight: number }[] = [
  { type: 'Catcalling', weight: 22 },
  { type: 'Following/Stalking', weight: 18 },
  { type: 'Harassment', weight: 16 },
  { type: 'Unsafe Area', weight: 14 },
  { type: 'Suspicious Activity', weight: 12 },
  { type: 'Intimidation', weight: 10 },
  { type: 'Other', weight: 8 },
];

function pickIncident(): IncidentType {
  const total = INCIDENT_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let r = rand() * total;
  for (const w of INCIDENT_WEIGHTS) {
    r -= w.weight;
    if (r <= 0) return w.type;
  }
  return 'Other';
}

// Fixed base time: Sep 21, 2026, 11:00 PM IST
const BASE_TIME = new Date(2026, 8, 21, 23, 0, 0).getTime();

function timestampFor(dayOffset: number, hour: number, minute: number): number {
  const d = new Date(BASE_TIME);
  d.setDate(d.getDate() - (13 - dayOffset));
  d.setHours(hour, minute, 0, 0);
  return d.getTime();
}

const reports: Report[] = [];

function makeReport(
  prefix: string,
  locationId: string,
  reporterId: string,
  dayOffset: number,
  hour: number,
  minute: number,
  type?: IncidentType
): void {
  const loc = LOCATIONS.find((l) => l.id === locationId);
  if (!loc) return;
  reports.push({
    id: `${prefix}-${reports.length + 1}`,
    locationId,
    type: type || pickIncident(),
    lat: jitter(loc.lat, 0.003),
    lng: jitter(loc.lng, 0.003),
    city: LOCATION_CITY[locationId],
    reporterId,
    timestamp: timestampFor(dayOffset, hour, minute),
    dayOffset,
    hour,
  });
}

// ── Pattern 1: GENUINE EMERGING PATTERN at Vashi Station (Navi Mumbai) ──
// 17 reports, 11 reporters, 8 days, peak 7-10 PM, confidence ~84%
const vashiReporters = Array.from({ length: 11 }, (_, i) => `R-VASHI-${i + 1}`);
const vashiDays = [0, 1, 3, 4, 6, 7, 9, 11];
vashiDays.forEach((day, di) => {
  const countForDay = di === 3 || di === 6 ? 3 : di === 5 || di === 1 ? 2 : 1;
  for (let i = 0; i < countForDay; i++) {
    const reporter = vashiReporters[(di * 2 + i) % vashiReporters.length];
    const hour = 19 + (i % 2) + (di % 2); // 7-10 PM
    const minute = Math.floor(rand() * 55);
    makeReport('RPT-VASHI', 'vashi-station', reporter, day, hour, minute);
  }
});

// ── Pattern 2: COORDINATED BURST at Bandra Station (Mumbai) ─────────────
// 20 reports, 3 reporters, 2 days, 10 PM burst → low confidence
const burstReporters = ['R-BURST-1', 'R-BURST-2', 'R-BURST-3'];
[8, 10].forEach((day, di) => {
  for (let i = 0; i < 10; i++) {
    const reporter = burstReporters[i % burstReporters.length];
    const minute = di === 0 ? i * 2 : i * 3;
    makeReport('RPT-BURST', 'bandra-station', reporter, day, 22, minute);
  }
});

// ── Pattern 3: MODERATE PATTERN at CP Outer Circle (Delhi) ──────────────
// 12 reports, 8 reporters, 6 days, evening 6-9 PM → moderate confidence
const cpReporters = Array.from({ length: 8 }, (_, i) => `R-CP-${i + 1}`);
[0, 2, 4, 6, 8, 11].forEach((day, di) => {
  const reporter = cpReporters[di % cpReporters.length];
  const hour = 18 + (di % 3); // 6-8 PM
  makeReport('RPT-CP', 'cp-outer-circle', reporter, day, hour, Math.floor(rand() * 50));
  if (di === 2 || di === 4) {
    const reporter2 = cpReporters[(di + 1) % cpReporters.length];
    makeReport('RPT-CP', 'cp-outer-circle', reporter2, day, hour + 1, Math.floor(rand() * 40) + 15);
  }
});

// ── Pattern 4: ESTABLISHED PATTERN at MG Road (Bengaluru) ───────────────
// 15 reports, 10 reporters, 7 days, 8-11 PM → high confidence
const mgReporters = Array.from({ length: 10 }, (_, i) => `R-MG-${i + 1}`);
[1, 2, 4, 5, 7, 9, 11].forEach((day, di) => {
  const count = di === 3 || di === 6 ? 3 : di === 1 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    const reporter = mgReporters[(di + i) % mgReporters.length];
    const hour = 20 + (i % 2) + (di % 2); // 8-11 PM
    makeReport('RPT-MG', 'mg-road-bangalore', reporter, day, hour, Math.floor(rand() * 55));
  }
});

// ── Pattern 5: EMERGING PATTERN at Hinjewadi Phase 2 (Pune) ─────────────
// 8 reports, 6 reporters, 5 days, late night → emerging
const hinjReporters = Array.from({ length: 6 }, (_, i) => `R-HINJ-${i + 1}`);
[3, 5, 7, 9, 11].forEach((day, di) => {
  const reporter = hinjReporters[di % hinjReporters.length];
  const hour = 23 + (di % 2) === 24 ? 0 : 23 + (di % 2);
  makeReport('RPT-HINJ', 'hinjewani-phase2', reporter, day, hour, Math.floor(rand() * 45));
  if (di === 2) {
    makeReport('RPT-HINJ', 'hinjewani-phase2', hinjReporters[(di + 2) % hinjReporters.length], day, hour, Math.floor(rand() * 30) + 20);
  }
});

// ── Pattern 6: LOW-CONFIDENCE DUPLICATE at HITEC City (Hyderabad) ───────
// 6 reports, 2 reporters, 2 days → low confidence (duplicate-like)
const hitechReporters = ['R-HITECH-1', 'R-HITECH-2'];
[6, 9].forEach((day) => {
  for (let i = 0; i < 3; i++) {
    makeReport('RPT-HITECH', 'hitech-city', hitechReporters[i % 2], day, 21 + i, Math.floor(rand() * 40));
  }
});

// ── SCATTERED ISOLATED REPORTS across remaining locations ───────────────
const scatterLocations = LOCATIONS.filter(
  (l) => !['vashi-station', 'bandra-station', 'cp-outer-circle', 'mg-road-bangalore', 'hinjewani-phase2', 'hitech-city'].includes(l.id)
);
const scatterReporters = Array.from({ length: 25 }, (_, i) => `R-SCAT-${i + 1}`);

// ~40 scattered reports (isolated, low confidence, no pattern)
for (let i = 0; i < 40; i++) {
  const loc = pick(scatterLocations);
  const day = Math.floor(rand() * 14);
  const hour = Math.floor(rand() * 24);
  const minute = Math.floor(rand() * 55);
  const reporter = pick(scatterReporters);
  makeReport('RPT-SCAT', loc.id, reporter, day, hour, minute);
}

export const REPORTS: Report[] = reports;

// ── Pattern computation ─────────────────────────────────────────────────

function computePattern(locationId: string): Pattern | null {
  const loc = LOCATIONS.find((l) => l.id === locationId);
  if (!loc) return null;

  const locReports = REPORTS.filter((r) => r.locationId === locationId);
  if (locReports.length < 3) return null;

  const factors = computeFactors(locReports);
  if (!shouldFormPattern(factors)) return null;

  const breakdown = scoreConfidence(factors);
  const confidence = breakdown.totalScore;

  const status: PatternStatus =
    confidence >= 70 ? 'Rising pattern' : confidence >= 45 ? 'Repeated concern' : 'Emerging';

  // Hour distribution → find peak
  const hourCounts: number[] = new Array(24).fill(0);
  locReports.forEach((r) => hourCounts[r.hour]++);
  const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
  const peakStart = maxHour;
  const peakEnd = maxHour + 2;

  // Incident breakdown
  const incidentMap: Map<IncidentType, number> = new Map();
  locReports.forEach((r) => {
    incidentMap.set(r.type, (incidentMap.get(r.type) || 0) + 1);
  });
  const incidentBreakdown = Array.from(incidentMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const flagReasons = generateFlagReasons(factors);

  let suggestedActions: string[];
  if (confidence >= 70) {
    suggestedActions = [
      'Review street lighting in the area',
      'Increase patrol visibility during peak hours',
      'Review CCTV coverage and angles',
      'Conduct local safety audit',
    ];
  } else if (confidence >= 45) {
    suggestedActions = [
      'Review street lighting in the area',
      'Monitor for continued reporting patterns',
      'Consider patrol visibility during peak hours',
    ];
  } else if (factors.duplicateConcentration > 0.5) {
    suggestedActions = [
      'Verify reporter diversity before escalating',
      'Cross-reference with other signal sources',
      'Monitor for continued reporting patterns',
    ];
  } else {
    suggestedActions = ['Monitor for continued reporting patterns'];
  }

  const timeIntelligence = [
    { hour: 18, status: 'Emerging' as PatternStatus },
    { hour: 21, status: 'Repeated concern' as PatternStatus },
  ];
  if (confidence >= 70) {
    timeIntelligence.push({ hour: 22, status: 'Rising pattern' as PatternStatus });
  } else if (factors.duplicateConcentration > 0.5) {
    timeIntelligence.push({ hour: 22, status: 'Emerging' as PatternStatus });
  } else {
    timeIntelligence.push({ hour: 22, status: 'Repeated concern' as PatternStatus });
  }

  return {
    id: `PAT-${locationId.toUpperCase()}`,
    locationId,
    locationName: loc.name,
    lat: loc.lat,
    lng: loc.lng,
    status,
    confidence,
    confidenceFactors: breakdown.factors.map((f) => ({
      key: f.key,
      label: f.label,
      description: f.description,
      rawValue: f.rawValue,
      weight: f.weight,
      contribution: f.contribution,
    })),
    reportCount: locReports.length,
    distinctReporters: factors.distinctReporters,
    distinctDays: factors.distinctDays,
    peakPeriodStart: peakStart,
    peakPeriodEnd: peakEnd,
    incidentBreakdown,
    flagReasons,
    suggestedActions,
    timeIntelligence,
  };
}

const computedPatterns = LOCATIONS.map((l) => computePattern(l.id)).filter((p): p is Pattern => p !== null);

export const PATTERNS: Pattern[] = computedPatterns.sort((a, b) => b.confidence - a.confidence);

export function getReportsByLocation(locationId: string): Report[] {
  return REPORTS.filter((r) => r.locationId === locationId);
}

export function getPatternById(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id || p.locationId === id);
}

// Statistics
export const STATS = {
  totalReports: REPORTS.length,
  activePatterns: PATTERNS.length,
  emergingPatterns: PATTERNS.filter((p) => p.status === 'Emerging').length,
  highConfidence: PATTERNS.filter((p) => p.confidence >= 70).length,
  distinctReporters: new Set(REPORTS.map((r) => r.reporterId)).size,
  citiesCovered: new Set(Object.values(LOCATION_CITY)).size,
  areasMonitored: LOCATIONS.length,
};

// Activity by hour chart data
export const ACTIVITY_BY_HOUR = Array.from({ length: 24 }, (_, h) => {
  const count = REPORTS.filter((r) => r.hour === h).length;
  return { hour: h, label: `${h}:00`, reports: count };
});

// Incident category chart data
export const INCIDENT_CATEGORY_DATA = (() => {
  const map: Map<IncidentType, number> = new Map();
  REPORTS.forEach((r) => map.set(r.type, (map.get(r.type) || 0) + 1));
  return Array.from(map.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
})();

// Reports by city chart data
export const REPORTS_BY_CITY = (() => {
  const map: Map<string, number> = new Map();
  REPORTS.forEach((r) => map.set(r.city, (map.get(r.city) || 0) + 1));
  return Array.from(map.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);
})();

export function patternPeakLabel(p: Pattern): string {
  return formatHourRange(p.peakPeriodStart, p.peakPeriodEnd);
}

export { MAP_CENTER, SCORING_LABEL };
