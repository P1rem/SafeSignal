import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const authorityNavItems = [
  { to: '/authority', label: 'Overview', end: true },
  { to: '/authority/patterns', label: 'Patterns', end: false },
  { to: '/authority/analytics', label: 'Analytics', end: false },
];

export function AuthorityNav() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'linear-gradient(to bottom, #0d1520, #131c2b)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <Link to="/authority" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(52,193,158,0.15)',
              border: '1px solid rgba(52,193,158,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldCheck size={18} color="#34c19e" />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>SafeSignal</span>
              <span style={{ fontSize: 11, color: '#5c7ba0', marginLeft: 8 }}>Authority Console</span>
            </div>
          </Link>

          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#7892b8', textDecoration: 'none',
            padding: '6px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.15s',
          }}>
            <Home size={13} /> Citizen View
          </Link>
        </div>

        <nav style={{ display: 'flex', gap: 4, overflow: 'auto' }}>
          {authorityNavItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                padding: '10px 16px',
                fontSize: 13, fontWeight: 500,
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #34c19e' : '2px solid transparent',
                color: isActive ? '#fff' : '#7892b8',
                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderRadius: '6px 6px 0 0',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

interface CitizenBackBarProps {
  title?: string;
  backTo?: string;
  step?: { current: number; total: number };
}

export function CitizenBackBar({ title, backTo = '/', step }: CitizenBackBarProps) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'linear-gradient(to bottom, #0d1520, #131c2b)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 12px', height: 56, gap: 8 }}>
        <Link to={backTo} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, color: '#9fb3c8', textDecoration: 'none', padding: '6px 8px',
        }}>
          <ArrowLeft size={20} /> Back
        </Link>
        {title && <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{title}</span>}
        {step && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {Array.from({ length: step.total }, (_, i) => (
              <div key={i} style={{
                height: 6, borderRadius: 3,
                width: i + 1 === step.current ? 20 : 6,
                background: i + 1 <= step.current ? '#34c19e' : '#374b65',
                transition: 'all 0.2s',
              }} />
            ))}
            <span style={{ fontSize: 11, color: '#5c7ba0', marginLeft: 2 }}>{step.current}/{step.total}</span>
          </div>
        )}
      </div>
    </header>
  );
}