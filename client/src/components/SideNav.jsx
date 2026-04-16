import { NavLink } from 'react-router-dom';
import { useEco } from '../context/EcoContext';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/assistant', icon: 'chat', label: 'AI Assistant' },
  { to: '/insights', icon: 'bar_chart', label: 'Insights' },
  { to: '/activity', icon: 'history', label: 'History' },
  { to: '/profile', icon: 'person', label: 'Profile' },
];

export default function SideNav() {
  const { stats } = useEco();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-white border-r border-surface-border z-50">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-surface-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-lg fill-1">eco</span>
        </div>
        <h1 className="font-headline text-lg font-bold text-on-surface">EcoSense</h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-on-surface-light uppercase tracking-wider mb-2">Main Menu</p>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive ? 'nav-active' : 'nav-inactive'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1 text-primary-dark' : 'text-on-surface-light'}`}>
                  {icon}
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Status Bottom - Dynamic from EcoContext */}
      <div className="p-4 m-4 bg-surface rounded-xl border border-surface-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary text-sm">workspace_premium</span>
          <p className="text-sm font-semibold text-on-surface">Pro Plan</p>
        </div>
        <div className="w-full bg-surface-border rounded-full h-1.5 mb-2">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-1000" 
            style={{ width: `${Math.min(100, stats?.score || 0)}%` }} 
          />
        </div>
        <p className="text-xs text-on-surface-variant">Level {Math.floor((stats?.score || 0) / 20) + 1} Progress</p>
      </div>
    </aside>
  );
}
