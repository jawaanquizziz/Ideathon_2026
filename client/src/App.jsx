import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { EcoProvider } from './context/EcoContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import SideNav from './components/SideNav';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import Splash from './components/Splash';
import EcoMascot from './components/EcoMascot';

// Pages
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Insights from './pages/Insights';
import ActivityHistory from './pages/ActivityHistory';
import Profile from './pages/Profile';

function MainLayout({ children, isMobile }) {
  const location = useLocation();
  
  // Set top nav title based on route
  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/dashboard': return 'Dashboard Overview';
      case '/assistant': return 'AI Assistant';
      case '/insights': return 'Environmental Insights';
      case '/activity': return 'Impact History';
      case '/profile': return 'User Profile';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {!isMobile && <SideNav />}
      <TopNav title={getTitle()} />
      <main className="min-h-screen">
        {children}
      </main>
      {isMobile && <BottomNav />}
    </div>
  );
}

function AppContent() {
  const { user, loading, showSplash, isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (showSplash) return <Splash />;
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center font-bold text-primary">Initializing ecosystem...</div>;
  if (!isAuthenticated) return <AuthPage />;

  return (
    <EcoProvider>
      <ChatProvider>
        <NotificationProvider>
          <MainLayout isMobile={isMobile}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/activity" element={<ActivityHistory />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </MainLayout>
          <EcoMascot />
        </NotificationProvider>
      </ChatProvider>
    </EcoProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

