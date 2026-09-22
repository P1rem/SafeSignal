import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Activity, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SafetyMap } from '@/components/SafetyMap';
import { ActivityByHourChart } from '@/components/Charts';
import { PatternCard } from '@/components/PatternCard';
import { DemoDataBanner } from '@/components/ui/States';
import { STATS, PATTERNS, MAP_CENTER } from '@/lib/data';

const statCards = [
  { label: 'Total Reports', value: STATS.totalReports, icon: Activity, from: '#0d8470', to: '#16a687', shadow: 'rgba(13,132,112,0.4)' },
  { label: 'Active Patterns', value: STATS.activePatterns, icon: TrendingUp, from: '#1e3a5f', to: '#2a5298', shadow: 'rgba(42,82,152,0.4)' },
  { label: 'High Confidence', value: STATS.highConfidence, icon: AlertTriangle, from: '#b91c1c', to: '#ef4444', shadow: 'rgba(185,28,28,0.4)' },
  { label: 'Areas Monitored', value: STATS.areasMonitored, icon: MapPin, from: '#b45309', to: '#f59e0b', shadow: 'rgba(180,83,9,0.35)' },
];

export function AuthorityDashboard() {
  const risingPatterns = PATTERNS.filter((p) => p.status !== 'Emerging' || p.confidence < 25).slice(0, 4);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>

      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#131c2b', margin: 0 }}>Operations Overview</h1>
          <p style={{ fontSize: 13, color: '#5c7ba0', margin: '4px 0 0' }}>
            Real-time safety signal monitoring across {STATS.areasMonitored} areas
          </p>
        </div>
        <DemoDataBanner />
      </div>

      {/* Stat cards */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
  {statCards.map(({ label, value, icon: Icon, from, to, shadow }) => (
    <div key={label} style={{
      background: `linear-gradient(135deg, ${from}, ${to})`,
      borderRadius: 14, padding: '14px 16px',
      boxShadow: `0 4px 16px ${shadow}`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color="white" />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  ))}
</div>
      {/* Map + chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 3px rgba(29,42,61,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #eef2f7' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1d2a3d' }}>Safety Signal Map</span>
            <Link to="/authority/patterns" style={{ fontSize: 12, color: '#16a687', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
              All patterns <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ height: 360 }}>
            <SafetyMap patterns={PATTERNS} center={MAP_CENTER} zoom={13} className="w-full h-full" />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 3px rgba(29,42,61,0.08)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #eef2f7' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1d2a3d' }}>Activity by hour</span>
          </div>
          <div style={{ padding: 16 }}>
            <ActivityByHourChart height={280} />
          </div>
        </div>
      </div>

      {/* Active patterns */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1d2a3d' }}>Active patterns</span>
          <Link to="/authority/patterns" style={{ fontSize: 12, color: '#16a687', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {risingPatterns.map((p) => (
            <PatternCard key={p.id} pattern={p} to={`/authority/patterns/${p.id}`} />
          ))}
        </div>
      </div>

      {/* Anti-gaming notice */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1520, #1a2d45)',
        borderRadius: 18, padding: '20px 24px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: 'rgba(22,166,135,0.2)',
          border: '1px solid rgba(22,166,135,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ShieldCheck size={20} color="#34c19e" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Anti-gaming protection</div>
          <p style={{ fontSize: 12, color: '#7892b8', lineHeight: 1.6, margin: 0 }}>
            Pattern confidence is based on reporter diversity, temporal spread, and day distribution — not raw volume alone. Coordinated bursts from few sources produce low confidence.
          </p>
          <Link to="/authority/analytics" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#34c19e', fontWeight: 500, textDecoration: 'none', marginTop: 8 }}>
            Learn more <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}