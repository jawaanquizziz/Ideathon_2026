import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const EcoContext = createContext({ stats: { score: 0, carbonSaved: 0, trend: '0%' }, activities: [], loading: true });

export function EcoProvider({ children }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ score: 0, carbonSaved: 0, trend: '0%' });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const headers = { 'x-user-id': user.id };
      
      const [scoreRes, activityRes] = await Promise.all([
        axios.get('/api/eco/score', { headers }),
        axios.get('/api/activity', { headers })
      ]);
      
      setStats(scoreRes.data);
      setActivities(activityRes.data.data);
    } catch (err) {
      console.error('Failed to fetch eco data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchAllData();
    }
  }, [user?.id, fetchAllData]);

  const logAction = async (actionData) => {
    if (!user?.id) return { success: false, error: 'Not authenticated' };
    
    try {
      const headers = { 'x-user-id': user.id };
      const res = await axios.post('/api/eco/log', actionData, { headers });
      
      setStats(res.data.stats);
      setActivities(prev => [res.data.activity, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Failed to log action:', err);
      return { success: false };
    }
  };

  return (
    <EcoContext.Provider value={{ stats, activities, loading, logAction, refresh: fetchAllData }}>
      {children}
    </EcoContext.Provider>
  );
}

export const useEco = () => {
  const context = useContext(EcoContext);
  if (!context) {
    return { stats: { score: 0, carbonSaved: 0, trend: '0%' }, activities: [], loading: true };
  }
  return context;
};
