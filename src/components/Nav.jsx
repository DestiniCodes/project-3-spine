import { NavLink, useLocation } from 'react-router-dom';
import { useLibrary } from '../hooks/useLibrary';
import { useState } from 'react';

const links = [
  { to: '/',          label: 'Library'   },
  { to: '/search',    label: 'Search'    },
  { to: '/shelves',   label: 'Shelves'   },
  { to: '/favorites', label: 'Favorites' },
  { to: '/stats',     label: 'Stats'     },
];

export default function Nav() {
  const { userProfile, updateProfile } = useLibrary();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleDark = () => updateProfile({ darkMode: !userProfile.darkMode });

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 8px var(--shadow)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.01em' }}>
          {/* Book spine / stacked pages icon */}
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="9" height="19" rx="2" fill="var(--primary)" opacity="0.25"/>
            <rect x="7" y="3" width="9" height="19" rx="2" fill="var(--primary)" opacity="0.5"/>
            <rect x="11" y="2" width="11" height="21" rx="2" fill="var(--primary)"/>
            <rect x="13.5" y="7" width="5.5" height="1.4" rx="0.7" fill="white" opacity="0.85"/>
            <rect x="13.5" y="10.5" width="4" height="1.4" rx="0.7" fill="white" opacity="0.85"/>
            <rect x="13.5" y="14" width="6" height="1.4" rx="0.7" fill="white" opacity="0.85"/>
          </svg>
          Spine
        </NavLink>

        {/* Desktop nav */}
        <ul style={{ display: 'flex', gap: '4px', listStyle: 'none', alignItems: 'center' }} className="desktop-nav">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-dim)' : 'transparent',
                  transition: 'all 0.2s',
                })}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="btn-icon"
            title={userProfile.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ fontSize: '1.1rem' }}
          >
            {userProfile.darkMode ? '☀️' : '🌙'}
          </button>

          {/* Settings */}
          <NavLink
            to="/settings"
            className="btn-icon"
            title="Settings"
            style={({ isActive }) => ({ color: isActive ? 'var(--primary)' : undefined })}
          >
            ⚙️
          </NavLink>

          {/* Hamburger (mobile) */}
          <button
            className="btn-icon mobile-only"
            onClick={() => setMenuOpen((o) => !o)}
            style={{ fontSize: '1.2rem' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '12px 24px 20px',
        }}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'block',
                padding: '11px 0',
                borderBottom: '1px solid var(--border)',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--primary)' : 'var(--text)',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 640px) { .mobile-only { display: none !important; } }
        @media (max-width: 639px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  );
}
