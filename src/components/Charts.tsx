import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { ACTIVITY_BY_HOUR } from '@/lib/data';
import type { Pattern } from '@/types';

const TEAL = '#16a687';
const NAVY = '#45607e';
const AMBER = '#fa9c12';
const ORANGE = '#f97316';
const RED = '#ef4444';
const SLATE = '#7892b8';

const CATEGORY_COLORS: Record<string, string> = {
  Harassment: RED,
  Catcalling: ORANGE,
  Following: AMBER,
  Loitering: TEAL,
  'Threatening behavior': '#dc2626',
  'Unsafe environment': SLATE,
  Other: '#9fb3c8',
};

interface HourChartProps {
  highlightStart?: number;
  highlightEnd?: number;
  height?: number;
}

export function ActivityByHourChart({ highlightStart, highlightEnd, height = 200 }: HourChartProps) {
  const data = ACTIVITY_BY_HOUR.map((d) => ({
    ...d,
    highlighted: highlightStart !== undefined && highlightEnd !== undefined && d.hour >= highlightStart && d.hour <= highlightEnd,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 10, fill: '#7892b8' }}
          tickFormatter={(h: number) => (h % 3 === 0 ? `${h}` : '')}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 10, fill: '#7892b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            boxShadow: '0 4px 16px -2px rgba(29,42,61,0.10)',
          }}
          labelFormatter={(h) => `${h}:00 – ${h}:59`}
          formatter={(v) => [`${v} reports`, 'Reports']}
        />
        <Bar dataKey="reports" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.highlighted ? AMBER : NAVY} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface CategoryChartProps {
  data: { type: string; count: number }[];
  height?: number;
}

export function IncidentCategoryChart({ data, height = 220 }: CategoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: '#7892b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="type"
          tick={{ fontSize: 10, fill: '#45607e' }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            boxShadow: '0 4px 16px -2px rgba(29,42,61,0.10)',
          }}
          formatter={(v) => [`${v} reports`, '']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
          {data.map((entry, i) => (
            <Cell key={i} fill={CATEGORY_COLORS[entry.type] || NAVY} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface ConfidenceGaugeProps {
  confidence: number;
  size?: number;
}

export function ConfidenceGauge({ confidence, size = 140 }: ConfidenceGaugeProps) {
  const color = confidence >= 70 ? RED : confidence >= 45 ? ORANGE : AMBER;
  const data = [{ name: 'confidence', value: confidence, fill: color }];

  return (
    <div style={{ width: size, height: size }} className="relative mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="72%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: '#e2e8f0' }} dataKey="value" cornerRadius={10} angleAxisId={0} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-navy-900 tabular-nums">{confidence}%</span>
        <span className="text-[10px] text-navy-500">confidence</span>
      </div>
    </div>
  );
}

interface PatternMiniPieProps {
  pattern: Pattern;
  size?: number;
}

export function IncidentBreakdownPie({ pattern, size = 160 }: PatternMiniPieProps) {
  const data = pattern.incidentBreakdown.map((d) => ({
    name: d.type,
    value: d.count,
    fill: CATEGORY_COLORS[d.type] || NAVY,
  }));

  return (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="45%"
          outerRadius="75%"
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '12px',
            boxShadow: '0 4px 16px -2px rgba(29,42,61,0.10)',
          }}
          formatter={(v, _n, p) => [`${v} reports`, (p as { payload: { name: string } }).payload.name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
