import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isAdmin }) => {
  const links = isAdmin
    ? [
        { to: '/admin/dashboard', label: 'Overview', icon: '📊' },
        { to: '/admin/applications', label: 'Applications', icon: '📑' },
        { to: '/admin/users', label: 'Manage Users', icon: '👥' },
        { to: '/admin/reports', label: 'Reports', icon: '📈' },
      ]
    : [
        { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { to: '/apply', label: 'Apply Pass', icon: '📝' },
        { to: '/renew', label: 'Renew Pass', icon: '🔄' },
        { to: '/pass', label: 'Digital Pass', icon: '🎫' },
      ];

  return (
    <aside className="glass-panel" style={{ width: '260px', borderRadius: 0, minHeight: 'calc(100vh - 70px)', padding: '1.5rem 1rem' }}>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                fontSize: '0.92rem',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                background: isActive ? 'var(--primary-glow)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'var(--transition-fast)',
              })}
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;