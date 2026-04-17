import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEco } from '../context/EcoContext';
import { useNotifications } from '../context/NotificationContext';
import { getSearchMatches } from '../utils/SearchSuggestions';

export default function TopNav({ title }) {
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activities } = useEco();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  const results = getSearchMatches(query, activities);
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleResultClick = (result) => {
    if (result.type === 'ai') {
      navigate('/assistant', { state: { initialMessage: result.title } });
    } else {
      navigate('/activity');
    }
    setQuery('');
    setShowSearch(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-surface-border flex items-center justify-between px-6 z-40">
      
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-hover rounded-md">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-semibold text-on-surface truncate max-w-[120px] sm:max-w-none">{title}</h2>
      </div>

      {/* Middle: Global Intelligence Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={searchRef}>
        <div className="relative w-full text-on-surface-light focus-within:text-primary">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg">auto_awesome</span>
          <input
            type="text"
            value={query}
            onFocus={() => setShowSearch(true)}
            onChange={e => {
              setQuery(e.target.value);
              setShowSearch(true);
            }}
            placeholder="Search AI commands or activities..."
            className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface placeholder:text-on-surface-light"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearch && (query.length > 0 || results.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-surface-border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
            <div className="px-4 py-2 text-xs font-bold text-on-surface-light uppercase tracking-widest flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">psychology</span> Virtual IQ Results
            </div>
            {results.length > 0 ? (
              results.map((res, i) => (
                <button 
                  key={i}
                  onClick={() => handleResultClick(res)}
                  className="w-full text-left px-4 py-3 hover:bg-surface-hover flex items-center gap-3 transition-colors border-l-2 border-transparent hover:border-primary"
                >
                  <span className={`material-symbols-outlined text-lg ${res.type === 'ai' ? 'text-primary' : 'text-on-surface-variant'}`}>{res.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{res.title}</p>
                    {res.subtitle && <p className="text-xs text-on-surface-variant">{res.subtitle}</p>}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                No intelligence matches found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-1 sm:gap-3">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`p-2 rounded-lg transition-colors relative ${showNotifs ? 'bg-primary-light text-primary' : 'text-on-surface-variant hover:bg-surface-hover'}`}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-surface-border rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-surface border-b border-surface-border flex justify-between items-center">
                <span className="text-sm font-bold text-on-surface">AI Expert Alerts</span>
                <span className="text-xs text-primary font-medium">{unreadCount} New</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <button 
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        setShowNotifs(false);
                      }}
                      className={`w-full text-left px-4 py-4 hover:bg-surface transition-colors flex gap-3 border-b border-surface-border last:border-0 ${!n.read ? 'bg-primary/[0.03]' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'AI' ? 'bg-primary-light text-primary' : 'bg-warning-bg text-warning-dark'}`}>
                        <span className="material-symbols-outlined text-lg">{n.type === 'AI' ? 'auto_awesome' : 'info'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? 'font-bold' : 'font-medium'} text-on-surface truncate`}>{n.title}</p>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-on-surface-light mt-1 uppercase tracking-tighter">{n.date}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-12 text-center text-sm text-on-surface-variant">
                    No alerts at this moment.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
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
