import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopNav({ title }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-surface-border flex items-center justify-between px-6 z-40">
      
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-hover rounded-md">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-semibold text-on-surface truncate max-w-[120px] sm:max-w-none">{title}</h2>
      </div>

      {/* Middle: Search (hidden strictly on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full text-on-surface-light focus-within:text-primary">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg">search</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search activities..."
            className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface placeholder:text-on-surface-light"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-1 sm:gap-3">
        <button className="p-2 text-on-surface-variant hover:bg-surface-hover rounded-lg transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white"></span>
        </button>
        
        <div className="h-6 w-px bg-surface-border mx-1 hidden sm:block"></div>

        <div className="group relative">
          <button 
            className="flex items-center gap-3 p-1 hover:bg-surface-hover rounded-lg transition-colors pl-2"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-on-surface leading-tight">{user?.name || 'Guest User'}</span>
              <span className="text-xs text-on-surface-variant italic">Member</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary-dark font-bold text-sm flex items-center justify-center border border-primary/20">
              {initials}
            </div>
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-surface-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
            <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-hover flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">settings</span> Settings
            </button>
            <div className="h-px bg-surface-border my-1"></div>
            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">logout</span> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
