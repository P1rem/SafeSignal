import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Clock, Eye, ArrowRight, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DemoDataBanner } from '@/components/ui/States';
import { PATTERNS } from '@/lib/data';
import { StatusBadge } from '@/components/ui/Badge';
import { getCityByLocation } from '@/lib/data';

export function CitizenHome() {
  const topPatterns = PATTERNS.slice(0, 2);

  return (
    <div style={{ minHeight: '100vh', background: '#0d1520' }}>

      {/* ── DARK HERO ── */}
      <div style={{
        background: 'linear-gradient(160deg, #0d1520 0%, #1a2d45 60%, #0f3d2e 100%)',
        padding: '36px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* grid texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, position: 'relative' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(22,166,135,0.2)',
            border: '1px solid rgba(22,166,135,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={20} color="#34c19e" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', lineHeight: 1.2 }}>SafeSignal</div>
            <div style={{ fontSize: 10, color: '#5c7ba0', lineHeight: 1.3 }}>Turning small warnings into early action</div>
          </div>
        </div>

        {/* SOS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* ambient glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Link to="/sos" style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{
              width: 148, height: 148, borderRadius: '50%',
              background: 'linear-gradient(145deg, #ef4444, #b91c1c)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 12px rgba(239,68,68,0.12), 0 0 0 24px rgba(239,68,68,0.06), 0 8px 40px rgba(239,68,68,0.5)',
              cursor: 'pointer',
              transition: 'transform 0.12s',
            }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <AlertTriangle size={32} color="white" style={{ marginBottom: 4 }} />
              <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 6 }}>SOS</span>
            </div>
          </Link>
          <p style={{ color: '#7892b8', fontSize: 13, marginTop: 20 }}>Tap for immediate emergency alert</p>
        </div>
      </div>

      {/* ── WHITE PANEL sliding up ── */}
      <div style={{
        background: '#fff',
        borderRadius: '28px 28px 0 0',
        marginTop: -32,
        padding: '24px 20px 120px',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
        position: 'relative',
      }}>

        {/* Trust strip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, fontSize: 12, color: '#5c7ba0', marginBottom: 20, flexWrap: 'wrap',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={12} /> Anonymous</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#bcccdc' }} />
          <span>Approx location only</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#bcccdc' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> Seconds</span>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <Link to="/report/type" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '14px 20px',
              background: 'linear-gradient(to bottom, #16a687, #0d8470)',
              color: '#fff', fontWeight: 700, fontSize: 16,
              border: 'none', borderRadius: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(13,132,112,0.35)',
            }}>
              Report an incident <ArrowRight size={20} />
            </button>
          </Link>
          <Link to="/map" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '14px 20px',
              background: '#fff', color: '#1d2a3d', fontWeight: 600, fontSize: 15,
              border: '1.5px solid #d9e2ec', borderRadius: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <MapPin size={18} color="#16a687" /> View safety signals
            </button>
          </Link>
        </div>

        {/* Active signals */}
        {topPatterns.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374b65' }}>Active signals nearby</span>
              <Link to="/map" style={{ fontSize: 12, color: '#16a687', fontWeight: 500, textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topPatterns.map(p => (
                <Link key={p.id} to="/map" style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2eaf2',
                    borderLeft: p.status === 'Rising pattern' ? '4px solid #ef4444'
                      : p.status === 'Repeated concern' ? '4px solid #f97316'
                      : '4px solid #fbbf24',
                    borderRadius: 14, padding: '12px 14px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={15} color="#7892b8" />
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#1d2a3d' }}>{p.locationName}</span>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div style={{ marginTop: 4, marginLeft: 23, fontSize: 11, color: '#7892b8' }}>
                      {getCityByLocation(p.locationId)} · {p.reportCount} reports · {p.confidence}% confidence
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <DemoDataBanner />
        </div>
      </div>
    </div>
  );
}