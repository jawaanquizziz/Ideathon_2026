import { NavLink } from 'react-router-dom';

const mobileNavItems = [
  { to: '/', icon: 'dashboard', label: 'Home' },
  { to: '/assistant', icon: 'chat', label: 'AI' },
  { to: '/insights', icon: 'bar_chart', label: 'Insights' },
  { to: '/activity', icon: 'history', label: 'History' },
  { to: '/profile', icon: 'person', label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-border flex justify-around items-center py-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe lg:hidden">
      {mobileNavItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[64px] ${
              isActive
                ? 'text-primary'
                : 'text-on-surface-light hover:text-on-surface hover:bg-surface-hover'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-[24px] mb-1"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {icon}
              </span>
              <span className="text-[10px] font-semibold">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
