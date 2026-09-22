import { NavLink, useLocation } from 'react-router-dom';
import { Home, MapPinned, ShieldAlert, Plus } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/map', label: 'Signals', icon: MapPinned },
  { to: '/authority', label: 'Authority', icon: ShieldAlert },
];

export function BottomNav() {
  const location = useLocation();
  const hideOnRoutes = ['/report/success', '/report/location', '/report/type', '/sos'];
  if (hideOnRoutes.includes(location.pathname)) return null;

  return (
    <>
      <NavLink
        to="/report/type"
        style={{
          position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
          zIndex: 50, width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(to bottom, #16a687, #0d8470)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(13,132,112,0.5)',
          textDecoration: 'none',
        }}
        aria-label="Report an incident"
      >
        <Plus size={26} color="white" />
      </NavLink>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(188,204,220,0.5)',
      }}>
        <div style={{
          maxWidth: 480, margin: '0 auto',
          display: 'flex', justifyContent: 'space-around',
          padding: '6px 8px',
          paddingBottom: 'env(safe-area-inset-bottom, 6px)',
        }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, flex: 1, padding: '6px 8px', borderRadius: 12,
                textDecoration: 'none',
                background: isActive ? 'rgba(22,166,135,0.1)' : 'transparent',
                color: isActive ? '#0d8470' : '#7892b8',
                minHeight: 44,
                justifyContent: 'center',
                transition: 'all 0.15s',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} color={isActive ? '#0d8470' : '#7892b8'} />
                  <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}